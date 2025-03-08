import {
    _getFile,
    _postMessage,
    _writeFile
} from "./api";
import {
    EnableSettings,
    SettingItem,
    settingKeyMap,
    SettingPanelId,
    ThemeConfig
} from "./types";

/**
 * 创建一个包含标签和复选框的 HTML 结构
 */
export async function createSettingsWindow() {
    // 创建设置窗口大框
    var dialogSetting: HTMLDivElement = document.createElement('div');
    dialogSetting.setAttribute("data-key", "dialog-setting");
    dialogSetting.className = "b3-dialog--open";
    document.body.appendChild(dialogSetting);

    // 创建一个遮罩层
    var dialog: HTMLDivElement = document.createElement('div');
    dialog.className = "b3-dialog";
    dialog.style.zIndex = '14';
    dialogSetting.appendChild(dialog);

    // 可关闭遮罩层
    var scrim: HTMLDivElement = document.createElement('div');
    scrim.className = "b3-dialog__scrim";
    scrim.onclick = () => {
        closeNotSave();
    };
    dialog.appendChild(scrim);

    // 创建窗口容器
    var dialogContainer: HTMLDivElement = document.createElement('div');
    dialogContainer.className = "b3-dialog__container";
    if (document.body.classList.contains('vscmobile')) {
        dialogContainer.style.width = '90vw';
    } else {
        dialogContainer.style.width = '60vw';
    }
    dialogContainer.style.height = '80vh';
    dialog.appendChild(dialogContainer);

    // 创建设置窗口
    var dialogBody: HTMLDivElement = document.createElement('div');
    dialogBody.className = 'b3-dialog__body';
    dialogBody.setAttribute("vslite", "SettingPanel");
    dialogContainer.appendChild(dialogBody);

    // 创建标题
    var title: HTMLHeadingElement = document.createElement('h2');
    title.textContent = localMessage["settingPanelTitle"][defLag];
    title.setAttribute("data-subtype", "h2");
    // title.setAttribute("data-type", "NodeHeading");
    title.className = "h2";
    dialogBody.appendChild(title);

    // 获取设置数组
    var settings: SettingItem[] = await fetchSettingsArray();

    // 遍历数组添加选项，创建标签和复选框
    settings.forEach(setting => {
        var label: HTMLDivElement | HTMLSpanElement;
        if (setting?.description) {
            label = document.createElement('div');
        } else {
            label = document.createElement('span');
        }
        label.textContent = setting.label;
        label.setAttribute("for", (setting.id as string));
        label.className = "fn__flex-1";

        if (setting?.description) {
            var description: HTMLDivElement = document.createElement('div');
            description.textContent = setting.description;
            description.setAttribute("for", (setting.id as string));
            description.className = "b3-label__text";
            label.appendChild(description);
        }

        var space: HTMLSpanElement = document.createElement('span');
        space.className = 'fn__space';

        var checkbox: HTMLInputElement = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = setting.id as string;
        checkbox.checked = setting.enable;
        checkbox.className = "b3-switch fn__flex-center vslite_sets";

        var div: HTMLLabelElement = document.createElement('label');
        div.className = "fn__flex b3-label";
        div.appendChild(label);
        div.appendChild(space);
        div.appendChild(checkbox);

        dialogBody.appendChild(div);
    });

    async function closeAndSave() {
        // 在默认配置的基础上修改配置，可以增加原来没有的配置
        var saveSt: ThemeConfig = defaultConf;
        var ckb = document.getElementsByClassName("vslite_sets");
        Array.from(ckb).forEach(checkbox => {
            var id = checkbox.id as SettingPanelId;
            var ck = (checkbox as HTMLInputElement).checked;
            // ! 保存设置到json
            var mapping = settingKeyMap[id];
            if (mapping) {
                saveSt[mapping.section][mapping.key] = ck;
            }
        });
        // 修改配置文件版本
        saveSt["version"] = defaultConf["version"];
        await putSettings(saveSt);
        _postMessage("ok", localMessage["confSave"][defLag]);
        setTimeout(() => { window.location.reload(); }, 200);
        document.body.removeChild(dialogSetting);
    }
    function closeNotSave() {
        _postMessage("error", localMessage["confNotSave"][defLag], 3000);
        document.body.removeChild(dialogSetting);
    }

    // 创建关闭按钮
    var saveButton = document.createElement('button');
    saveButton.textContent = localMessage["saveReload"][defLag];
    saveButton.className = "b3-button b3-button--outline fn__flex-center fn__size200";
    saveButton.onclick = () => {
        closeAndSave();
    };
    var notSaveButton = document.createElement('button');
    notSaveButton.textContent = localMessage["nSave"][defLag];
    notSaveButton.className = "b3-button b3-button--outline fn__flex-center fn__size200";
    notSaveButton.onclick = () => {
        closeNotSave();
    };
    var refreshButton = document.createElement('button');
    refreshButton.textContent = localMessage['oReload'][defLag];
    refreshButton.className = "b3-button b3-button--outline fn__flex-center fn__size200";
    refreshButton.onclick = () => {
        window.location.reload();
    };
    var label1 = document.createElement('span');
    label1.textContent = localMessage["tip1"][defLag];
    label1.className = "fn__flex-1 fn__flex-center";
    var label2 = document.createElement('span');
    label2.textContent = localMessage["tip2"][defLag];
    label2.className = "fn__flex-1 fn__flex-center";
    var label3 = document.createElement('span');
    label3.textContent = localMessage["tip3"][defLag];
    label3.className = "fn__flex-1 fn__flex-center";
    var space = document.createElement('span');
    space.className = 'fn__space';
    var div1 = document.createElement('label');
    div1.className = "fn__flex b3-label";
    div1.appendChild(label1);
    div1.appendChild(space.cloneNode(true));
    div1.appendChild(saveButton);
    dialogBody.appendChild(div1);
    var div2 = document.createElement('label');
    div2.className = "fn__flex b3-label";
    div2.appendChild(label2);
    div2.appendChild(space.cloneNode(true));
    div2.appendChild(notSaveButton);
    dialogBody.appendChild(div2);
    var div3 = document.createElement('label');
    div3.className = "fn__flex b3-label";
    div3.appendChild(label3);
    div3.appendChild(space.cloneNode(true));
    div3.appendChild(refreshButton);
    dialogBody.appendChild(div3);
}

/**
 * NOTE 获取设置文件数组
 * @returns Promise\<SettingItem[]\>
 */
async function fetchSettingsArray() {
    let re: SettingItem[];
    await _getFile("/data/snippets/vsc_edit.config.json", async (v: ThemeConfig) => {
        if (v == null) {
            v = defaultConf;
        }
        re = await getSettingArrays(v);
    });
    return re;
}

/**
 * NOTE 向设置面板中添加设置项（数组）
 * @param v ThemeConfig
 * @returns Promise\<SettingItem[]\>
 */
async function getSettingArrays(v: ThemeConfig) {
    let settings: SettingItem[] = [];
    // ! 设置页添加设置选项
    // 标题
    settings.push({ label: localMessage["tititem"][defLag], id: 'titleBlock', enable: v?.theme?.title ?? false });
    // 标题阴影
    settings.push({ label: localMessage["titleShadow"][defLag], description: localMessage["titleShadowDesc"][defLag], id: 'titleShadow', enable: v?.theme?.titleShadow ?? false });
    // 标题图标
    settings.push({ label: localMessage["titleIcon"][defLag], description: localMessage["titleShadowDesc"][defLag], id: 'titleIcon', enable: v?.theme?.titleIcon ?? false });
    // 文档树和大纲
    settings.push({ label: localMessage["ftitem"][defLag], id: 'doctree', enable: v?.theme?.doctree ?? false });
    // 代码块
    settings.push({ label: localMessage["cbitem"][defLag], id: 'codeBlock', enable: v?.theme?.codeBlock ?? false });
    // 引用
    settings.push({ label: localMessage["refitem"][defLag], id: 'referenceBlock', enable: v?.theme?.reference ?? false });
    // 标记
    settings.push({ label: localMessage["markitem"][defLag], id: 'mark', enable: v?.theme?.mark ?? false });
    // 集市
    settings.push({ label: localMessage["bazitem"][defLag], id: 'bazaarStyle', enable: v?.theme?.bazaar ?? false });
    // 嵌入块
    settings.push({ label: localMessage["emitem"][defLag], description: localMessage["emdesc"][defLag], id: 'embeddedBlock', enable: v?.theme?.embeddedBlock ?? false });
    // 数据库
    settings.push({ label: localMessage["dbitem"][defLag], id: 'database', enable: v?.theme?.database ?? false });
    // 快捷键面板
    settings.push({ label: localMessage["scitem"][defLag], id: 'scPanelStyle', enable: v?.plugins?.shortcutPanel ?? false });
    // 替换背景图片插件电脑端
    settings.push({ label: localMessage["bgdesktop"][defLag], description: localMessage["bgdesc"][defLag], id: 'backgroundCoverDesktop', enable: v?.plugins?.backgroundCoverDesktop ?? false });
    // 替换背景图片插件移动端
    settings.push({ label: localMessage["bgmobile"][defLag], description: localMessage["bgdesc"][defLag], id: 'backgroundCoverMobile', enable: v?.plugins?.backgroundCoverMobile ?? false });
    // 数学公式增强插件
    settings.push({ label: localMessage["mathitem"][defLag], description: localMessage["mathdesc"][defLag], id: 'mathPanel', enable: v?.plugins?.mathPanel ?? false });
    // 双标签栏
    settings.push({ label: localMessage["doubleTabbaritem"][defLag], description: localMessage["doubleTabbardesc"][defLag], id: 'doubleTabbar', enable: v?.plugins?.doubleTabbar ?? false });
    return settings;
}

/**
 * ! 获取设置
 * @returns Promise\<EnableSettings[]\>
 */
export async function getSettings() {
    var str: EnableSettings[];
    // var res = _analyseResponse(_getFile("/data/snippets/vsc_edit.config.json"));
    await _getFile("/data/snippets/vsc_edit.config.json", async (v) => {
        if (v == null) {
            v = globalThis.defaultConf;
            putSettings(v);
        }
        str = await showElementSettings(v);
    });
    return str;
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
    await _writeFile("/data/snippets/vsc_edit.config.json", JSON.stringify(settings), null, null, false, Date.now());
}

/**
 * ! 获取当前启用的设置并返回对应的列表
 * @param settings
 * @returns Promise\<EnableSettings[]\>
 */
async function showElementSettings(settings: ThemeConfig) {
    var lab: EnableSettings[] = [];
    // 检测配置文件的版本
    if (settings["version"] < defaultConf["version"] || settings["version"] == undefined) {
        // console.log(settings["version"]);
        await _postMessage("ok", localMessage["confUpdate"][defLag]);
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