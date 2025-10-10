import { TLang } from "./types.d";

/**
 * 加载全局变量
 */
export async function loadGlobalVars() {
    /**
     * ! 默认配置文件
     */
    globalThis.defaultConf = {
        version: 12,
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
     */
    globalThis.localMessage = {
        language: {
            zh_CN: true,
            en_US: true,
        },
        loadCssFail: {
            zh_CN: "加载主题VSCode Lite Edit失败，无法获取当前样式表",
            en_US: "Load theme VSCode Lite Edit failed, can't load current style table",
        },
        loadVariableFail: {
            zh_CN: "加载主题VSCode Lite Edit失败，无法加载变量",
            en_US: "Load theme VSCode Lite Edit failed, can't load variables",
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
    };

    // 浏览器获取的默认语言
    var currentLang = document.documentElement.lang as TLang;
    if (localMessage.language[currentLang] != undefined) {
        // @ts-ignore
        globalThis.defLag = currentLang;
    } else {
        if (currentLang == "zh_CHT") {
            globalThis.defLag = "zh_CN";
        } else {
            globalThis.defLag = "en_US";
        }
    }

    // ! 所有用到的计时器
    globalThis.vscTimer = {
        // 背景插件加载后可能禁用，使用计时器定时刷新背景插件状态
        bgTimer: null,
        // 背景插件属性修改的监听器，用来监测背景状态变化
        bgObserTimer: null,
        // 在移动端添加设置按钮的计时器，在初次添加失败后会每秒尝试一次
        settingMobile: null,
    };

    // ! 所有用到的监听器
    globalThis.vscObserver = {
        // 背景插件观察器
        bgObserver: null,
        // 标签栏状态观察器
        tabbarObserver: null,
    };
}
