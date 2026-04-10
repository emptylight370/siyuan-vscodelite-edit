import { Config } from "siyuan/types/config";
import { SupportedLang } from "./types";

/**
 * 加载全局变量
 * @since 1.3.3
 * @version 2.7.8
 */
export async function loadGlobalVars() {
    /**
     * ! 默认配置文件
     * @since 1.2.0
     * @version 2.7.8
     */
    globalThis.vscDefaultConf = {
        version: 13,
        lastSeen: "2.7.8",
        theme: {
            codeBlock: true,
            reference: true,
            bazaar: true,
            embeddedBlock: true,
            title: true,
            titleShadow: true,
            titleIcon: true,
            database: true,
            doctree: true,
            mark: true,
            tag: true,
            slashMenu: false,
        },
        plugins: {
            shortcutPanel: true,
            mathPanel: false,
            backgroundCoverDesktop: true,
            backgroundCoverMobile: false,
            doubleTabbar: false,
        },
    };

    /**
     * ! 默认消息本地化
     * @since 1.3.3
     * @version 2.7.0
     */
    globalThis.vscMessage = {
        language: {
            zh_CN: true,
            en_US: true,
        },
        loadCssFail: {
            zh_CN: "加载主题VSCode Lite Edit失败，无法获取当前样式表",
            en_US: "Load theme VSCode Lite Edit failed, can't load current style table",
        },
        loadConfigFail: {
            zh_CN: "加载主题VSCode Lite Edit失败，无法加载配置",
            en_US: "Load theme VSCode Lite Edit failed, can't load configuration",
        },
        loadPDFPersetFail: {
            zh_CN: "加载主题VSCode Lite Edit的PDF导出预设失败",
            en_US: "Load the PDF export preset of theme VSCode Lite Edit failed",
        },
        loadFinish: {
            zh_CN: "主题VSCode Lite Edit加载完成",
            en_US: "Theme VSCode Lite Edit load finished",
        },
        confUpdate: {
            zh_CN: "VSCE:主题配置文件需要更新，请点击<code>VC</code>按钮重新保存配置文件",
            en_US: "VSCE:Theme conf file needs update, please click <code>VC</code> button to save the configuration file again",
        },
        confNotSave: {
            zh_CN: "VSCE:配置未保存",
            en_US: "VSCE:Configurations not saved",
        },
        confSave: {
            zh_CN: "VSCE:配置保存成功，稍后自动刷新",
            en_US: "VSCE:Configuration save successed, auto reload later",
        },
        newVersionHint: {
            zh_CN: "VSCE:感谢更新VSCode Lite Edit主题，主题已经移除引述块的自定义属性，请用官方的Callout块代替。具体移除属性请查看主题介绍。<br/>本通知只应在主题更新后显示一次，如多次反复显示请在非发布模式下打开工作空间或重新保存主题设置。点击本通知以关闭。",
            en_US: "VSCE: Thanks for update VSCode Lite Edit theme, the custom attributes of quote block have been removed, please use the officiall Callout block. Please refer to theme readme to see which attributes will be removed.<br/>This notice should only be displayed once after the theme is updated. If it is displayed repeatedly multiple times, please open the workspace in non-publishing mode or re-save the theme settings. Click this notice to close.",
        },
        settingButtonAria: {
            zh_CN: "VSCode Lite 主题设置",
            en_US: "VSCode Lite theme setting",
        },
        settingPanelTitle: {
            zh_CN: "VSCode Lite Edit设置",
            en_US: "VSCode Lite Edit Settings",
        },
        settingTabSiYuan: {
            zh_CN: "思源",
            en_US: "SiYuan",
        },
        settingTabPlugin: {
            zh_CN: "插件",
            en_US: "Plugins",
        },
        tabTipSiYuan: {
            zh_CN: "思源内置功能的外观调整",
            en_US: "Appearance adjustment for SiYuan's built-in functions",
        },
        tabTipPlugin: {
            zh_CN: "适配特定插件的外观调整",
            en_US: "Appearance adjustment for specific plugins",
        },
        saveReload: {
            zh_CN: "保存并刷新",
            en_US: "Save and Reload",
        },
        nSave: {
            zh_CN: "不保存",
            en_US: "NOT Save",
        },
        oReload: {
            zh_CN: "刷新思源界面",
            en_US: "Reload Siyuan",
        },
        oUpdate: {
            zh_CN: "显示版本更新通知",
            en_US: "Show version update notice",
        },
        tipSave: {
            zh_CN: "直接关闭设置窗口不保存，必须点击保存按钮。如果刷新无效，请重启思源或尝试右侧的刷新按钮。",
            en_US: "Close the setting panel directly will not save changes, you must click the Save button. If refresh doesn't work, please restart SiYuan or try the refresh button on the right.",
        },
        tipSwitch: {
            zh_CN: "点击一行中任意位置切换开关状态",
            en_US: "Click anywhere in the row to change the status of switch",
        },
        cbitem: {
            zh_CN: "代码块样式",
            en_US: "code block style",
        },
        refitem: {
            zh_CN: "引用标签样式",
            en_US: "reference label style",
        },
        bazitem: {
            zh_CN: "集市样式",
            en_US: "bazaar style",
        },
        emitem: {
            zh_CN: "嵌入块样式",
            en_US: "embedded block style",
        },
        emdesc: {
            zh_CN: "限制嵌入块高度",
            en_US: "Limit the height of embedded block",
        },
        tititem: {
            zh_CN: "标题块样式",
            en_US: "Heading block style",
        },
        titleShadow: {
            zh_CN: "标题添加阴影",
            en_US: "Heading add shadow",
        },
        titleShadowDesc: {
            zh_CN: "仅启用标题样式有效",
            en_US: "Only effective when enable heading style",
        },
        titleIcon: {
            zh_CN: "标题前添加图标",
            en_US: "Add icon before title",
        },
        titleIconDesc: {
            zh_CN: "仅启用标题样式有效",
            en_US: "Only effective when enable heading style",
        },
        dbitem: {
            zh_CN: "数据库样式",
            en_US: "database style",
        },
        markitem: {
            zh_CN: "高亮标注样式",
            en_US: "highlight mark style",
        },
        scitem: {
            zh_CN: "快捷键面板样式",
            en_US: "Shortcut key panel style",
        },
        ftitem: {
            zh_CN: "文档树和大纲样式",
            en_US: "Doc tree and Outline style",
        },
        bgdesktop: {
            zh_CN: "在电脑端启用“替换背景图片”插件",
            en_US: 'Enable plugin "Background cover adaption" on desktop',
        },
        bgdesc: {
            zh_CN: "需要打开“替换背景图片”插件设置将“前景透明”调到0哦!建议启用插件的“背景虚化”功能!",
            en_US: 'You need to open the setting of "Background Cover" plugin and set the "Opacity of foreground" to 0!Suggest turn on the "Blurring" setting of the plugin!',
        },
        bgmobile: {
            zh_CN: "在移动端启用“替换背景图片”插件",
            en_US: 'Enable plguin "Background cover adaption" on mobile',
        },
        mathitem: {
            zh_CN: "数学增强插件调整",
            en_US: "Math enhance plugin adjustion",
        },
        mathdesc: {
            zh_CN: "调整插件默认宽度，无法显示水平滚动条",
            en_US: "Adjust the default width of the plugin, can't show horizon scroll bar",
        },
        doubleTabbaritem: {
            zh_CN: "（实验性）启用双标签栏",
            en_US: "(Expermental) Enable double tab bar",
        },
        doubleTabbardesc: {
            zh_CN: "将钉住的标签移动到新标签栏（有缺陷！）",
            en_US: "Move pinned tab to new tab bar(WITH BUGS!)",
        },
        doubleTabbarMessage: {
            zh_CN: "VSCE:点击暂时不能改变标签页，请手动点击原标签页",
            en_US: "VSCE:Can't change tab while clicking now, click original tab manually please",
        },
        tagitem: {
            zh_CN: "块内标签样式",
            en_US: "The style of tags",
        },
        tagdesc: {
            zh_CN: "块内标签样式跟随文档标签样式",
            en_US: "The style of tags in block uses the style of tags of document",
        },
        slashMenuitem: {
            zh_CN: "斜杠(/)菜单多栏显示",
            en_US: "Slash(/) menu multi column display",
        },
    };

    // 浏览器获取的默认语言
    let currentLang = document.documentElement.lang as Config.TLang;

    // 将 currentLang 转换为 SupportedLang 类型
    let supportedLang: SupportedLang;

    // 类型守卫：检查一个字符串是否是 SupportedLang
    function isSupportedLang(lang: string): lang is SupportedLang {
        return lang === "zh_CN" || lang === "en_US";
    }

    if (isSupportedLang(currentLang)) {
        // 如果已经是支持的语言，直接使用
        supportedLang = currentLang;
    } else if (currentLang === "zh_CHT") {
        // 繁体中文回退到简体中文
        supportedLang = "zh_CN";
    } else {
        // 其他语言回退到英文
        supportedLang = "en_US";
    }

    // 检查该语言是否在 language 对象中标记为可用
    if (globalThis.vscMessage.language[supportedLang] != undefined) {
        globalThis.vscLang = supportedLang;
    } else {
        // 如果标记为不可用，使用 en_US 作为回退
        globalThis.vscLang = "en_US";
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
        // 背景插件观察器
        bgObserver: null,
        // 背景存在观察器
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
