import {
    _rqFORSiyuan,
    _getFile,
    _postMessage,
    _writeFile,
    getSettings,
    putSettings
} from "./ts/api";
import { loadGlobalVars } from "./ts/defs";
import { createSettingsWindow } from "./ts/setting";
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
    // 删除PDF适配
    await addPdfStyle([]);
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
                vscToolBar.style.width = "23.5px";
                vscToolBar.style.height = "23.5px";
                windowControls.parentElement.insertBefore(vscToolBar, windowControls);
            } catch (error) {
                document.body.classList.add("vscmobile");
                vscToolBar.className = "block__icon fn__flex-center ariaLabel";
                vscToolBar.style.width = "14px";
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
            vscToolBar.style.width = "23.5px";
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
            default:
                break;
        }
    });
}

/**
 * ! 添加固定属性
 */
function addFixedAttribute(settings: EnableSettings[]) {
    function bg(times: number) {
        // 背景自定义插件，部分情况下插件加载缓慢可重复检测一次
        var bglayer = document.getElementById("bglayer");
        if (bglayer) {
            var style = window.getComputedStyle(bglayer);
            var body = document.body;
            if (style.getPropertyValue("display") != 'none') {
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
        } else if (times == 0 || times == 1) {
            // 未启用插件3秒后重新检测两遍
            setTimeout(bg, 3000, times + 1);
        }
    }
    // 监听背景自定义插件的属性修改
    function bgobserver(times: number) {
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
            globalThis.timer.bgObserTimer = null;
        } else {
            // if (times == 0 && !document.body.classList.contains('vscmobile')) {
            if (times == 0) {
                // 运行失败等待5秒
                globalThis.timer.bgObserTimer = setTimeout(bgobserver, 5000, 1);
            } else if (times == 1) {
                console.error("背景插件监听失败，修改插件启用状态需手动刷新");
                globalThis.timer.bgObserTimer = null;
            }
        }
    }
    // 运行
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // 如果设置启用背景插件才进入判断
    if (settings.includes("backgroundCoverDesktop") || settings.includes("backgroundCoverMobile")) {
        bg(0);
        if (globalThis.observer.bgObserver == null) {
            bgobserver(0);
        }
    }
    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<
}

/**
 * ! 添加导出pdf时候的样式
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