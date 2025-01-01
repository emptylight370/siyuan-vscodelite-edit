// 主题默认加载时进行的行为
// ! js代码加载后立即执行
(async function () {
    // 获取自己的css表
    const cssTable = document.getElementById('themeStyle');
    await loadGlobalVars();
    // console.log(defLag);
    // console.log(cssTable);
    if (cssTable) {
        // 读取配置文件或生成配置文件
        var labels = await getSettings();
        // 添加主题菜单
        addThemeToolBar();
        // 向css中插入语句
        addImports(cssTable, labels);
        // 移除CSS规则
        removeCSSRules(cssTable);
        // 添加固定属性
        addFixedAttribute(labels);
        // 修复导出pdf没有样式的问题
        await addPdfStyle(labels);
        console.log(localMessage["loadFinish"][defLag]);
    } else {
        await _postMessage('error', localMessage["localCssFail"][defLag], 5000);
    }
})();

// ! 更换主题时移除修改内容
window.destroyTheme = async () => {
    // 移除主题按钮
    document.querySelector("#vscleToolbar").remove();
    // 移除body特殊适配语句
    document.body.classList.remove('bgenable');
    // 移除计时器
    for (key in globalThis.timer) {
        if (globalThis.timer[key] != null) {
            // console.log("remove timer");
            clearTimeout(globalThis.timer[key]);
            clearInterval(globalThis.timer[key]);
            globalThis.timer[key] = null;
        }
    }
    // 移除监视器
    for (key in globalThis.observer) {
        if (globalThis.observer[key] != null) {
            // console.log("remove observer");
            globalThis.observer[key].disconnect();
            globalThis.observer[key] = null;
        }
    }
    // 删除全局变量
    delete globalThis.defaultConf;
    delete globalThis.localMessage;
    delete globalThis.defLag;
    delete globalThis.timer;
    delete globalThis.observer;
    await addPdfStyle([]);
};

/**
 * 加载全局变量
 */
async function loadGlobalVars() {
    /**
     * ! 默认配置文件
     */
    globalThis.defaultConf = {
        "version": 6,
        "theme": {
            "codeBlock": true,
            "reference": true,
            "bazaar": true,
            "embeddedBlock": true,
            "title": true,
            "titleShadow": true,
            "database": true,
            "doctree": true,
            "mark": true
        },
        "plugins": {
            "shortcutPanel": true,
            "mathPanel": false,
            "backgroundCover": true
        }
    };

    /**
     * ! 默认消息本地化
     */
    globalThis.localMessage = {
        "language": {
            "zh_CN": true,
            "en_US": true
        },
        "loadCssFail": {
            "zh_CN": "加载主题VSCode Lite Edit失败，无法获取当前样式表",
            "en_US": "Load theme VSCode Lite Edit failed, can't load current style table"
        },
        "loadFinish": {
            "zh_CN": "主题VSCode Lite Edit加载完成",
            "en_US": "Theme VSCode Lite Edit load finished"
        },
        "confUpdate": {
            "zh_CN": "主题配置文件需要更新，请点击<code>VC</code>按钮重新保存配置文件",
            "en_US": "Theme conf file needs update, please click <code>VC</code> button to save the configuration file again"
        },
        "confNotSave": {
            "zh_CN": "配置未保存",
            "en_US": "Configurations not saved"
        },
        "confSave": {
            "zh_CN": "配置保存成功，稍后自动刷新",
            "en_US": "Configuration save successed, auto reload later"
        },
        "label-aria": {
            "zh_CN": "VSCode Lite 主题设置",
            "en_US": "VSCode Lite theme setting"
        },
        "settingPanelTitle": {
            "zh_CN": 'VSCode Lite Edit设置',
            "en_US": "VSCode Lite Edit Settings"
        },
        "saveReload": {
            "zh_CN": '保存并刷新',
            "en_US": 'Save and Reload'
        },
        "nSave": {
            "zh_CN": '不保存',
            "en_US": "NOT Save"
        },
        "oReload": {
            "zh_CN": '刷新思源界面',
            "en_US": 'Reload Siyuan'
        },
        "tip1": {
            "zh_CN": "直接关闭不保存哦，必须点击保存按钮",
            "en_US": "Close it directly without saving, you must click the Save button"
        },
        "tip2": {
            "zh_CN": "刷新可能无效，重启思源即可生效",
            "en_US": "Reload may useless, you can restart Siyuan to enable the changes"
        },
        "tip3": {
            "zh_CN": "点击一行中任意位置",
            "en_US": "Click anywhere in a row"
        },
        "cbitem": {
            "zh_CN": '代码块样式',
            "en_US": "code block style"
        },
        "refitem": {
            "zh_CN": '引用标签样式',
            "en_US": 'reference label style'
        },
        "bazitem": {
            "zh_CN": '集市样式',
            "en_US": "bazaar style"
        },
        "emitem": {
            "zh_CN": '嵌入块样式',
            "en_US": "embedded block style"
        },
        "emdesc": {
            "zh_CN": "限制嵌入块高度",
            "en_US": "Limit the height of embedded block"
        },
        "tititem": {
            "zh_CN": '标题块样式',
            "en_US": "Heading block style"
        },
        "titleShadow": {
            "zh_CN": "标题添加阴影",
            "en_US": "Heading add shadow"
        },
        "titleShadowDesc": {
            "zh_CN": "仅启用标题样式有效",
            "en_US": "Only effective when enable heading style"
        },
        "dbitem": {
            "zh_CN": '数据库样式',
            "en_US": 'database style'
        },
        "markitem": {
            "zh_CN": "高亮标注样式",
            "en_US": "highlight mark style"
        },
        "scitem": {
            "zh_CN": '（插件）快捷键面板样式',
            "en_US": '(plugin) Shortcut key panel style'
        },
        "ftitem": {
            "zh_CN": "文档树和大纲样式",
            "en_US": 'Doc tree and Outline style'
        },
        "bgitem": {
            "zh_CN": "（插件）替换背景图片适配",
            "en_US": "(plugin) Background cover adaption"
        },
        "bgdesc": {
            "zh_CN": "需要打开“替换背景图片”插件设置将“前景透明”调到0哦!建议启用插件的“背景虚化”功能!",
            "en_US": "You need to open the setting of \"Background Cover\" plugin and set the \"Opacity of foreground\" to 0!Suggest turn on the \"Blurring\" setting of the plugin!"
        },
        "mathitem": {
            "zh_CN": "（插件）数学增强插件调整",
            "en_US": "(plugin) math enhance plugin adjustion"
        },
        "mathdesc": {
            "zh_CN": "无法显示水平滚动条",
            "en_US": "Can't show horizon scroll bar"
        }
    };

    // 浏览器获取的默认语言
    globalThis.defLag = document.documentElement.lang;
    // console.log(defLag);
    if (localMessage["language"][defLag] == undefined) {
        globalThis.defLag = 'en_US';
    }

    // ! 所有用到的计时器
    globalThis.timer = {
        // 背景插件加载后可能禁用，使用计时器定时刷新背景插件状态
        bgTimer: null,
        // 背景插件属性修改的监听器，用来监测背景状态变化
        bgObserTimer: null
    };

    // ! 所有用到的监听器
    globalThis.observer = {
        bgObserver: null
    };
}

/** 
 * * 定义需要用到的api
 * * 从[Savor](https://github.com/royc01/notion-theme/blob/main/theme.js)抄的
 * * 来自[思源api文档](https://github.com/siyuan-note/siyuan/blob/master/API_zh_CN.md)
 * TODO: 完成所需的所有api写入
 */
/**
 * @Feature 向思源请求数据
 * @param url 请求url
 * @param data 请求数据(json encode)
 */
async function _rqFORSiyuan(url, data) {
    const response = await fetch(url, {
        body: JSON.stringify(data),
        method: 'POST',
        headers: {
            Authorization: `Token ''`
        }
    });
    if (response.status === 200)
        return await response.json();
    else
        return null;
}

/** 
 * @Feature 获取文件
 * @param path 文件路径
 * @param then then?
 * @param obj obj?
 */
async function _getFile(path, then = null, obj = null) {
    let url = '/api/file/getFile';
    await _rqFORSiyuan(url, {
        path: path
    }).then((v) => {
        if (then)
            then(v, obj);
    });
}

/**
 * @Feature 写入文件
 * @param path 文件路径
 * @param filedata 文件数据
 * @param then then?
 * @param obj obj?
 * @param isDir 是否是路径
 * @param modTime 修改时间
*/
async function _writeFile(path, filedata, then = null, obj = null, isDir = false, modTime = Date.now()) {
    let blob = new Blob([filedata]);
    let file = new File([blob], path.split('/').pop());
    let formdata = new FormData();
    formdata.append("path", path);
    formdata.append("file", file);
    formdata.append("isDir", isDir);
    formdata.append("modTime", modTime);
    await fetch("/api/file/putFile", {
        body: formdata,
        method: 'POST',
        headers: {
            Authorization: `Token ""`
        }
    }).then((v) => {
        if (then)
            then(obj);
    }, 200);
}

/**
 * @Feature 发送消息
 * @param { string } type 消息类型 - "ok" or "error"
 * @param { string } message 消息内容
 * @param { number } time 持续时间
 */
async function _postMessage(type, message, time = null) {
    if (type == "ok") url = "/api/notification/pushMsg";
    else if (type == "error") url = "api/notification/pushErrMsg";
    if (time) await _rqFORSiyuan(url, { "msg": message, "timeout": time });
    else await _rqFORSiyuan(url, { "msg": message });
}

/**
 * @description 获取设置
 */
async function getSettings() {
    var str;
    // var res = _analyseResponse(_getFile("/data/snippets/vsc_edit.config.json"));
    await _getFile("/data/snippets/vsc_edit.config.json", (v) => {
        if (v == null) {
            v = defaultConf;
            putSettings(v);
        }
        str = showElementSettings(v);
    });
    return str;
}

/**
 * @description 保存设置
 * @param settings
 * @return 
 */
async function putSettings(settings) {
    if (settings == null) {
        return;
    }
    await _writeFile("/data/snippets/vsc_edit.config.json", JSON.stringify(settings), null, null, false, Date.now());
}

/**
 * @description 创建工具栏的按钮
 */
function addThemeToolBar() {
    var vscToolBar = document.getElementById("vscleToolbar");
    if (vscToolBar == null) {
        var toolbarVIP = document.getElementById("toolbarVIP");
        var windowControls = document.getElementById("windowControls");
        vscToolBar = document.createElement("div");
        vscToolBar.id = "vscleToolbar";
        vscToolBar.setAttribute("class", "toolbar__item ariaLabel");
        vscToolBar.setAttribute("aria-label", localMessage["label-aria"][defLag]);
        vscToolBar.setAttribute("style", "width=23.5px;height=23.5px");
        if (toolbarVIP == null) {
            try {
                windowControls.parentElement.insertBefore(vscToolBar, windowControls);
            } catch (error) {
                document.body.classList.add("vscmobile");
            }
        } else {
            toolbarVIP.parentElement.insertBefore(vscToolBar, toolbarVIP);
        }
    }
    vscToolBar.innerHTML = "VC";
    // vscToolBar.innerHTML = "<img src=\"resources\\h6.bmp\"\\>";
    vscToolBar.addEventListener("click", (event) => {
        // 调用函数创建设置窗口
        createSettingsWindow();
    });
}

/**
 * @description 根据设置显示不同的主题
 * @param settings
 * @return 
 */
async function showElementSettings(settings) {
    var lab = [];
    // 检测配置文件的版本
    if (settings["version"] < defaultConf["version"] || settings["version"] == undefined) {
        // console.log(settings["version"]);
        await _postMessage("ok", localMessage["confUpdate"][defLag]);
    }
    // ! 从设置中获取启用的设置项
    // 代码块
    if (settings["theme"]["codeBlock"] == true) {
        lab.push("codeBlock");
    }
    // 引用
    if (settings["theme"]["reference"] == true) {
        lab.push("reference");
    }
    // 集市
    if (settings["theme"]["bazaar"] == true) {
        lab.push("bazaar");
    }
    // 嵌入块
    if (settings["theme"]["embeddedBlock"] == true) {
        lab.push("embeddedBlock");
    }
    // 标题
    if (settings["theme"]["title"] == true) {
        // 标题阴影
        if (settings["theme"]['titleShadow'] == true) {
            lab.push("titleShadow");
        } else {
            lab.push("titleNoShadow");
        }
    }
    // 快捷键面板
    if (settings["plugins"]["shortcutPanel"] == true) {
        lab.push("shortcutPanel");
    }
    // 数据库
    if (settings["theme"]["database"] == true) {
        lab.push("database");
    }
    // 文档树和大纲
    if (settings["theme"]["doctree"] == true) {
        lab.push("doctree");
    }
    if (settings["plugins"]["backgroundCover"] == true) {
        lab.push("backgroundCover");
    }
    if (settings["plugins"]["mathPanel"] == true) {
        lab.push("mathPanel");
    }
    if (settings["theme"]["mark"] == true) {
        lab.push("mark");
    }
    return lab;
}

/**
 * @description 向css表中插入引用的语句
 * @param table
 * @param labels
 * @return 
 */
function addImports(table, labels) {
    table = table.sheet;
    var i = 0;
    // ! 向css表中插入引用的语句
    labels.forEach(it => {
        if (it == 'codeBlock') {
            table.insertRule('@import url(sub/block/codeBlock.css);', 6 + i);
            i += 1;
        }
        if (it == 'reference') {
            table.insertRule('@import url(sub/block/reference.css);', 6 + i);
            i += 1;
        }
        if (it == 'bazaar') {
            table.insertRule('@import url(sub/app/bazaar.css);', 6 + i);
            i += 1;
        }
        if (it == 'embeddedBlock') {
            table.insertRule('@import url(sub/block/embeddedBlock.css);', 6 + i);
            i += 1;
        }
        if (it == 'titleShadow') {
            table.insertRule('@import url(sub/block/title-shadow.css);', 6 + i);
            i += 1;
        }
        if (it == 'titleNoShadow') {
            table.insertRule('@import url(sub/block/title-no-shadow.css);', 6 + i);
            i += 1;
        }
        if (it == 'shortcutPanel') {
            table.insertRule('@import url(sub/plugin/keymapPlugin.css);', 6 + i);
            i += 1;
        }
        if (it == 'database') {
            table.insertRule('@import url(sub/block/database.css);', 6 + i);
            i += 1;
        }
        if (it == 'doctree') {
            table.insertRule('@import url(sub/app/filetree.css);', 6 + i);
            i += 1;
        }
        if (it == 'backgroundCover') {
            if (!document.body.classList.contains('vscmobile')) {
                table.insertRule('@import url(sub/plugin/backgroundPlugin.css);', 6 + i);
                i += 1;
            }
        }
        if (it == 'mathPanel') {
            if (!document.body.classList.contains('vscmobile')) {
                table.insertRule('@import url(sub/plugin/mathEnhance.css);', 6 + i);
                i += 1;
            }
        }
        if (it == 'mark') {
            table.insertRule('@import url(sub/block/mark.css);', 6 + i);
            i += 1;
        }
    });
}

/** 
 * @description 创建一个包含标签和复选框的 HTML 结构
 */
async function createSettingsWindow() {
    // 创建设置窗口大框
    var dialogSetting = document.createElement('div');
    dialogSetting.setAttribute("data-key", "dialog-setting");
    dialogSetting.classList = "b3-dialog--open";
    document.body.appendChild(dialogSetting);

    // 创建一个遮罩层
    var dialog = document.createElement('div');
    dialog.classList = "b3-dialog";
    dialog.style.zIndex = '14';
    dialogSetting.appendChild(dialog);

    // 可关闭遮罩层
    var scrim = document.createElement('div');
    scrim.classList = "b3-dialog__scrim";
    scrim.onclick = () => {
        closeNotSave();
    };
    dialog.appendChild(scrim);

    // 创建窗口容器
    var dialogContainer = document.createElement('div');
    dialogContainer.classList = "b3-dialog__container";
    dialogContainer.style.width = '60vw';
    dialogContainer.style.height = '80vh';
    dialogContainer.style.maxWidth = '1280px';
    dialog.appendChild(dialogContainer);

    // 创建设置窗口
    var dialogBody = document.createElement('div');
    dialogBody.classList = 'b3-dialog__body';
    dialogBody.setAttribute("vslite", "SettingPanel");
    dialogContainer.appendChild(dialogBody);


    // 创建标题
    var title = document.createElement('h2');
    title.textContent = localMessage["settingPanelTitle"][defLag];
    title.setAttribute("data-subtype", "h2");
    // title.setAttribute("data-type", "NodeHeading");
    title.classList = "h2";
    dialogBody.appendChild(title);

    // 获取设置文件数组
    async function fetchSettingsArray() {
        let re;
        await _getFile("/data/snippets/vsc_edit.config.json", async (v) => {
            if (v == null) {
                v = defaultConf;
            }
            re = await getSettingArrays(v);
        });
        return re;

        async function getSettingArrays(v) {
            let settings = [];
            // ! 设置页添加设置选项
            // 标题
            if (v["theme"]["title"] == true) {
                settings.push({ label: localMessage["tititem"][defLag], id: 'titleBlock', enable: true });
            } else {
                settings.push({ label: localMessage["tititem"][defLag], id: 'titleBlock', enable: false });
            }
            // 标题
            if (v["theme"]["titleShadow"] == true) {
                settings.push({ label: localMessage["titleShadow"][defLag], description: localMessage["titleShadowDesc"][defLag], id: 'titleShadow', enable: true });
            } else {
                settings.push({ label: localMessage["titleShadow"][defLag], description: localMessage["titleShadowDesc"][defLag], id: 'titleShadow', enable: false });
            }
            // 文档树和大纲
            if (v["theme"]["doctree"] == true) {
                settings.push({ label: localMessage["ftitem"][defLag], id: 'doctree', enable: true });
            } else {
                settings.push({ label: localMessage["ftitem"][defLag], id: 'doctree', enable: false });
            }
            // 代码块
            if (v["theme"]["codeBlock"] == true) {
                settings.push({ label: localMessage["cbitem"][defLag], id: 'codeBlock', enable: true });
            } else {
                settings.push({ label: localMessage["cbitem"][defLag], id: 'codeBlock', enable: false });
            }
            // 引用
            if (v["theme"]["reference"] == true) {
                settings.push({ label: localMessage["refitem"][defLag], id: 'referenceBlock', enable: true });
            } else {
                settings.push({ label: localMessage["refitem"][defLag], id: 'referenceBlock', enable: false });
            }
            if (v["theme"]["mark"] == true) {
                settings.push({ label: localMessage["markitem"][defLag], id: 'mark', enable: true });
            } else {
                settings.push({ label: localMessage["markitem"][defLag], id: 'mark', enable: false });
            }
            // 集市
            if (v["theme"]["bazaar"] == true) {
                settings.push({ label: localMessage["bazitem"][defLag], id: 'bazaarStyle', enable: true });
            } else {
                settings.push({ label: localMessage["bazitem"][defLag], id: 'bazaarStyle', enable: false });
            }
            // 嵌入块
            if (v["theme"]["embeddedBlock"] == true) {
                settings.push({ label: localMessage["emitem"][defLag], description: localMessage["emdesc"][defLag], id: 'embeddedBlock', enable: true });
            } else {
                settings.push({ label: localMessage["emitem"][defLag], description: localMessage["emdesc"][defLag], id: 'embeddedBlock', enable: false });
            }
            // 数据库
            if (v["theme"]["database"] == true) {
                settings.push({ label: localMessage["dbitem"][defLag], id: 'database', enable: true });
            } else {
                settings.push({ label: localMessage["dbitem"][defLag], id: 'database', enable: false });
            }
            // 快捷键面板
            if (v["plugins"]["shortcutPanel"] == true) {
                settings.push({ label: localMessage["scitem"][defLag], id: 'scPanelStyle', enable: true });
            } else {
                settings.push({ label: localMessage["scitem"][defLag], id: 'scPanelStyle', enable: false });
            }
            // 替换背景图片插件
            if (v["plugins"]["backgroundCover"] == true) {
                settings.push({ label: localMessage["bgitem"][defLag], description: localMessage["bgdesc"][defLag], id: 'backgroundCover', enable: true });
            } else {
                settings.push({ label: localMessage["bgitem"][defLag], description: localMessage["bgdesc"][defLag], id: 'backgroundCover', enable: false });
            }
            // 数学公式增强插件
            if (v["plugins"]["mathPanel"] == true) {
                settings.push({ label: localMessage["mathitem"][defLag], description: localMessage["mathdesc"][defLag], id: 'mathPanel', enable: true });
            } else {
                settings.push({ label: localMessage["mathitem"][defLag], description: localMessage["mathdesc"][defLag], id: 'mathPanel', enable: false });
            }
            return settings;
        }
    }

    // 创建标签和复选框
    var settings = await fetchSettingsArray();

    // 遍历数组添加选项
    settings.forEach(setting => {
        if (setting?.description) {
            var label = document.createElement('div');
        } else {
            var label = document.createElement('span');
        }
        label.textContent = setting.label;
        label.htmlFor = setting.id;
        label.classList = "fn__flex-1";

        if (setting?.description) {
            var description = document.createElement('div');
            description.textContent = setting.description;
            description.htmlFor = setting.id;
            description.classList = "b3-label__text";
            label.appendChild(description);
        }

        var space = document.createElement('span');
        space.classList = 'fn__space';

        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = setting.id;
        checkbox.checked = setting.enable;
        checkbox.classList = "b3-switch fn__flex-center vslite_sets";

        var div = document.createElement('label');
        div.classList = "fn__flex b3-label";
        div.appendChild(label);
        div.appendChild(space);
        div.appendChild(checkbox);

        dialogBody.appendChild(div);
    });

    async function closeAndSave() {
        saveSt = defaultConf;
        ckb = document.getElementsByClassName("vslite_sets");
        Array.from(ckb).forEach(checkbox => {
            var id = checkbox.id;
            var ck = checkbox.checked;
            // ! 保存设置到json
            if (id == "codeBlock") {
                saveSt["theme"]["codeBlock"] = ck;
            } else if (id == "referenceBlock") {
                saveSt["theme"]["reference"] = ck;
            } else if (id == "referenceBlock") {
                saveSt["theme"]["reference"] = ck;
            } else if (id == "bazaarStyle") {
                saveSt["theme"]["bazaar"] = ck;
            } else if (id == "embeddedBlock") {
                saveSt["theme"]["embeddedBlock"] = ck;
            } else if (id == "titleBlock") {
                saveSt["theme"]["title"] = ck;
            } else if (id == "titleShadow") {
                saveSt["theme"]["titleShadow"] = ck;
            } else if (id == "scPanelStyle") {
                saveSt["plugins"]["shortcutPanel"] = ck;
            } else if (id == "database") {
                saveSt["theme"]["database"] = ck;
            } else if (id == "doctree") {
                saveSt["theme"]["doctree"] = ck;
            } else if (id == 'backgroundCover') {
                saveSt["plugins"]["backgroundCover"] = ck;
            } else if (id == 'mathPanel') {
                saveSt["plugins"]["mathPanel"] = ck;
            } else if (id == 'mark') {
                saveSt["theme"]["mark"] = ck;
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
    saveButton.classList = "b3-button b3-button--outline fn__flex-center fn__size200";
    saveButton.onclick = () => {
        closeAndSave();
    };
    var notSaveButton = document.createElement('button');
    notSaveButton.textContent = localMessage["nSave"][defLag];
    notSaveButton.classList = "b3-button b3-button--outline fn__flex-center fn__size200";
    notSaveButton.onclick = () => {
        closeNotSave();
    };
    var refreshButton = document.createElement('button');
    refreshButton.textContent = localMessage['oReload'][defLag];
    refreshButton.classList = "b3-button b3-button--outline fn__flex-center fn__size200";
    refreshButton.onclick = () => {
        window.location.reload();
    };
    var label1 = document.createElement('span');
    label1.textContent = localMessage["tip1"][defLag];
    label1.classList = "fn__flex-1 fn__flex-center";
    var label2 = document.createElement('span');
    label2.textContent = localMessage["tip2"][defLag];
    label2.classList = "fn__flex-1 fn__flex-center";
    var label3 = document.createElement('span');
    label3.textContent = localMessage["tip3"][defLag];
    label3.classList = "fn__flex-1 fn__flex-center";
    var space = document.createElement('span');
    space.classList = 'fn__space';
    var div1 = document.createElement('label');
    div1.classList = "fn__flex b3-label";
    div1.appendChild(label1);
    div1.appendChild(space.cloneNode(true));
    div1.appendChild(saveButton);
    dialogBody.appendChild(div1);
    var div2 = document.createElement('label');
    div2.classList = "fn__flex b3-label";
    div2.appendChild(label2);
    div2.appendChild(space.cloneNode(true));
    div2.appendChild(notSaveButton);
    dialogBody.appendChild(div2);
    var div3 = document.createElement('label');
    div3.classList = "fn__flex b3-label";
    div3.appendChild(label3);
    div3.appendChild(space.cloneNode(true));
    div3.appendChild(refreshButton);
    dialogBody.appendChild(div3);
}

/**
 * @description 添加固定属性
 * ! 添加固定属性
 * @param {String[]} settings 
 */
function addFixedAttribute(settings) {
    function bg(times) {
        // 背景自定义插件，部分情况下插件加载缓慢可重复检测一次
        var bglayer = document.getElementById("bglayer");
        if (bglayer) {
            var style = window.getComputedStyle(bglayer);
            var body = document.body;
            if (style.getPropertyValue("display") != 'none') {
                // if (times < 1) {
                //     globalThis.timer.bgTimer = setTimeout(bg, 2000, times + 1);
                //     return;
                // }
                // console.log("enable background");
                body.classList.add('bgenable');
            } else if (style.getPropertyValue("display") == 'none') {
                // console.log("disable background");
                body.classList.remove('bgenable');
            }
            // 刚开始每2秒重新检测状态，检测10秒
            if (times < 5) {
                globalThis.timer.bgTimer = setTimeout(bg, 2000, times + 1);
            } else {
                globalThis.timer.bgTimer = null;
            }
        } else if (times == 0) {
            // 未启用插件5秒后重新检测一遍
            setTimeout(bg, 5000, times + 1);
        }
    }
    // 监听背景自定义插件的属性修改
    function bgobserver(times) {
        var bglayer = document.getElementById("bglayer");
        if (bglayer) {
            globalThis.observer.bgObserver = new MutationObserver(function (mutationsList) {
                for (var mutation of mutationsList) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        // 样式发生变化时执行的代码
                        bg(0);
                    }
                }
            });
            globalThis.observer.bgObserver.observe(bglayer, {
                attributes: true, // 监听属性变化
                attributeFilter: ['style'] // 只监听 style 属性
            });
            globalThis.timer.bgobserver = null;
        } else {
            if (times == 0 && !document.body.classList.contains('vscmobile')) {
                // 运行失败等待5秒
                globalThis.timer.bgObserTimer = setTimeout(bgobserver, 5000, 1);
            }
            else if (times == 1) {
                console.error("背景插件监听失败，修改插件启用状态需手动刷新");
                globalThis.timer.bgObserTimer = null;
            }
        }
    }
    // 运行
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // 如果设置启用背景插件才进入判断
    if (settings.includes("backgroundCover")) {
        bg(0);
        if (globalThis.observer.bgObserver == null) {
            bgobserver(0);
        }
    }
    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<
}

/**
 * ! 添加导出pdf时候的样式
 * @param {*} lab 
 */
async function addPdfStyle(lab) {
    var list = [];
    lab.forEach(it => {
        if (it == 'codeBlock') {
            list.push('@import url(block/codeBlock.css);');
        }
        if (it == 'reference') {
            list.push('@import url(block/reference.css);');
        }
        if (it == 'titleShadow') {
            list.push('@import url(block/title-shadow.css);');
        }
        if (it == 'titleNoShadow') {
            list.push('@import url(block/title-no-shadow.css);');
        }
        if (it == 'shortcutPanel') {
            list.push('@import url(plugin/keymapPlugin.css);');
        }
        if (it == 'database') {
            list.push('@import url(block/database.css);');
        }
        if (it == 'mark') {
            list.push('@import url(block/mark.css);');
        }
    });
    var str = list.join("\n");
    await _writeFile("/conf/appearance/themes/siyuan-vscodelite-edit/sub/pdfPreview.css", str);
}

/**
 * 移除CSS规则，用于在可加载js的时候去掉PDF导出适配
 * @param {*} table 
 */
function removeCSSRules(table) {
    table = table.sheet;

    // 移除特定的 @import 规则
    var removeImportRule = (sheet, url) => {
        const rules = Array.from(sheet.cssRules);
        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            if (rule instanceof CSSImportRule && rule.href.includes(url)) {
                sheet.deleteRule(i);
                break; // 找到并删除目标规则后停止遍历
            }
        }
    };

    // 移除 @import("sub/pdfPreview.css") 规则
    removeImportRule(table, 'sub/pdfPreview.css');
}