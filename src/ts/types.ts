import { ThemeConfig, LocalMessage, SettingKeyMap, vscObservers, vscTimers, EnableSettingsKeyMap } from "./types.d";

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
        };
    }

    // 主题代码中添加的全局变量
    /** 默认配置文件 */
    var defaultConf: ThemeConfig;
    /** 本地化提示信息 */
    var localMessage: LocalMessage;
    /** 默认语言，可由浏览器方法获取 */
    var defLag: "zh_CN" | "en_US";
    /** 目前所有的计时器 */
    var vscTimer: vscTimers;
    /** 目前所有的观察器 */
    var vscObserver: vscObservers;
}

/**
 * 具体设置项映射，由设置面板中的id映射到配置文件中
 * 设置面板配置项id：配置项范围，配置项键名
 */
export const settingKeyMap: SettingKeyMap = {
    codeBlock: { section: "theme", key: "codeBlock" }, // 代码块样式
    referenceBlock: { section: "theme", key: "reference" }, // 引用块样式
    bazaarStyle: { section: "theme", key: "bazaar" }, // 集市样式
    titleBlock: { section: "theme", key: "title" }, // 标题块样式
    embeddedBlock: { section: "theme", key: "embeddedBlock" }, // 嵌入块样式
    titleShadow: { section: "theme", key: "titleShadow" }, // 标题阴影
    titleIcon: { section: "theme", key: "titleIcon" }, // 标题图标
    database: { section: "theme", key: "database" }, // 数据库
    doctree: { section: "theme", key: "doctree" }, // 文档树
    mark: { section: "theme", key: "mark" }, // 标记
    tagStyle: { section: "theme", key: "tag" }, // 标签
    scPanelStyle: { section: "plugins", key: "shortcutPanel" }, // 快捷键面板
    mathPanel: { section: "plugins", key: "mathPanel" }, // 数学面板
    backgroundCoverDesktop: { section: "plugins", key: "backgroundCoverDesktop" }, // 桌面端图片背景
    backgroundCoverMobile: { section: "plugins", key: "backgroundCoverMobile" }, // 移动端图片背景
    doubleTabbar: { section: "plugins", key: "doubleTabbar" }, // 双标签栏
} as const;

/**
 * 具体设置项映射，由配置文件中启用项映射到配置文件中
 * 配置文件启用项：设置项所属范围，设置项键名
 * 这个是列表里面的元素名
 */
export const enableSettingsKeyMap: EnableSettingsKeyMap = {
    codeBlock: { section: "theme", key: "codeBlock" }, // 代码块样式
    reference: { section: "theme", key: "reference" }, // 引用块样式
    bazaar: { section: "theme", key: "bazaar" }, // 集市样式
    title: { section: "theme", key: "title" }, // 标题块样式
    embeddedBlock: { section: "theme", key: "embeddedBlock" }, // 嵌入块样式
    titleShadow: { section: "theme", key: "titleShadow" }, // 标题阴影
    titleIcon: { section: "theme", key: "titleIcon" }, // 标题图标
    database: { section: "theme", key: "database" }, // 数据库
    doctree: { section: "theme", key: "doctree" }, // 文档树
    mark: { section: "theme", key: "mark" }, // 标记
    tag: { section: "theme", key: "tag" }, // 标签
    shortcutPanel: { section: "plugins", key: "shortcutPanel" }, // 快捷键面板
    mathPanel: { section: "plugins", key: "mathPanel" }, // 数学面板
    backgroundCoverDesktop: { section: "plugins", key: "backgroundCoverDesktop" }, // 桌面端图片背景
    backgroundCoverMobile: { section: "plugins", key: "backgroundCoverMobile" }, // 移动端图片背景
    doubleTabbar: { section: "plugins", key: "doubleTabbar" }, // 双标签栏
} as const;

// 声明文件作为模块
export {};
