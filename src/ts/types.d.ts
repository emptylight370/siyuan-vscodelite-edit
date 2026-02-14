/** 主题配置接口 */
export interface ThemeConfig {
    /** 配置文件版本号 */
    version: number;
    /** 上次使用的主题版本号 */
    lastSeen: string;
    /** 思源相关配置项 */
    theme: {
        /** 代码块 */
        codeBlock: boolean;
        /** 引用 */
        reference: boolean;
        /** 集市 */
        bazaar: boolean;
        /** 嵌入块 */
        embeddedBlock: boolean;
        /** 标题样式 */
        title: boolean;
        /** 标题阴影样式 */
        titleShadow: boolean;
        /** 标题图标 */
        titleIcon: boolean;
        /** 数据库 */
        database: boolean;
        /** 文档树和大纲 */
        doctree: boolean;
        /** 高亮标记 */
        mark: boolean;
        /** 段落内标签 */
        tag: boolean;
        /** 多栏斜杠菜单 */
        slashMenu: boolean;
    };
    /** 插件相关配置项 */
    plugins: {
        /** 快捷键面板 */
        shortcutPanel: boolean;
        /** 数学增强 */
        mathPanel: boolean;
        /** 电脑端背景图片 */
        backgroundCoverDesktop: boolean;
        /** 移动端背景图片 */
        backgroundCoverMobile: boolean;
        /** 双标签页 */
        doubleTabbar: boolean;
    };
}

/** 本地化消息接口 */
export interface vscMessage {
    // * 定义某种语言是否存在
    /** 检查存在的语言 */
    language: Record<string, boolean>;

    // * 主题发送的提示或者通知文本
    /** 配置文件修改未保存 */
    confNotSave: Record<string, string>;
    /** 配置文件修改保存 */
    confSave: Record<string, string>;
    /** 配置文件需要更新 */
    confUpdate: Record<string, string>;
    /** 双标签栏提示信息 */
    doubleTabbarMessage: Record<string, string>;
    /** 加载配置失败 */
    loadConfigFail: Record<string, string>;
    /** 加载CSS失败 */
    loadCssFail: Record<string, string>;
    /** 主题加载完成 */
    loadFinish: Record<string, string>;
    /** 写入PDF适配文件失败 */
    loadPDFPersetFail: Record<string, string>;
    /** 主题版本更新提示 */
    newVersionHint: Record<string, string>;

    // * 设置按钮提示文本
    /** 主题设置按钮提示文本 */
    settingButtonAria: Record<string, string>;

    // * 设置面板的主要文本
    /** 设置面板不保存按钮文本 */
    nSave: Record<string, string>;
    /** 鼠标进入刷新按钮提示文本 */
    oReload: Record<string, string>;
    /** 鼠标进入新版本更新按钮提示文本 */
    oUpdate: Record<string, string>;
    /** 设置面板保存按钮文本 */
    saveReload: Record<string, string>;
    /** 设置面板标题 */
    settingPanelTitle: Record<string, string>;
    /** 设置面板插件页签 */
    settingTabPlugin: Record<string, string>;
    /** 设置面板思源页签 */
    settingTabSiYuan: Record<string, string>;
    /** 鼠标进入插件页签显示提示 */
    tabTipPlugin: Record<string, string>;
    /** 鼠标进入思源页签显示提示 */
    tabTipSiYuan: Record<string, string>;
    /** 鼠标进入保存按钮提示文本 */
    tipSave: Record<string, string>;
    /** 鼠标进入设置项提示文本 */
    tipSwitch: Record<string, string>;

    // * 设置面板选项文本和提示文本
    /** 集市样式选项 */
    bazitem: Record<string, string>;
    /** 背景插件描述文本 */
    bgdesc: Record<string, string>;
    /** 桌面端背景插件选项 */
    bgdesktop: Record<string, string>;
    /** 移动端背景插件选项 */
    bgmobile: Record<string, string>;
    /** 代码块样式选项 */
    cbitem: Record<string, string>;
    /** 数据库样式选项 */
    dbitem: Record<string, string>;
    /** 双标签栏描述文本 */
    doubleTabbardesc: Record<string, string>;
    /** 双标签栏选项 */
    doubleTabbaritem: Record<string, string>;
    /** 嵌入块样式描述文本 */
    emdesc: Record<string, string>;
    /** 嵌入块样式选项 */
    emitem: Record<string, string>;
    /** 文档树大纲样式选项 */
    ftitem: Record<string, string>;
    /** 高亮标注选项 */
    markitem: Record<string, string>;
    /** 数学增强插件描述文本 */
    mathdesc: Record<string, string>;
    /** 数学增强插件选项 */
    mathitem: Record<string, string>;
    /** 引用标签样式选项 */
    refitem: Record<string, string>;
    /** 快捷键面板插件选项 */
    scitem: Record<string, string>;
    /** 段落内标签描述文本 */
    tagdesc: Record<string, string>;
    /** 段落内标签选项 */
    tagitem: Record<string, string>;
    /** 标题块样式选项 */
    tititem: Record<string, string>;
    /** 标题块阴影选项 */
    titleShadow: Record<string, string>;
    /** 标题块阴影描述文本 */
    titleShadowDesc: Record<string, string>;
    /** 标题块图标选项 */
    titleIcon: Record<string, string>;
    /** 标题块图标描述文本 */
    titleIconDesc: Record<string, string>;
    /** 多栏斜杠菜单选项 */
    slashMenuitem: Record<string, string>;
}

/** 计时器接口 */
export interface vscTimers {
    /** 背景插件状态刷新计时器 */
    bgTimer: number | null;
    /** 背景插件属性修改计时器 */
    bgObserTimer: number | null;
    /** 在移动端添加设置按钮的计时器 */
    settingMobileTimer: number | null;
    /** 检查斜杠菜单数量的计时器 */
    slashMenuTimer: number | null;
}

/** 观察器接口 */
export interface vscObservers {
    /** 背景图插件状态观察器 */
    bgObserver: MutationObserver | null;
    /** 背景图存在状态观察器 */
    bgExistObserver: MutationObserver | null;
    /** 标签栏状态观察器 */
    tabbarObserver: MutationObserver | null;
    /** 斜杠菜单显示状态观察器 */
    slashDisplayObserver: MutationObserver | null;
}

/** 计数器接口 */
export interface vscCounters {
    /** 斜杠菜单的数量计数器 */
    slashMenuCount: number;
}

/** 在显示设置面板时向数组中传入的元素格式 */
export interface SettingItem {
    /** 显示文字 */
    label: string;
    /** 设置项id，注意分别对应 */
    id: SettingPanelId;
    /** 设置项的描述，可选 */
    description?: string;
    /** 当前是否启用，也是开关的默认状态 */
    enable: boolean;
}

/** 主题设置键 */
type ThemeSettingKey = keyof ThemeConfig["theme"];

/** 插件设置键 */
type PluginSettingKey = keyof ThemeConfig["plugins"];

/**
 * 设置面板中使用的ID类型
 */
export type SettingPanelId = ThemeSettingKey | PluginSettingKey;

declare global {
    interface Window {
        /** 主题移除时由思源触发 */
        destroyTheme?: () => Promise<void>;

        /** 思源的配置项 */
        siyuan: {
            config: {
                api: {
                    // 设置中的token
                    token: string;
                };
                // 和<html>中的lang一样
                lang: string;
            };
            // 是否是发布模式
            isPublish: boolean;
        };
    }

    // 主题代码中添加的全局变量
    /** 默认配置文件 */
    var vscDefaultConf: Readonly<ThemeConfig>;
    /** 本地化提示信息 */
    var vscMessage: Readonly<vscMessage>;
    /** 默认语言，可由浏览器方法获取 */
    var vscLang: keyof vscMessage["language"];
    /** 目前所有的计时器 */
    var vscTimers: vscTimers;
    /** 目前所有的观察器 */
    var vscObservers: vscObservers;
    /** 目前所有的计数器 */
    var vscCounters: vscCounters;
}
