import { _postMessage } from "./ts/api";
import { loadGlobalVars } from "./ts/defs";
import { bg, bgobserver } from "./ts/plugins/background";
import { createSettingsWindow, getSettings } from "./ts/setting";
import { EnableSettings } from "./ts/types.d";

/**
 * @description 主题默认加载时进行的行为
 * ! js代码加载后立即执行
 * @since 1.2.0
 * @version 2.6.0
 */
(async function () {
    // 检查是否同时存在主题样式代码和PDF适配代码
    if (document.getElementById("themeScript") && document.getElementById("snippetJS-VSCodeLiteEdit")) return;

    // 获取自己的css表
    const cssTable = document.getElementById("themeStyle") as HTMLLinkElement;
    // 添加全局变量
    try {
        await loadGlobalVars();
    } catch (e) {
        // 基本上意味着主题启用失败了
        let errMsg: string;
        if (document.documentElement.lang === "zh_CN") {
            errMsg = "加载主题VSCode Lite Edit失败，无法加载变量";
        } else {
            errMsg = "Load theme VSCode Lite Edit failed, can't load variables";
        }
        console.error(errMsg);
        console.error(e);
        await _postMessage("error", errMsg);
        return;
    }
    // console.log(defLag);
    // console.log(cssTable);
    if (cssTable) {
        // 读取配置文件或生成配置文件
        let labels: EnableSettings[];
        try {
            labels = await getSettings();
        } catch (e) {
            /*
             * 加载设置文件失败会使用默认的配置文件初始化一个
             * 如果还是失败就意味着之前加载也失败了，不管什么地方失败都无法正常使用主题
             */
            console.error(globalThis.localMessage.loadConfigFail[globalThis.defLag]);
            console.error(e);
            await _postMessage("error", globalThis.localMessage.loadConfigFail[globalThis.defLag]);
            return;
        }
        // 添加主题菜单
        addThemeToolBar();
        // 向css中插入语句
        addImports(cssTable, labels);
        // 添加固定属性
        addFixedAttribute(labels);
        // 在导出PDF时候执行主题的脚本
        addPDFScript();
        // 加载完成(o゜▽゜)o☆
        console.log(globalThis.localMessage.loadFinish[globalThis.defLag]);
    } else {
        // 加载失败
        console.error(globalThis.localMessage.loadCssFail[globalThis.defLag]);
        await _postMessage("error", globalThis.localMessage.loadCssFail[globalThis.defLag]);
    }
})();

/**
 * ! 更换主题时移除修改内容
 * @since 1.2.0
 * @version 2.6.0
 */
window.destroyTheme = async () => {
    // 移除主题按钮
    document.getElementById("vscleToolbar").remove();
    // 移除PDF导出时执行的脚本
    document.getElementById("snippetJS-VSCodeLiteEdit").remove();
    // 移除body特殊适配语句
    document.body.classList.remove("bgenable");
    document.body.classList.remove("vscmobile");
    // 移除计时器
    Object.keys(globalThis.vscTimer).forEach((key) => {
        if (globalThis.vscTimer[key] !== null) {
            // console.log("remove timer");
            // 可以清除 timeout 和 interval
            clearTimeout(globalThis.vscTimer[key]);
            globalThis.vscTimer[key] = null;
        }
    });
    // 移除监视器
    Object.keys(globalThis.vscObserver).forEach((key) => {
        if (globalThis.vscObserver[key] !== null) {
            // console.log("remove observer");
            (globalThis.vscObserver[key] as MutationObserver).disconnect();
            globalThis.vscObserver[key] = null;
        }
    });
    // 删除全局变量
    delete globalThis.defaultConf;
    delete globalThis.localMessage;
    delete globalThis.defLag;
    delete globalThis.vscTimer;
    delete globalThis.vscObserver;
};

/**
 * 创建工具栏的按钮
 * @since 1.2.0
 * @version 2.5.0
 */
function addThemeToolBar() {
    // 如果是发布模式就不添加按钮
    if (window.siyuan?.isPublish) return;
    // 如果不在主界面
    if (!document.getElementById("themeScript")) return;
    // 避免重复添加
    if (document.getElementById("vscleToolbar")) return;

    // 创建按钮
    const vscToolBar = document.createElement("div");
    vscToolBar.id = "vscleToolbar";
    vscToolBar.setAttribute("aria-label", globalThis.localMessage.settingButtonAria[globalThis.defLag]);
    vscToolBar.style.userSelect = "none";
    // 设置按钮文本
    vscToolBar.innerHTML = "VC";
    // 添加点击事件
    vscToolBar.addEventListener("click", createSettingsWindow);

    // 定位添加位置
    const toolbarVIP = document.getElementById("toolbarVIP");
    const windowControls = document.getElementById("windowControls");

    if (toolbarVIP) {
        // 桌面端，在VIP按钮前添加（插件按钮左）
        vscToolBar.className = "toolbar__item ariaLabel";
        vscToolBar.style.height = "23.5px";
        toolbarVIP.parentElement.insertBefore(vscToolBar, toolbarVIP);
    } else if (windowControls) {
        // 桌面端，在窗口控制按钮前添加（插件按钮右）
        vscToolBar.className = "toolbar__item ariaLabel";
        vscToolBar.style.height = "23.5px";
        windowControls.parentElement.insertBefore(vscToolBar, windowControls);
    } else {
        // 移动端，在文档菜单添加
        // 添加移动端记号
        document.body.classList.add("vscmobile");
        vscToolBar.className = "block__icon fn__flex-center ariaLabel";
        vscToolBar.style.height = "14px";

        const insertMobile = () => {
            // 尝试获取移动端的文档操作按钮
            const breadcrumbButtons = document.getElementsByClassName("block__icon fn__flex-center ariaLabel");
            // 在第一个按钮前添加
            const firstButton = breadcrumbButtons[0];
            if (firstButton) {
                firstButton.parentElement.insertBefore(vscToolBar, firstButton);
                globalThis.vscTimer.settingMobile = null;
            } else {
                globalThis.vscTimer.settingMobile = window.setTimeout(() => {
                    insertMobile();
                }, 1000);
            }
        };

        setTimeout(() => {
            insertMobile();
        }, 0);
    }
}

/**
 * 向css表中插入引用的语句
 * @param table &lt;link stylesheet&gt;
 * @param labels EnableSettings[]
 * @since 1.3.0
 * @version 2.6.0
 */
function addImports(table: HTMLLinkElement, labels: EnableSettings[]) {
    const sheet: CSSStyleSheet = table.sheet;
    const isMobile = document.body.classList.contains("vscmobile");
    let existBackgroundPlugin = Array.from(sheet.cssRules).some((rule) =>
        rule.cssText.includes("backgroundPlugin.css"),
    );
    const isExportPDF = !document.getElementById("themeScript");
    const isApplyTitle = labels.includes("title");
    const rulesToInsert: string[] = [];

    for (const it of labels) {
        switch (it) {
            case "codeBlock":
                rulesToInsert.push("@import url(sub/block/codeBlock.css);");
                break;
            case "reference":
                rulesToInsert.push("@import url(sub/block/reference.css);");
                break;
            case "bazaar":
                if (!isExportPDF) rulesToInsert.push("@import url(sub/app/bazaar.css);");
                break;
            case "embeddedBlock":
                rulesToInsert.push("@import url(sub/block/embeddedBlock.css);");
                break;
            case "title":
                rulesToInsert.push("@import url(sub/block/title.css);");
                break;
            case "titleShadow":
                if (isApplyTitle) rulesToInsert.push("@import url(sub/block/title-shadow.css);");
                break;
            case "titleIcon":
                if (isApplyTitle) rulesToInsert.push("@import url(sub/block/title-icon.css);");
                break;
            case "shortcutPanel":
                if (!isExportPDF) rulesToInsert.push("@import url(sub/plugin/keymapPlugin.css);");
                break;
            case "database":
                if (!isExportPDF) rulesToInsert.push("@import url(sub/block/database.css);");
                break;
            case "doctree":
                if (!isExportPDF) rulesToInsert.push("@import url(sub/app/filetree.css);");
                break;
            case "backgroundCoverDesktop":
            case "backgroundCoverMobile":
                if (!existBackgroundPlugin && !isExportPDF) {
                    rulesToInsert.push("@import url(sub/plugin/backgroundPlugin.css);");
                    existBackgroundPlugin = true;
                }
                break;
            case "mathPanel":
                if (!isMobile && !isExportPDF) rulesToInsert.push("@import url(sub/plugin/mathEnhance.css);");
                break;
            case "mark":
                rulesToInsert.push("@import url(sub/block/mark.css);");
                break;
            case "doubleTabbar":
                if (!isMobile && !isExportPDF) rulesToInsert.push("@import url(sub/plugin/doubleTabbar.css);");
                break;
            case "tag":
                rulesToInsert.push("@import url(sub/block/tag.css);");
                break;
            default:
                break;
        }
    }

    let index = 0;
    for (const rule of rulesToInsert) {
        try {
            sheet.insertRule(rule, index);
            index++;
        } catch (e) {
            // 加载失败
            console.error(globalThis.localMessage.loadCssFail[globalThis.defLag]);
            _postMessage("error", globalThis.localMessage.loadCssFail[globalThis.defLag]);
        }
    }
}

/**
 * ! 添加固定属性
 * @param settings EnableSettings[]
 * @since 1.3.5
 * @version 2.6.1
 */
function addFixedAttribute(settings: EnableSettings[]) {
    const isMobile = document.body.classList.contains("vscmobile");
    const isExportPDF = !document.getElementById("themeScript");
    // 运行
    // *>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // ?如果设置启用背景插件才进入判断
    if (
        (settings.includes("backgroundCoverDesktop") && !isMobile && !isExportPDF) ||
        (settings.includes("backgroundCoverMobile") && isMobile && !isExportPDF)
    ) {
        // 首先调用插件状态检测
        bg(0);
        // 添加观察器
        if (globalThis.vscObserver.bgObserver === null) {
            bgobserver(0);
        }
    }
    // *<<<<<<<<<<<<<<<<<<<<<<<<<<<<
}

/**
 * ! 添加导出脚本，在导出PDF时可用
 * @see https://github.com/siyuan-note/siyuan/issues/16300
 * @requires SiYuan Note Version 3.4.1
 * @since 2.6.0
 * @version 2.6.0
 */
function addPDFScript() {
    const isExist = !!document.getElementById("snippetJS-VSCodeLiteEdit");
    if (!isExist) {
        const themeScript = document.getElementById("themeScript") as HTMLScriptElement;
        let snippet = document.createElement("script");
        snippet.async = true;
        snippet.src = themeScript.src;
        snippet.id = "snippetJS-VSCodeLiteEdit";
        document.head.appendChild(snippet);
    }
}
