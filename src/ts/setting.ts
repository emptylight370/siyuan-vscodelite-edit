import { _getFile, _postMessage, _reloadInterface, _writeFile } from "./api";
import { settingKeyMap } from "./types";
import { EnableSettings, LocalMessage, SettingItem, SettingPanelId, ThemeConfig } from "./types.d";

/**
 * 创建一个包含标签和复选框的 HTML 结构
 */
export async function createSettingsWindow() {
    // 获取设置数组
    const settingsPromise = fetchSettingsArray();

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
    title.textContent = localMessage.settingPanelTitle[defLag];
    title.setAttribute("data-subtype", "h2");
    // title.setAttribute("data-type", "NodeHeading");
    title.className = "h2";
    dialogBody.appendChild(title);

    // 创建上方的标签页
    const tabbar: HTMLDivElement = document.createElement("div");
    tabbar.className = "layout-tab-bar fn__flex";
    tabbar.appendChild(createTab(globalThis.localMessage.settingTabSiYuan[globalThis.defLag], "tabThemeSiYuan"));
    (tabbar.lastChild as HTMLDivElement).classList.add("item--focus");
    changeHints(tabbar.lastChild as HTMLDivElement, "tabTipSiYuan");
    tabbar.appendChild(createTab(globalThis.localMessage.settingTabPlugin[globalThis.defLag], "tabThemePlugin"));
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

    // 等待获取到设置数组再进行
    const settings: SettingItem[] = await settingsPromise;

    // 遍历数组添加选项，创建标签和复选框
    settings.forEach((setting) => {
        addSettingsToPage(SiyuanPage, PluginPage, setting);
    });

    // 创建关闭按钮的容器
    const buttons: HTMLDivElement = document.createElement("div");
    buttons.className = "fn__flex";
    // 创建左侧的提示文本
    const hints: HTMLSpanElement = document.createElement("span");
    hints.id = "vsceSettingHint";
    hints.className = "fn__flex-1 fn__flex-center";
    hints.innerText = globalThis.localMessage.tipSwitch[globalThis.defLag];
    // 创建保存按钮
    const saveButton = document.createElement("button");
    saveButton.textContent = globalThis.localMessage.saveReload[globalThis.defLag];
    saveButton.className = "b3-button b3-button--text";
    saveButton.addEventListener("click", closeAndSave); // 保存并刷新页面
    changeHints(saveButton, "tipSave");
    // 创建不保存按钮
    const notSaveButton = document.createElement("button");
    notSaveButton.textContent = globalThis.localMessage.nSave[globalThis.defLag];
    notSaveButton.className = "b3-button b3-button--cancel";
    notSaveButton.addEventListener("click", closeNotSave); // 不保存修改
    changeHints(notSaveButton, "tipSave");
    // 创建刷新按钮
    const refreshButton = document.createElement("button");
    refreshButton.innerHTML = '<svg style="margin-right: 0"><use xlink:href="#iconRefresh"></use></svg>';
    refreshButton.className = "b3-button b3-button--cancel";
    refreshButton.addEventListener("click", _reloadInterface); // 刷新界面
    changeHints(refreshButton, "oReload");
    // 添加文本和按钮
    buttons.appendChild(hints);
    buttons.appendChild(saveButton);
    buttons.appendChild(notSaveButton);
    buttons.appendChild(refreshButton);
    dialogBody.appendChild(buttons);

    function changeHints(element: HTMLElement, messageKey: keyof LocalMessage) {
        const showMessage = () => {
            hints.innerText = globalThis.localMessage[messageKey][globalThis.defLag] as string;
        };

        element.addEventListener("pointerenter", showMessage);
        element.addEventListener("touchstart", showMessage);
    }
}

/**
 * NOTE 创建标签页的工具函数
 * @returns HTMLDivELement
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
    const mapping = settingKeyMap[setting.id as keyof typeof settingKeyMap];
    if (mapping) {
        if (mapping.section === "theme") {
            // 将设置项容器放入思源页面
            siyuan.appendChild(div);
        } else if (mapping.section === "plugins") {
            // 将设置项容器放入插件页面
            plugin.appendChild(div);
        }
    }
}

/**
 * NOTE 工具函数，保存设置并刷新思源
 */
async function closeAndSave() {
    const dialog = document.getElementById("vsceThemeSettingDialog");

    // 在默认配置的基础上修改配置，可以增加原来没有的配置
    let saveSt: ThemeConfig = defaultConf;
    const ckb = document.getElementsByClassName("vslite_sets");
    // 获取当前设置项的启用状态
    Array.from(ckb).forEach((checkbox) => {
        const id = checkbox.id as SettingPanelId;
        const ck = (checkbox as HTMLInputElement).checked;
        // ! 保存设置到json
        const mapping = settingKeyMap[id];
        if (mapping) {
            saveSt[mapping.section][mapping.key] = ck;
        }
    });
    // 修改配置文件版本
    saveSt["version"] = defaultConf["version"];
    // 保存设置文件
    await putSettings(saveSt);
    // 显示完成通知
    _postMessage("ok", localMessage.confSave[defLag]);
    // 稍后重载页面
    setTimeout(() => {
        _reloadInterface();
    }, 200);
    // 移除设置窗口
    document.body.removeChild(dialog);
}

/**
 * NOTE 工具函数，不保存设置
 */
function closeNotSave() {
    const dialog = document.getElementById("vsceThemeSettingDialog");

    // 显示不保存通知
    _postMessage("error", localMessage.confNotSave[defLag], 3000);
    // 移除设置窗口
    document.body.removeChild(dialog);
}

/**
 * NOTE 获取设置文件数组
 * @returns Promise\<SettingItem[]\>
 */
async function fetchSettingsArray() {
    const config: ThemeConfig | null = await _getFile("/data/snippets/vsc_edit.config.json");
    // 如果没有获取到配置文件则使用默认配置文件
    const v: ThemeConfig = config ?? defaultConf;
    // 生成并返回设置项列表
    return await getSettingArrays(v);
}

/**
 * NOTE 定义向设置面板中添加的设置项（数组）
 * @param v ThemeConfig
 * @returns Promise\<SettingItem[]\>
 */
async function getSettingArrays(v: ThemeConfig) {
    let settings: SettingItem[] = [];
    // ! 设置页添加设置选项
    // 标题
    settings.push({ label: localMessage.tititem[defLag], id: "titleBlock", enable: v?.theme?.title ?? true });
    // 标题阴影
    settings.push({
        label: localMessage.titleShadow[defLag],
        description: localMessage.titleShadowDesc[defLag],
        id: "titleShadow",
        enable: v?.theme?.titleShadow ?? true,
    });
    // 标题图标
    settings.push({
        label: localMessage.titleIcon[defLag],
        description: localMessage.titleIconDesc[defLag],
        id: "titleIcon",
        enable: v?.theme?.titleIcon ?? true,
    });
    // 文档树和大纲
    settings.push({ label: localMessage.ftitem[defLag], id: "doctree", enable: v?.theme?.doctree ?? true });
    // 代码块
    settings.push({ label: localMessage.cbitem[defLag], id: "codeBlock", enable: v?.theme?.codeBlock ?? true });
    // 引用
    settings.push({
        label: localMessage.refitem[defLag],
        id: "referenceBlock",
        enable: v?.theme?.reference ?? true,
    });
    // 标记
    settings.push({ label: localMessage.markitem[defLag], id: "mark", enable: v?.theme?.mark ?? true });
    // 标签
    settings.push({
        label: localMessage.tagitem[defLag],
        description: localMessage.tagdesc[defLag],
        id: "tagStyle",
        enable: v?.theme?.tag ?? true,
    });
    // 集市
    settings.push({ label: localMessage.bazitem[defLag], id: "bazaarStyle", enable: v?.theme?.bazaar ?? true });
    // 嵌入块
    settings.push({
        label: localMessage.emitem[defLag],
        description: localMessage.emdesc[defLag],
        id: "embeddedBlock",
        enable: v?.theme?.embeddedBlock ?? true,
    });
    // 数据库
    settings.push({ label: localMessage.dbitem[defLag], id: "database", enable: v?.theme?.database ?? true });
    // 快捷键面板
    settings.push({
        label: localMessage.scitem[defLag],
        id: "scPanelStyle",
        enable: v?.plugins?.shortcutPanel ?? true,
    });
    // 替换背景图片插件电脑端
    settings.push({
        label: localMessage.bgdesktop[defLag],
        description: localMessage.bgdesc[defLag],
        id: "backgroundCoverDesktop",
        enable: v?.plugins?.backgroundCoverDesktop ?? true,
    });
    // 替换背景图片插件移动端
    settings.push({
        label: localMessage.bgmobile[defLag],
        description: localMessage.bgdesc[defLag],
        id: "backgroundCoverMobile",
        enable: v?.plugins?.backgroundCoverMobile ?? false,
    });
    // 数学公式增强插件
    settings.push({
        label: localMessage.mathitem[defLag],
        description: localMessage.mathdesc[defLag],
        id: "mathPanel",
        enable: v?.plugins?.mathPanel ?? false,
    });
    // 双标签栏
    settings.push({
        label: localMessage.doubleTabbaritem[defLag],
        description: localMessage.doubleTabbardesc[defLag],
        id: "doubleTabbar",
        enable: v?.plugins?.doubleTabbar ?? false,
    });
    return settings;
}

/**
 * ! 获取设置
 * @returns Promise\<EnableSettings[]\>
 */
export async function getSettings(): Promise<EnableSettings[]> {
    // var res = _analyseResponse(_getFile("/data/snippets/vsc_edit.config.json"));
    let config: ThemeConfig | null = await _getFile("/data/snippets/vsc_edit.config.json");
    // 如果未获取到配置文件，则使用默认配置生成文件
    if (!config) {
        config = globalThis.defaultConf;
        await putSettings(config);
    }
    // 解析并返回当前启用的设置项
    return await showElementSettings(config);
}

/**
 * ! 保存设置
 * @param settings
 * @returns Promise\<void\>
 */
export async function putSettings(settings: ThemeConfig) {
    if (settings == null) {
        return;
    }
    await _writeFile("/data/snippets/vsc_edit.config.json", JSON.stringify(settings), false, Date.now());
}

/**
 * ! 获取当前启用的设置并返回对应的列表
 * @param settings
 * @returns Promise\<EnableSettings[]\>
 */
async function showElementSettings(settings: ThemeConfig) {
    let lab: EnableSettings[] = [];
    // 检测配置文件的版本
    if (settings["version"] < defaultConf["version"] || settings["version"] == undefined) {
        // console.log(settings["version"]);
        await _postMessage("ok", localMessage.confUpdate[defLag]);
    }
    // ! 从设置中获取启用的设置项
    // 主题设置项
    Object.entries(settings.theme).forEach(([key, enabled]) => {
        if (enabled) lab.push(key as EnableSettings);
    });
    // 插件设置项
    Object.entries(settings.plugins).forEach(([key, enabled]) => {
        if (enabled) lab.push(key as EnableSettings);
    });
    return lab;
}
