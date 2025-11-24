import { _postMessage, _writeFile } from "./ts/api";
import { loadGlobalVars } from "./ts/defs";
import { bg, bgobserver } from "./ts/plugins/background";
import { createSettingsWindow, getSettings } from "./ts/setting";
import { EnableSettings } from "./ts/types.d";

// 主题默认加载时进行的行为
// ! js代码加载后立即执行
(async function () {
    // 获取自己的css表
    const cssTable = document.getElementById("themeStyle") as HTMLLinkElement;
    // 添加全局变量
    try {
        await loadGlobalVars();
    } catch (e) {
        // 基本上意味着主题启用失败了
        console.error(globalThis.localMessage.loadVariableFail[globalThis.defLag]);
        console.error(e);
        await _postMessage("error", globalThis.localMessage.loadVariableFail[globalThis.defLag]);
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
        // 移除CSS规则
        removeCSSRules(cssTable);
        // 添加固定属性
        addFixedAttribute(labels);
        // 修复导出pdf没有样式的问题，在空闲时间执行
        if ("requestIdleCallback" in window) {
            requestIdleCallback(async () => {
                try {
                    await addPdfStyle(labels);
                } catch (e) {
                    // 加载PDF导出预设失败只会影响导出PDF的视觉效果，不影响正常使用主题，没必要让用户知道这里报错了
                    console.error(globalThis.localMessage.loadPDFPersetFail[globalThis.defLag]);
                    console.error(e);
                }
            });
        } else {
            // 如果浏览器没有这个函数，就通过定时器执行
            setTimeout(async () => {
                try {
                    await addPdfStyle(labels);
                } catch (e) {
                    // 加载PDF导出预设失败只会影响导出PDF的视觉效果，不影响正常使用主题，没必要让用户知道这里报错了
                    console.error(globalThis.localMessage.loadPDFPersetFail[globalThis.defLag]);
                    console.error(e);
                }
            }, 0);
        }
        // 加载完成(o゜▽゜)o☆
        console.log(globalThis.localMessage.loadFinish[globalThis.defLag]);
    } else {
        // 加载失败
        console.error(globalThis.localMessage.loadCssFail[globalThis.defLag]);
        await _postMessage("error", globalThis.localMessage.loadCssFail[globalThis.defLag]);
    }
})();

// ! 更换主题时移除修改内容
window.destroyTheme = async () => {
    // 移除主题按钮
    document.querySelector("#vscleToolbar").remove();
    // 移除body特殊适配语句
    document.body.classList.remove("bgenable");
    document.body.classList.remove("vscmobile");
    // 移除计时器
    for (let key in globalThis.vscTimer) {
        if (globalThis.vscTimer[key] !== null) {
            // console.log("remove timer");
            // 可以清除 timeout 和 interval
            clearTimeout(globalThis.vscTimer[key]);
            globalThis.vscTimer[key] = null;
        }
    }
    // 移除监视器
    for (let key in globalThis.vscObserver) {
        if (globalThis.vscObserver[key] !== null) {
            // console.log("remove observer");
            globalThis.vscObserver[key].disconnect();
            globalThis.vscObserver[key] = null;
        }
    }
    // 删除全局变量
    delete globalThis.defaultConf;
    delete globalThis.localMessage;
    delete globalThis.defLag;
    delete globalThis.vscTimer;
    delete globalThis.vscObserver;
};

/**
 * 创建工具栏的按钮
 */
function addThemeToolBar() {
    // 如果是发布模式就不添加按钮
    if (window.siyuan?.isPublish) return;
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
                globalThis.vscTimer.settingMobile = setTimeout(() => {
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
 * @param table \<link stylesheet\>
 * @param labels EnableSettings[]
 */
function addImports(table: HTMLLinkElement, labels: EnableSettings[]) {
    const sheet: CSSStyleSheet = table.sheet;
    const isMobile = document.body.classList.contains("vscmobile");
    let existBackgroundPlugin = Array.from(sheet.cssRules).some((rule) =>
        rule.cssText.includes("backgroundPlugin.css"),
    );
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
                rulesToInsert.push("@import url(sub/app/bazaar.css);");
                break;
            case "embeddedBlock":
                rulesToInsert.push("@import url(sub/block/embeddedBlock.css);");
                break;
            case "title":
                rulesToInsert.push("@import url(sub/block/title.css);");
                break;
            case "titleShadow":
                rulesToInsert.push("@import url(sub/block/title-shadow.css);");
                break;
            case "titleIcon":
                rulesToInsert.push("@import url(sub/block/title-icon.css);");
                break;
            case "shortcutPanel":
                rulesToInsert.push("@import url(sub/plugin/keymapPlugin.css);");
                break;
            case "database":
                rulesToInsert.push("@import url(sub/block/database.css);");
                break;
            case "doctree":
                rulesToInsert.push("@import url(sub/app/filetree.css);");
                break;
            case "backgroundCoverDesktop":
            case "backgroundCoverMobile":
                if (!existBackgroundPlugin) {
                    rulesToInsert.push("@import url(sub/plugin/backgroundPlugin.css);");
                    existBackgroundPlugin = true;
                }
                break;
            case "mathPanel":
                if (!isMobile) {
                    rulesToInsert.push("@import url(sub/plugin/mathEnhance.css);");
                }
                break;
            case "mark":
                rulesToInsert.push("@import url(sub/block/mark.css);");
                break;
            case "doubleTabbar":
                if (!isMobile) {
                    rulesToInsert.push("@import url(sub/plugin/doubleTabbar.css);");
                }
                break;
            case "tag":
                rulesToInsert.push("@import url(sub/block/tag.css);");
                break;
            default:
                break;
        }
    }

    let index = 4;
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
 */
function addFixedAttribute(settings: EnableSettings[]) {
    const isMobile = document.body.classList.contains("vscmobile");
    // 运行
    // *>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // ?如果设置启用背景插件才进入判断
    if (
        (settings.includes("backgroundCoverDesktop") && !isMobile) ||
        (settings.includes("backgroundCoverMobile") && isMobile)
    ) {
        // 首先调用插件状态检测
        bg(0);
        // 添加观察器
        if (globalThis.vscObserver.bgObserver == null) {
            bgobserver(0);
        }
    }
    // *<<<<<<<<<<<<<<<<<<<<<<<<<<<<
}

/**
 * ! 添加导出pdf时候的样式
 * @param lab EnableSettings[]
 */
async function addPdfStyle(lab: EnableSettings[]) {
    // 如果是发布模式就不写入文件
    if (window.siyuan?.isPublish) return;
    const list: string[] = ['@charset "UTF-8";'];
    for (const it of lab) {
        switch (it) {
            case "codeBlock":
                list.push("@import url(block/codeBlock.css);");
                break;
            case "reference":
                list.push("@import url(block/reference.css);");
                break;
            case "title":
                list.push("@import url(block/title.css);");
                break;
            case "titleShadow":
                list.push("@import url(block/title-shadow.css);");
                break;
            case "titleIcon":
                list.push("@import url(block/title-icon.css);");
                break;
            case "database":
                list.push("@import url(block/database.css);");
                break;
            case "mark":
                list.push("@import url(block/mark.css);");
                break;
            case "tag":
                list.push("@import url(block/tag.css);");
                break;
            default:
                break;
        }
    }
    const str = list.join("\n");
    await _writeFile("/conf/appearance/themes/siyuan-vscodelite-edit/sub/pdfPreview.css", str);
}

/**
 * 移除CSS规则，用于在可加载js的时候去掉PDF导出适配
 * @param table \<link stylesheet\>
 */
function removeCSSRules(table: HTMLLinkElement) {
    const sheet = table.sheet as CSSStyleSheet;

    // 移除特定的 @import 规则
    function removeImportRule(sheet: CSSStyleSheet, url: string) {
        for (let i = sheet.cssRules.length - 1; i >= 0; i--) {
            const rule = sheet.cssRules[i];
            if (rule instanceof CSSImportRule && rule.href.includes(url)) {
                sheet.deleteRule(i);
                break; // 找到并删除目标规则后停止遍历
            }
        }
    }

    // 移除 @import("sub/pdfPreview.css") 规则
    removeImportRule(sheet, "sub/pdfPreview.css");
}
