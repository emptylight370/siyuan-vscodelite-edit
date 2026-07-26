import { settingsSchema } from "./settingsSchema";
import { SupportedLang, ThemeConfig } from "./types";

/**
 * 加载全局变量
 * @since 1.3.3
 * @version 3.0.11
 */
export async function loadGlobalVars() {
    /**
     * ! 默认配置文件
     * @since 1.2.0
     * @version 3.0.11
     */
    globalThis.vscDefaultConf = {
        version: 15,
        lastSeen: "3.0.11",
        // 由 settingsSchema 自动聚合默认配置
        theme: Object.fromEntries(
            settingsSchema.filter((s) => s.group === "theme").map((s) => [s.key, s.default]),
        ) as ThemeConfig["theme"],
        plugins: Object.fromEntries(
            settingsSchema.filter((s) => s.group === "plugins").map((s) => [s.key, s.default]),
        ) as ThemeConfig["plugins"],
    };

    /**
     * ! 默认消息本地化
     * @since 1.3.3
     * @version 3.0.4
     */
    globalThis.vscMessage = {
        language: {
            "zh-CN": true,
            en: true,
        },
        loadCssFail: {
            "zh-CN": "加载主题VSCode Lite Edit失败，无法获取当前样式表",
            en: "Load theme VSCode Lite Edit failed, can't load current style table",
        },
        loadConfigFail: {
            "zh-CN": "加载主题VSCode Lite Edit失败，无法加载配置",
            en: "Load theme VSCode Lite Edit failed, can't load configuration",
        },
        loadPDFPersetFail: {
            "zh-CN": "加载主题VSCode Lite Edit的PDF导出预设失败",
            en: "Load the PDF export preset of theme VSCode Lite Edit failed",
        },
        loadFinish: {
            "zh-CN": "主题VSCode Lite Edit加载完成",
            en: "Theme VSCode Lite Edit load finished",
        },
        confUpdate: {
            "zh-CN": "VSCE:主题配置文件需要更新，请点击<code>VC</code>按钮重新保存配置文件",
            en: "VSCE:Theme conf file needs update, please click <code>VC</code> button to save the configuration file again",
        },
        confNotSave: {
            "zh-CN": "VSCE:配置未保存",
            en: "VSCE:Configurations not saved",
        },
        confSave: {
            "zh-CN": "VSCE:配置保存成功，稍后自动刷新",
            en: "VSCE:Configuration save successed, auto reload later",
        },
        newVersionHint: {
            "zh-CN":
                "VSCE:感谢更新VSCode Lite Edit主题，主题已经移除引述块的自定义属性，请用官方的Callout块代替。具体移除属性请查看主题介绍。<br/>本通知只应在主题更新后显示一次，如多次反复显示请在非发布模式下打开工作空间或重新保存主题设置。点击本通知以关闭。",
            en: "VSCE: Thanks for update VSCode Lite Edit theme, the custom attributes of quote block have been removed, please use the officiall Callout block. Please refer to theme readme to see which attributes will be removed.<br/>This notice should only be displayed once after the theme is updated. If it is displayed repeatedly multiple times, please open the workspace in non-publishing mode or re-save the theme settings. Click this notice to close.",
        },
        typewriterON: {
            "zh-CN": "VSCE:打字机模式已开启",
            en: "VSCE:Typewriter mode is ON",
        },
        typewriterOFF: {
            "zh-CN": "VSCE:打字机模式已关闭",
            en: "VSCE:Typewriter mode is OFF",
        },
        settingButtonAria: {
            "zh-CN": "VSCode Lite 主题设置",
            en: "VSCode Lite theme setting",
        },
        settingPanelTitle: {
            "zh-CN": "VSCode Lite Edit设置",
            en: "VSCode Lite Edit Settings",
        },
        settingTabSiYuan: {
            "zh-CN": "思源",
            en: "SiYuan",
        },
        settingTabPlugin: {
            "zh-CN": "插件",
            en: "Plugins",
        },
        tabTipSiYuan: {
            "zh-CN": "思源内置功能的外观调整",
            en: "Appearance adjustment for SiYuan's built-in functions",
        },
        tabTipPlugin: {
            "zh-CN": "适配特定插件的外观调整",
            en: "Appearance adjustment for specific plugins",
        },
        saveReload: {
            "zh-CN": "保存并刷新",
            en: "Save and Reload",
        },
        nSave: {
            "zh-CN": "不保存",
            en: "NOT Save",
        },
        oReload: {
            "zh-CN": "刷新思源界面",
            en: "Reload Siyuan",
        },
        oUpdate: {
            "zh-CN": "显示版本更新通知",
            en: "Show version update notice",
        },
        oBazaar: {
            "zh-CN": "在集市中打开说明文档",
            en: "Open readme in bazaar",
        },
        tipSave: {
            "zh-CN": "直接关闭设置窗口不保存，必须点击保存按钮。如果刷新无效，请重启思源或尝试右侧的刷新按钮。",
            en: "Close the setting panel directly will not save changes, you must click the Save button. If refresh doesn't work, please restart SiYuan or try the refresh button on the right.",
        },
        tipSwitch: {
            "zh-CN": "点击一行中任意位置切换开关状态",
            en: "Click anywhere in the row to change the status of switch",
        },
        cbitem: {
            "zh-CN": "代码块样式",
            en: "code block style",
        },
        refitem: {
            "zh-CN": "引用标签样式",
            en: "reference label style",
        },
        bazitem: {
            "zh-CN": "集市样式",
            en: "bazaar style",
        },
        emitem: {
            "zh-CN": "嵌入块样式",
            en: "embedded block style",
        },
        emdesc: {
            "zh-CN": "限制嵌入块高度",
            en: "Limit the height of embedded block",
        },
        tititem: {
            "zh-CN": "标题块样式",
            en: "Heading block style",
        },
        titleShadow: {
            "zh-CN": "标题添加阴影",
            en: "Heading add shadow",
        },
        titleShadowDesc: {
            "zh-CN": "仅启用标题样式有效",
            en: "Only effective when enable heading style",
        },
        titleIcon: {
            "zh-CN": "标题前添加图标",
            en: "Add icon before title",
        },
        titleIconDesc: {
            "zh-CN": "仅启用标题样式有效",
            en: "Only effective when enable heading style",
        },
        dbitem: {
            "zh-CN": "数据库样式",
            en: "database style",
        },
        markitem: {
            "zh-CN": "高亮标注样式",
            en: "highlight mark style",
        },
        scitem: {
            "zh-CN": "快捷键面板样式",
            en: "Shortcut key panel style",
        },
        ftitem: {
            "zh-CN": "文档树和大纲样式",
            en: "Doc tree and Outline style",
        },
        bgdesktop: {
            "zh-CN": "在电脑端启用“替换背景图片”插件",
            en: 'Enable plugin "Background cover adaption" on desktop',
        },
        bgdesc: {
            "zh-CN": "覆写部分插件设置，相关设置失效属正常现象。",
            en: "Overrides some plugin settings. It is normal if related settings do not take effect.",
        },
        bgmobile: {
            "zh-CN": "在移动端启用“替换背景图片”插件",
            en: 'Enable plguin "Background cover adaption" on mobile',
        },
        mathitem: {
            "zh-CN": "数学增强插件调整",
            en: "Math enhance plugin adjustion",
        },
        mathdesc: {
            "zh-CN": "调整插件默认宽度，无法显示水平滚动条",
            en: "Adjust the default width of the plugin, can't show horizon scroll bar",
        },
        doubleTabbaritem: {
            "zh-CN": "（实验性）启用双标签栏",
            en: "(Expermental) Enable double tab bar",
        },
        doubleTabbardesc: {
            "zh-CN": "将钉住的标签移动到新标签栏（有缺陷！）",
            en: "Move pinned tab to new tab bar(WITH BUGS!)",
        },
        doubleTabbarMessage: {
            "zh-CN": "VSCE:点击暂时不能改变标签页，请手动点击原标签页",
            en: "VSCE:Can't change tab while clicking now, click original tab manually please",
        },
        tagitem: {
            "zh-CN": "块内标签样式",
            en: "The style of tags",
        },
        tagdesc: {
            "zh-CN": "块内标签样式跟随文档标签样式",
            en: "The style of tags in block uses the style of tags of document",
        },
        slashMenuitem: {
            "zh-CN": "斜杠(/)菜单多栏显示",
            en: "Slash(/) menu multi column display",
        },
        typewriteritem: {
            "zh-CN": "打字机模式",
            en: "Typewriter mode",
        },
        typewriterdesc: {
            "zh-CN": "编辑时光标所在块始终保持在屏幕中央(可能带来性能问题)",
            en: "Keep the cursor block centered in the viewport while editing(may cause performance issues)",
        },
        filetreeExpanditem: {
            "zh-CN": "鼠标光标适配点击标题、图标展开收起文档树",
            en: "Mouse cursor adaption click title, icon to expand or collapse the document tree",
        },
        filetreeExpanddesc: {
            "zh-CN":
                "适配电脑端设置：点击文档树图标、标题展开收起文档树，仅在启用这两个设置项时启用。在可打开文档处显示特殊光标",
            en: "Adapt desktop settings: Click the document tree icon, title to expand or collapse the document tree, only enable when enable these two settings. Show special cursor on where you can open the document",
        },
    };

    // 浏览器获取的默认语言
    let currentLang = window?.siyuan?.config?.lang ?? document.documentElement.lang;

    // 将 currentLang 转换为 SupportedLang 类型
    let supportedLang: SupportedLang;

    // 类型守卫：检查一个字符串是否是 SupportedLang
    function isSupportedLang(lang: string): lang is SupportedLang {
        return lang === "zh-CN" || lang === "en";
    }

    if (isSupportedLang(currentLang)) {
        // 如果已经是支持的语言，直接使用
        supportedLang = currentLang;
    } else if (currentLang === "zh-TW") {
        // 繁体中文回退到简体中文
        supportedLang = "zh-CN";
    } else {
        // 其他语言回退到英文
        supportedLang = "en";
    }

    // 检查该语言是否在 language 对象中标记为可用
    if (globalThis.vscMessage.language[supportedLang] != undefined) {
        globalThis.vscLang = supportedLang;
    } else {
        // 如果标记为不可用，使用 en 作为回退
        globalThis.vscLang = "en";
    }

    /**
     * ! 所有用到的计时器
     * @since 1.3.5
     * @version 2.6.3
     */
    globalThis.vscTimers = {
        // 背景插件加载后可能禁用，使用计时器定时刷新背景插件状态
        bgTimer: null,
        // 背景插件属性修改的监听器，用来监测背景状态变化
        bgObserTimer: null,
        // 在移动端添加设置按钮的计时器，在初次添加失败后会每秒尝试一次
        settingMobileTimer: null,
        // 斜杠菜单检测数量的计时器，定时检测斜杠菜单数量并为每个菜单添加观察器
        slashMenuTimer: null,
    };

    /**
     * ! 所有用到的监听器
     * @since 1.4.0
     * @version 2.6.3
     */
    globalThis.vscObservers = {
        // 背景插件显示观察器
        bgObserver: null,
        // 背景插件启用观察器
        bgExistObserver: null,
        // 标签栏状态观察器
        tabbarObserver: null,
        // 斜杠菜单显示状态观察器
        slashDisplayObserver: null,
    };

    /**
     * ! 所有用到的计数器
     * @since 2.6.2
     * @version 2.6.2
     */
    globalThis.vscCounters = {
        // 斜杠菜单数量
        slashMenuCount: 0,
    };
}
