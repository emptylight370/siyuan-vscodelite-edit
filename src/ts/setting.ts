import { _getFile, _postMessage, _reEnableTheme, _reloadInterface, _writeFile, getMsg } from "./api";
import { destroyTypewriterMode } from "./plugins/typewriter";
import { SettingItem, SettingPanelId, ThemeConfig, vscMessage } from "./types";

/**
 * 创建一个包含标签和复选框的 HTML 结构
 * @since 1.2.2
 * @version 2.6.3
 */
export async function createSettingsWindow() {
    // 获取设置数组
    const settingsPromise = fetchSettingsPanelArray();

    // 创建设置窗口大框
    const dialogSetting: HTMLDivElement = document.createElement("div");
    dialogSetting.setAttribute("data-key", "dialog-setting");
    dialogSetting.className = "b3-dialog--open";
    dialogSetting.id = "vsceThemeSettingDialog";
    document.body.appendChild(dialogSetting);

    // 创建一个遮罩层
    const dialog: HTMLDivElement = document.createElement("div");
    dialog.className = "b3-dialog";
    dialog.style.zIndex = "24";
    dialogSetting.appendChild(dialog);

    // 可关闭遮罩层
    const scrim: HTMLDivElement = document.createElement("div");
    scrim.className = "b3-dialog__scrim";
    scrim.addEventListener("click", () => {
        closeNotSave();
    });
    dialog.appendChild(scrim);

    // 创建窗口容器
    const dialogContainer: HTMLDivElement = document.createElement("div");
    dialogContainer.className = "b3-dialog__container";
    if (document.body.classList.contains("vscmobile")) {
        // 移动端
        dialogContainer.style.width = "90vw";
    } else {
        // 电脑端
        dialogContainer.style.width = "60vw";
    }
    dialogContainer.style.maxWidth = "1280px";
    dialogContainer.style.height = "80vh";
    dialog.appendChild(dialogContainer);

    // 创建设置窗口
    const dialogBody: HTMLDivElement = document.createElement("div");
    dialogBody.className = "b3-dialog__body";
    dialogBody.setAttribute("vslite", "SettingPanel");
    dialogContainer.appendChild(dialogBody);

    // 创建标题
    const title: HTMLHeadingElement = document.createElement("h2");
    title.textContent = getMsg("settingPanelTitle");
    title.setAttribute("data-subtype", "h2");
    // title.setAttribute("data-type", "NodeHeading");
    title.className = "h2";
    dialogBody.appendChild(title);

    // 创建上方的标签页
    const tabbar: HTMLDivElement = document.createElement("div");
    tabbar.className = "layout-tab-bar fn__flex";
    tabbar.appendChild(createTab(getMsg("settingTabSiYuan"), "tabThemeSiYuan"));
    (tabbar.lastChild as HTMLDivElement).classList.add("item--focus");
    changeHints(tabbar.lastChild as HTMLDivElement, "tabTipSiYuan");
    tabbar.appendChild(createTab(getMsg("settingTabPlugin"), "tabThemePlugin"));
    changeHints(tabbar.lastChild as HTMLDivElement, "tabTipPlugin");
    dialogBody.appendChild(tabbar);

    // 创建下方的设置页
    const pages: HTMLDivElement = document.createElement("div");
    pages.className = "fn__flex-1";
    const SiyuanPage: HTMLDivElement = document.createElement("div");
    SiyuanPage.className = "config-bazaar__panel ThemeSettingPage";
    SiyuanPage.setAttribute("data-tab", "tabThemeSiYuan");
    pages.appendChild(SiyuanPage);
    const PluginPage: HTMLDivElement = document.createElement("div");
    PluginPage.className = "config-bazaar__panel ThemeSettingPage fn__none";
    PluginPage.setAttribute("data-tab", "tabThemePlugin");
    pages.appendChild(PluginPage);
    changeHints(pages, "tipSwitch");
    dialogBody.appendChild(pages);

    // & 等待获取到设置数组再进行
    const settings: SettingItem[] = await settingsPromise;

    // & 遍历数组添加选项，创建标签和复选框
    settings.forEach((setting) => {
        addSettingsToPage(SiyuanPage, PluginPage, setting);
    });

    // & 创建关闭按钮的容器
    const buttons: HTMLDivElement = document.createElement("div");
    buttons.className = "fn__flex";
    // * 创建左侧的提示文本
    const hints: HTMLSpanElement = document.createElement("span");
    hints.id = "vsceSettingHint";
    hints.className = "fn__flex-1 fn__flex-center";
    hints.innerText = getMsg("tipSwitch");
    // * 创建保存按钮
    const saveButton = document.createElement("button");
    saveButton.textContent = getMsg("saveReload");
    saveButton.className = "b3-button b3-button--text";
    saveButton.addEventListener("click", closeAndSave); // 保存并刷新页面
    changeHints(saveButton, "tipSave");
    // * 创建不保存按钮
    const notSaveButton = document.createElement("button");
    notSaveButton.textContent = getMsg("nSave");
    notSaveButton.className = "b3-button b3-button--cancel";
    notSaveButton.addEventListener("click", closeNotSave); // 不保存修改
    changeHints(notSaveButton, "tipSave");
    // * 创建显示更新提示按钮
    const newVersionTipsButton = document.createElement("button");
    newVersionTipsButton.innerHTML = '<svg style="margin-right: 0"><use xlink:href="#iconInbox"></use></svg>';
    newVersionTipsButton.className = "b3-button b3-button--cancel";
    newVersionTipsButton.addEventListener("click", () => {
        updateLastSeen(globalThis.vscDefaultConf.lastSeen, true);
    });
    changeHints(newVersionTipsButton, "oUpdate");
    // * 创建刷新按钮
    const refreshButton = document.createElement("button");
    refreshButton.innerHTML = '<svg style="margin-right: 0"><use xlink:href="#iconRefresh"></use></svg>';
    refreshButton.className = "b3-button b3-button--cancel";
    refreshButton.addEventListener("click", _reloadInterface); // 刷新界面
    changeHints(refreshButton, "oReload");
    // * 添加文本和按钮
    buttons.appendChild(hints);
    buttons.appendChild(saveButton);
    buttons.appendChild(notSaveButton);
    buttons.appendChild(newVersionTipsButton);
    buttons.appendChild(refreshButton);
    dialogBody.appendChild(buttons);

    /**
     * 在鼠标移动到对应元素时候显示对应的提示
     * @param element 元素
     * @param messageKey 消息key名称
     * @since 2.5.0
     * @version 2.7.7
     */
    function changeHints(element: HTMLElement, messageKey: Exclude<keyof vscMessage, "language">) {
        const showMessage = () => {
            hints.innerText = getMsg(messageKey);
        };

        element.addEventListener("pointerenter", showMessage);
        element.addEventListener("touchstart", showMessage);
    }
}

/**
 * NOTE 创建标签页的工具函数
 * @param name 标签页名称
 * @param id 标签页id
 * @returns HTMLDivElement
 * @since 2.5.0
 * @version 2.5.0
 */
function createTab(name: string, id: string) {
    const tab = document.createElement("div");
    tab.id = id;
    // ThemeSettingTab 是标签页的通用类名
    tab.className = "item item--full ThemeSettingTab";
    tab.addEventListener("click", switchTab);
    const flex = document.createElement("span");
    flex.className = "fn__flex-1";
    const text = document.createElement("span");
    text.innerText = name;
    tab.appendChild(flex.cloneNode(true));
    tab.appendChild(text);
    tab.appendChild(flex.cloneNode(true));
    return tab;
}

/**
 * NOTE 切换标签页的工具函数
 * @param event 鼠标点击事件
 * @since 2.5.0
 * @version 2.5.0
 */
function switchTab(event: MouseEvent) {
    // 点击目标
    const target = event.currentTarget as HTMLDivElement;
    const id = target.id;

    // 切换标签页状态
    const tabs = document.getElementsByClassName("ThemeSettingTab");
    for (let tab of Array.from(tabs)) {
        if (tab.id === id) {
            tab.classList.add("item--focus");
        } else {
            tab.classList.remove("item--focus");
        }
    }

    // 切换设置页状态
    const pages = document.getElementsByClassName("ThemeSettingPage");
    for (let page of Array.from(pages)) {
        if (page.getAttribute("data-tab") === id) {
            page.classList.remove("fn__none");
        } else {
            page.classList.add("fn__none");
        }
    }
}

/**
 * NOTE 添加设置项到对应的设置页面
 * @param siyuan 思源标签页
 * @param plugin 插件标签页
 * @param setting 单个设置项
 * @since 2.5.0
 * @version 2.7.0
 */
function addSettingsToPage(siyuan: HTMLDivElement, plugin: HTMLDivElement, setting: SettingItem) {
    let label: HTMLDivElement | HTMLSpanElement;
    // 根据是否有下方注释选择不同的结构
    if (setting?.description) {
        label = document.createElement("div");
    } else {
        label = document.createElement("span");
    }
    // 设定当前选项标题
    label.textContent = setting.label;
    label.setAttribute("for", setting.id as string);
    label.className = "fn__flex-1";

    // 有注释需要进行添加，没有就跳过
    if (setting?.description) {
        const description: HTMLDivElement = document.createElement("div");
        description.textContent = setting.description;
        description.setAttribute("for", setting.id as string);
        description.className = "b3-label__text";
        label.appendChild(description);
    }

    // 添加中间的间隔
    const space: HTMLSpanElement = document.createElement("span");
    space.className = "fn__space";

    // 右侧的开关
    const checkbox: HTMLInputElement = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = setting.id as string;
    checkbox.checked = setting.enable;
    checkbox.className = "b3-switch fn__flex-center vslite_sets";

    // 创建一整行的容器
    const div: HTMLLabelElement = document.createElement("label");
    div.className = "fn__flex b3-label";
    div.appendChild(label);
    div.appendChild(space);
    div.appendChild(checkbox);

    // 确定它在配置文件中的分类
    if (setting.id in globalThis.vscDefaultConf.theme) {
        // 将设置项容器放入思源页面
        siyuan.appendChild(div);
    } else if (setting.id in globalThis.vscDefaultConf.plugins) {
        // 将设置项容器放入插件页面
        plugin.appendChild(div);
    }
}

/**
 * NOTE 工具函数，保存设置并刷新思源
 * @since 1.2.2
 * @version 3.0.1
 */
async function closeAndSave() {
    const dialog = document.getElementById("vsceThemeSettingDialog") as HTMLDivElement;

    // 在默认配置的基础上修改配置，可以增加原来没有的配置
    let saveSt: ThemeConfig = globalThis.vscDefaultConf;
    const ckb = document.getElementsByClassName("vslite_sets");
    // 获取当前设置项的启用状态
    Array.from(ckb).forEach((checkbox) => {
        const id = checkbox.id as SettingPanelId;
        const ck = (checkbox as HTMLInputElement).checked;
        // ! 保存设置到json
        if (id in globalThis.vscDefaultConf.theme) {
            saveSt.theme[id as keyof typeof globalThis.vscDefaultConf.theme] = ck;
        } else if (id in globalThis.vscDefaultConf.plugins) {
            saveSt.plugins[id as keyof typeof globalThis.vscDefaultConf.plugins] = ck;
        }
    });
    // 修改配置文件版本
    saveSt["version"] = globalThis.vscDefaultConf["version"];
    // 保存设置文件
    await putSettings(saveSt);
    // 显示完成通知
    _postMessage("ok", getMsg("confSave"));
    // 先移除打字机模式的事件监听器
    destroyTypewriterMode();
    // 稍后重载页面
    setTimeout(() => {
        // _reloadInterface();
        _reEnableTheme();
    }, 200);
    // 移除设置窗口
    document.body.removeChild(dialog);
}

/**
 * NOTE 工具函数，不保存设置
 * @since 1.2.2
 * @version 2.7.7
 */
function closeNotSave() {
    const dialog = document.getElementById("vsceThemeSettingDialog") as HTMLDivElement;

    // 显示不保存通知
    _postMessage("error", getMsg("confNotSave"), 3000);
    // 移除设置窗口
    document.body.removeChild(dialog);
}

/**
 * NOTE 获取设置界面的定义数组
 * @returns Promise&lt;SettingItem[]%gt;
 * @since 2.1.0
 * @version 3.0.0
 */
async function fetchSettingsPanelArray() {
    const config: ThemeConfig | null = await _getFile("/data/snippets/vsc_edit.config.json");
    // 如果没有获取到配置文件则使用默认配置文件
    const v: ThemeConfig = config ?? globalThis.vscDefaultConf;
    // 生成并返回设置项列表
    // 定义设置页的设置项数组
    let settings: SettingItem[] = [];
    // ! 设置页添加设置选项
    // 标题
    settings.push({
        label: getMsg("tititem"),
        id: "title",
        enable: v?.theme?.title ?? globalThis.vscDefaultConf.theme.title,
    });
    // 标题阴影
    settings.push({
        label: getMsg("titleShadow"),
        description: getMsg("titleShadowDesc"),
        id: "titleShadow",
        enable: v?.theme?.titleShadow ?? globalThis.vscDefaultConf.theme.titleShadow,
    });
    // 标题图标
    settings.push({
        label: getMsg("titleIcon"),
        description: getMsg("titleIconDesc"),
        id: "titleIcon",
        enable: v?.theme?.titleIcon ?? globalThis.vscDefaultConf.theme.titleIcon,
    });
    // 文档树和大纲
    settings.push({
        label: getMsg("ftitem"),
        id: "doctree",
        enable: v?.theme?.doctree ?? globalThis.vscDefaultConf.theme.doctree,
    });
    // 代码块
    settings.push({
        label: getMsg("cbitem"),
        id: "codeBlock",
        enable: v?.theme?.codeBlock ?? globalThis.vscDefaultConf.theme.codeBlock,
    });
    // 引用
    settings.push({
        label: getMsg("refitem"),
        id: "reference",
        enable: v?.theme?.reference ?? globalThis.vscDefaultConf.theme.reference,
    });
    // 标记
    settings.push({
        label: getMsg("markitem"),
        id: "mark",
        enable: v?.theme?.mark ?? globalThis.vscDefaultConf.theme.mark,
    });
    // 标签
    settings.push({
        label: getMsg("tagitem"),
        description: getMsg("tagdesc"),
        id: "tag",
        enable: v?.theme?.tag ?? globalThis.vscDefaultConf.theme.tag,
    });
    // 集市
    settings.push({
        label: getMsg("bazitem"),
        id: "bazaar",
        enable: v?.theme?.bazaar ?? globalThis.vscDefaultConf.theme.bazaar,
    });
    // 嵌入块
    settings.push({
        label: getMsg("emitem"),
        description: getMsg("emdesc"),
        id: "embeddedBlock",
        enable: v?.theme?.embeddedBlock ?? globalThis.vscDefaultConf.theme.embeddedBlock,
    });
    // 数据库
    settings.push({
        label: getMsg("dbitem"),
        id: "database",
        enable: v?.theme?.database ?? globalThis.vscDefaultConf.theme.database,
    });
    // 快捷键面板
    settings.push({
        label: getMsg("scitem"),
        id: "shortcutPanel",
        enable: v?.plugins?.shortcutPanel ?? globalThis.vscDefaultConf.plugins.shortcutPanel,
    });
    // 替换背景图片插件电脑端
    settings.push({
        label: getMsg("bgdesktop"),
        description: getMsg("bgdesc"),
        id: "backgroundCoverDesktop",
        enable: v?.plugins?.backgroundCoverDesktop ?? globalThis.vscDefaultConf.plugins.backgroundCoverDesktop,
    });
    // 替换背景图片插件移动端
    settings.push({
        label: getMsg("bgmobile"),
        description: getMsg("bgdesc"),
        id: "backgroundCoverMobile",
        enable: v?.plugins?.backgroundCoverMobile ?? globalThis.vscDefaultConf.plugins.backgroundCoverMobile,
    });
    // 数学公式增强插件
    settings.push({
        label: getMsg("mathitem"),
        description: getMsg("mathdesc"),
        id: "mathPanel",
        enable: v?.plugins?.mathPanel ?? globalThis.vscDefaultConf.plugins.mathPanel,
    });
    // 双标签栏
    settings.push({
        label: getMsg("doubleTabbaritem"),
        description: getMsg("doubleTabbardesc"),
        id: "doubleTabbar",
        enable: v?.plugins?.doubleTabbar ?? globalThis.vscDefaultConf.plugins.doubleTabbar,
    });
    // 斜杠菜单多栏显示
    settings.push({
        label: getMsg("slashMenuitem"),
        id: "slashMenu",
        enable: v?.theme?.slashMenu ?? globalThis.vscDefaultConf.theme.slashMenu,
    });
    // 打字机模式
    settings.push({
        label: getMsg("typewriteritem"),
        description: getMsg("typewriterdesc"),
        id: "typewriter",
        enable: v?.plugins?.typewriter ?? globalThis.vscDefaultConf.plugins.typewriter,
    });
    return settings;
}

/**
 * ! 获取当前启用的设置项
 * @returns Promise&lt;SettingPanelId[]&gt;
 * @since 1.2.0
 * @version 2.7.0
 */
export async function getSettings(): Promise<SettingPanelId[]> {
    // var res = _analyseResponse(_getFile("/data/snippets/vsc_edit.config.json"));
    let config: ThemeConfig | null = await _getFile("/data/snippets/vsc_edit.config.json");
    // 如果未获取到配置文件，则使用默认配置生成文件
    if (!config) {
        config = globalThis.vscDefaultConf;
        await putSettings(config);
    }
    // 解析并返回当前启用的设置项
    // 建立启用设置项的数组
    let lab: SettingPanelId[] = [];
    // 检测配置文件的版本
    if (config["version"] < globalThis.vscDefaultConf["version"] || config["version"] == undefined) {
        // console.log(settings["version"]);
        await _postMessage("ok", getMsg("confUpdate"));
    }
    // ! 主题更新后提示通知
    if (config["lastSeen"] !== globalThis.vscDefaultConf["lastSeen"] || config["lastSeen"] == undefined) {
        await updateLastSeen(globalThis.vscDefaultConf.lastSeen, false);
    }
    // ! 从设置中获取启用的设置项
    // 主题设置项
    Object.entries(config.theme).forEach(([key, enabled]) => {
        if (enabled) lab.push(key as SettingPanelId);
    });
    // 插件设置项
    Object.entries(config.plugins).forEach(([key, enabled]) => {
        if (enabled) lab.push(key as SettingPanelId);
    });
    return lab;
}

/**
 * ! 保存设置
 * @param settings
 * @returns Promise&lt;void&gt;
 * @since 1.2.0
 * @version 2.4.2
 */
export async function putSettings(settings: ThemeConfig) {
    if (settings == null) {
        return;
    }
    await _writeFile("/data/snippets/vsc_edit.config.json", JSON.stringify(settings), false, Date.now());
}

/**
 * 更新上次使用的主题版本号
 * @param version 新版本号
 * @param showMsg 是否显示通知
 * @since 2.6.1
 * @version 2.6.3
 */
async function updateLastSeen(version: string, showMsg: boolean) {
    // 先发送通知，需要手动关闭，显示10分钟应该够久了
    if (showMsg) await _postMessage("ok", getMsg("newVersionHint"), 600000);

    // 发布模式下直接返回避免写入操作被禁止
    if (window.siyuan.isPublish == true) return;

    // 获取配置文件
    let config: ThemeConfig | null = await _getFile("/data/snippets/vsc_edit.config.json");
    // 如果未获取到配置文件，则使用默认配置生成文件
    if (!config) {
        config = globalThis.vscDefaultConf;
        await putSettings(config);
    }
    config.lastSeen = version;
    await _writeFile("/data/snippets/vsc_edit.config.json", JSON.stringify(config), false, Date.now());
}
