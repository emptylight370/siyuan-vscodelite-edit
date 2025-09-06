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
        console.error(globalThis.localMessage["loadVariableFail"][globalThis.defLag]);
        console.error(e);
        await _postMessage("error", globalThis.localMessage["loadVariableFail"][globalThis.defLag]);
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
            console.error(globalThis.localMessage["loadConfigFail"][globalThis.defLag]);
            console.error(e);
            await _postMessage("error", globalThis.localMessage["loadConfigFail"][globalThis.defLag]);
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
        // 修复导出pdf没有样式的问题
        try {
            await addPdfStyle(labels);
        } catch (e) {
            // 加载PDF导出预设失败只会影响导出PDF的视觉效果，不影响正常使用主题，没必要让用户知道这里报错了
            console.error(globalThis.localMessage["loadPDFPersetFail"][globalThis.defLag]);
            console.error(e);
        }
        // 加载完成(o゜▽゜)o☆
        console.log(globalThis.localMessage["loadFinish"][globalThis.defLag]);
    } else {
        // 加载失败
        console.error(globalThis.localMessage["loadCssFail"][globalThis.defLag]);
        await _postMessage("error", globalThis.localMessage["loadCssFail"][globalThis.defLag]);
    }
})();

// ! 更换主题时移除修改内容
window.destroyTheme = async () => {
    // 移除主题按钮
    document.querySelector("#vscleToolbar").remove();
    // 移除body特殊适配语句
    document.body.classList.remove("bgenable");
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
    let vscToolBar = document.getElementById("vscleToolbar");
    // 如果不存在按钮
    if (vscToolBar == null) {
        // 定位添加位置
        const toolbarVIP = document.getElementById("toolbarVIP");
        const windowControls = document.getElementById("windowControls");
        // 开始创建按钮
        vscToolBar = document.createElement("div");
        vscToolBar.id = "vscleToolbar";
        vscToolBar.setAttribute("aria-label", globalThis.localMessage["label-aria"][globalThis.defLag]);
        vscToolBar.style.userSelect = "none";
        // 如果不存在思源VIP按钮（设置隐藏只不显示）
        if (toolbarVIP == null) {
            try {
                // 尝试在窗口控制按钮前添加
                vscToolBar.className = "toolbar__item ariaLabel";
                vscToolBar.style.height = "23.5px";
                windowControls.parentElement.insertBefore(vscToolBar, windowControls);
            } catch (error) {
                // 添加移动端记号
                document.body.classList.add("vscmobile");
                vscToolBar.className = "block__icon fn__flex-center ariaLabel";
                vscToolBar.style.height = "14px";
                // 尝试获取移动端的文档操作按钮
                const breadcrumbButtons = document.getElementsByClassName("block__icon fn__flex-center ariaLabel");
                try {
                    // 在第一个按钮前添加
                    const firstButton = breadcrumbButtons[0];
                    if (firstButton) {
                        firstButton.parentElement.insertBefore(vscToolBar, firstButton);
                    } else {
                        throw new Error("Can't find first button in breadcrumb.");
                    }
                } catch {
                    setTimeout(() => {
                        const firstButton = breadcrumbButtons[0];
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
    // 设置按钮文本
    vscToolBar.innerHTML = "VC";
    // vscToolBar.innerHTML = "<img src=\"resources\\h6.bmp\"\\>";
    // 添加点击事件
    vscToolBar.addEventListener("click", () => {
        // 调用函数创建设置窗口
        createSettingsWindow();
    });
}

/**
 * 向css表中插入引用的语句
 * @param table \<link stylesheet\>
 * @param labels EnableSettings[]
 */
function addImports(table: HTMLLinkElement, labels: EnableSettings[]) {
    const sheet: CSSStyleSheet = table.sheet;
    let i = 0;
    // ! 向css表中插入引用的语句
    labels.forEach((it) => {
        switch (it) {
            case "codeBlock":
                sheet.insertRule("@import url(sub/block/codeBlock.css);", 4 + i);
                i += 1;
                break;
            case "reference":
                sheet.insertRule("@import url(sub/block/reference.css);", 4 + i);
                i += 1;
                break;
            case "bazaar":
                sheet.insertRule("@import url(sub/app/bazaar.css);", 4 + i);
                i += 1;
                break;
            case "embeddedBlock":
                sheet.insertRule("@import url(sub/block/embeddedBlock.css);", 4 + i);
                i += 1;
                break;
            case "title":
                sheet.insertRule("@import url(sub/block/title.css);", 4 + i);
                i += 1;
                break;
            case "titleShadow":
                sheet.insertRule("@import url(sub/block/title-shadow.css);", 4 + i);
                i += 1;
                break;
            case "titleIcon":
                sheet.insertRule("@import url(sub/block/title-icon.css);", 4 + i);
                i += 1;
                break;
            case "shortcutPanel":
                sheet.insertRule("@import url(sub/plugin/keymapPlugin.css);", 4 + i);
                i += 1;
                break;
            case "database":
                sheet.insertRule("@import url(sub/block/database.css);", 4 + i);
                i += 1;
                break;
            case "doctree":
                sheet.insertRule("@import url(sub/app/filetree.css);", 4 + i);
                i += 1;
                break;
            case "backgroundCoverDesktop":
            case "backgroundCoverMobile":
                if (!sheet.cssRules.toString().includes("backgroundPlugin.css")) {
                    sheet.insertRule("@import url(sub/plugin/backgroundPlugin.css);", 4 + i);
                    i += 1;
                }
                break;
            case "mathPanel":
                if (!document.body.classList.contains("vscmobile")) {
                    sheet.insertRule("@import url(sub/plugin/mathEnhance.css);", 4 + i);
                    i += 1;
                }
                break;
            case "mark":
                sheet.insertRule("@import url(sub/block/mark.css);", 4 + i);
                i += 1;
                break;
            case "doubleTabbar":
                if (!document.body.classList.contains("vscmobile")) {
                    sheet.insertRule("@import url(sub/plugin/doubleTabbar.css);", 4 + i);
                    i += 1;
                }
                break;
            case "tag":
                sheet.insertRule("@import url(sub/block/tag.css);", 4 + i);
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
    // *>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // ?如果设置启用背景插件才进入判断
    if (
        (settings.includes("backgroundCoverDesktop") && !document.body.classList.contains("vscmobile")) ||
        (settings.includes("backgroundCoverMobile") && document.body.classList.contains("vscmobile"))
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
    const list: string[] = [];
    list.push('@charset "UTF-8";');
    lab.forEach((it) => {
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
            default:
                break;
        }
    });
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
    const removeImportRule = (sheet: CSSStyleSheet, url: string) => {
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
    removeImportRule(sheet, "sub/pdfPreview.css");
}
