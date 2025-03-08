import { _postMessage, _writeFile } from "./ts/api";
import { loadGlobalVars } from "./ts/defs";
import { bg, bgobserver } from "./ts/plugins/background";
import { addTabbarObserver } from "./ts/plugins/doubleTabbar";
import { createSettingsWindow, getSettings } from "./ts/setting";
import { EnableSettings } from "./ts/types";

// 主题默认加载时进行的行为
// ! js代码加载后立即执行
(async function () {
    // 获取自己的css表
    const cssTable = document.getElementById('themeStyle') as HTMLLinkElement;
    // 添加全局变量
    await loadGlobalVars();
    // console.log(defLag);
    // console.log(cssTable);
    if (cssTable) {
        // 读取配置文件或生成配置文件
        var labels: EnableSettings[] = await getSettings();
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
        // 加载完成(o゜▽゜)o☆
        console.log(localMessage["loadFinish"][defLag]);
    } else {
        // 加载失败
        await _postMessage('error', globalThis.localMessage["localCssFail"][globalThis.defLag]);
    }
})();

// ! 更换主题时移除修改内容
window.destroyTheme = async () => {
    // 移除主题按钮
    document.querySelector("#vscleToolbar").remove();
    // 移除body特殊适配语句
    document.body.classList.remove('bgenable');
    // 移除双标签栏的style
    Array.from(document.querySelector(".layout__center").querySelectorAll(".item--pin")).forEach((item) => {
        (item as HTMLLIElement).style.removeProperty("margin-right");
        if ((item as HTMLLIElement).style.length == 0)
            (item as HTMLLIElement).removeAttribute("style");
    })
    // 移除计时器
    for (var key in globalThis.timer) {
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
};

/**
 * 创建工具栏的按钮
 */
function addThemeToolBar() {
    var vscToolBar = document.getElementById("vscleToolbar");
    if (vscToolBar == null) {
        var toolbarVIP = document.getElementById("toolbarVIP");
        var windowControls = document.getElementById("windowControls");
        vscToolBar = document.createElement("div");
        vscToolBar.id = "vscleToolbar";
        vscToolBar.setAttribute("aria-label", localMessage["label-aria"][defLag]);
        if (toolbarVIP == null) {
            try {
                vscToolBar.className = "toolbar__item ariaLabel";
                vscToolBar.style.height = "23.5px";
                windowControls.parentElement.insertBefore(vscToolBar, windowControls);
            } catch (error) {
                document.body.classList.add("vscmobile");
                vscToolBar.className = "block__icon fn__flex-center ariaLabel";
                vscToolBar.style.height = "14px";
                var breadcrumbButtons = document.getElementsByClassName("block__icon fn__flex-center ariaLabel");
                try {
                    var firstButton = breadcrumbButtons[0];
                    if (firstButton) {
                        firstButton.parentElement.insertBefore(vscToolBar, firstButton);
                    } else {
                        throw new Error("Can't find first button in breadcrumb.");
                    }
                } catch {
                    setTimeout(() => {
                        var firstButton = breadcrumbButtons[0];
                        if (firstButton) {
                            firstButton.parentElement.insertBefore(vscToolBar, firstButton);
                        }
                    }, 1000);
                }
            }
        } else {
            vscToolBar.className = "toolbar__item ariaLabel";
            vscToolBar.style.height = "23.5px";
            toolbarVIP.parentElement.insertBefore(vscToolBar, toolbarVIP);
        }
    }
    vscToolBar.innerHTML = "VC";
    // vscToolBar.innerHTML = "<img src=\"resources\\h6.bmp\"\\>";
    vscToolBar.addEventListener("click", () => {
        // 调用函数创建设置窗口
        createSettingsWindow();
    });
}

/**
 * 向css表中插入引用的语句
 * @param table \<link css\>
 * @param labels EnableSettings[]
 */
function addImports(table: HTMLLinkElement, labels: EnableSettings[]) {
    var sheet: CSSStyleSheet = table.sheet;
    var i = 0;
    // ! 向css表中插入引用的语句
    labels.forEach(it => {
        switch (it) {
            case "codeBlock":
                sheet.insertRule('@import url(sub/block/codeBlock.css);', 4 + i);
                i += 1;
                break;
            case "reference":
                sheet.insertRule('@import url(sub/block/reference.css);', 4 + i);
                i += 1;
                break;
            case "bazaar":
                sheet.insertRule('@import url(sub/app/bazaar.css);', 4 + i);
                i += 1;
                break;
            case "embeddedBlock":
                sheet.insertRule('@import url(sub/block/embeddedBlock.css);', 4 + i);
                i += 1;
                break;
            case "title":
                sheet.insertRule('@import url(sub/block/title.css);', 4 + i);
                i += 1;
                break;
            case "titleShadow":
                sheet.insertRule('@import url(sub/block/title-shadow.css);', 4 + i);
                i += 1;
                break;
            case "titleIcon":
                sheet.insertRule('@import url(sub/block/title-icon.css);', 4 + i);
                i += 1;
                break;
            case "shortcutPanel":
                sheet.insertRule('@import url(sub/plugin/keymapPlugin.css);', 4 + i);
                i += 1;
                break;
            case "database":
                sheet.insertRule('@import url(sub/block/database.css);', 4 + i);
                i += 1;
                break;
            case "doctree":
                sheet.insertRule('@import url(sub/app/filetree.css);', 4 + i);
                i += 1;
                break;
            case "backgroundCoverDesktop":
            case "backgroundCoverMobile":
                if (!sheet.cssRules.toString().includes('backgroundPlugin.css')) {
                    sheet.insertRule('@import url(sub/plugin/backgroundPlugin.css);', 4 + i);
                    i += 1;
                }
                break;
            case "mathPanel":
                if (!document.body.classList.contains('vscmobile')) {
                    sheet.insertRule('@import url(sub/plugin/mathEnhance.css);', 4 + i);
                    i += 1;
                }
                break;
            case "mark":
                sheet.insertRule('@import url(sub/block/mark.css);', 4 + i);
                i += 1;
                break;
            case "doubleTabbar":
                sheet.insertRule("@import url(sub/plugin/doubleTabbar.css);", 4 + i);
                i += 1;
                break;
            default:
                break;
        }
    });
}

/**
 * ! 添加固定属性
 * @param settings EnableSettings[]
 */
function addFixedAttribute(settings: EnableSettings[]) {
    // 运行
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // 如果设置启用背景插件才进入判断
    if (settings.includes("backgroundCoverDesktop") && !document.body.classList.contains('vscmobile') || settings.includes("backgroundCoverMobile") && document.body.classList.contains('vscmobile')) {
        // 首先调用插件状态检测
        bg(0);
        // 添加观察器
        if (globalThis.vscObserver.bgObserver == null) {
            bgobserver(0);
        }
    }
    // 如果启用了双标签栏
    if (settings.includes("doubleTabbar") && !document.body.classList.contains("vscmobile")) {
        // 添加观察器
        if (globalThis.vscObserver.tabbarObserver == null) {
            addTabbarObserver(document.querySelector(".layout__center").querySelector(".layout-tab-bar") as HTMLUListElement);
        }
    }
    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<
}

/**
 * ! 添加导出pdf时候的样式
 * @param lab EnableSettings[]
 */
async function addPdfStyle(lab: EnableSettings[]) {
    var list = [];
    list.push("@charset \"UTF-8\";");
    lab.forEach(it => {
        switch (it) {
            case "codeBlock":
                list.push('@import url(block/codeBlock.css);');
                break;
            case "reference":
                list.push('@import url(block/reference.css);');
                break;
            case "title":
                list.push('@import url(block/title.css);');
                break;
            case "titleShadow":
                list.push('@import url(block/title-shadow.css);');
                break;
            case "titleIcon":
                list.push('@import url(block/title-icon.css);');
                break;
            case "database":
                list.push('@import url(block/database.css);');
                break;
            case "mark":
                list.push('@import url(block/mark.css);');
                break;
            default:
                break;
        }
    });
    var str = list.join("\n");
    await _writeFile("/conf/appearance/themes/siyuan-vscodelite-edit/sub/pdfPreview.css", str);
}

/**
 * 移除CSS规则，用于在可加载js的时候去掉PDF导出适配
 * @param table \<link css\>
 */
function removeCSSRules(table: HTMLLinkElement) {
    var sheet = table.sheet as CSSStyleSheet;

    // 移除特定的 @import 规则
    var removeImportRule = (sheet: CSSStyleSheet, url: string) => {
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
    removeImportRule(sheet, 'sub/pdfPreview.css');
}