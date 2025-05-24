declare global {
    interface Window {
        /** 主题移除时由思源触发 */
        destroyTheme?: () => Promise<void>;
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

/** 主题配置接口 */
export interface ThemeConfig {
    version: number;
    theme: {
        codeBlock: boolean;
        reference: boolean;
        bazaar: boolean;
        embeddedBlock: boolean;
        title: boolean;
        titleShadow: boolean;
        titleIcon: boolean;
        database: boolean;
        doctree: boolean;
        mark: boolean;
    };
    plugins: {
        shortcutPanel: boolean;
        mathPanel: boolean;
        backgroundCoverDesktop: boolean;
        backgroundCoverMobile: boolean;
        doubleTabbar: boolean;
    };
}

/** 本地化消息接口 */
export interface LocalMessage {
    language: Record<string, boolean>;
    loadCssFail: Record<string, string>;
    loadVariableFail: Record<string, string>;
    loadConfigFail: Record<string, string>;
    loadPDFPersetFail: Record<string, string>;
    loadFinish: Record<string, string>;
    confUpdate: Record<string, string>;
    confNotSave: Record<string, string>;
    confSave: Record<string, string>;
    "label-aria": Record<string, string>;
    settingPanelTitle: Record<string, string>;
    saveReload: Record<string, string>;
    nSave: Record<string, string>;
    oReload: Record<string, string>;
    tip1: Record<string, string>;
    tip2: Record<string, string>;
    tip3: Record<string, string>;
    cbitem: Record<string, string>;
    refitem: Record<string, string>;
    bazitem: Record<string, string>;
    emitem: Record<string, string>;
    emdesc: Record<string, string>;
    tititem: Record<string, string>;
    titleShadow: Record<string, string>;
    titleShadowDesc: Record<string, string>;
    titleIcon: Record<string, string>;
    titleIconDesc: Record<string, string>;
    dbitem: Record<string, string>;
    markitem: Record<string, string>;
    scitem: Record<string, string>;
    ftitem: Record<string, string>;
    bgdesktop: Record<string, string>;
    bgdesc: Record<string, string>;
    bgmobile: Record<string, string>;
    mathitem: Record<string, string>;
    mathdesc: Record<string, string>;
    doubleTabbaritem: Record<string, string>;
    doubleTabbardesc: Record<string, string>;
    doubleTabbarMessage: Record<string, string>;
}

/** 计时器接口 */
export interface vscTimers {
    bgTimer: number | null; // 背景插件状态刷新计时器
    bgObserTimer: number | null; // 背景插件属性修改计时器
}

/** 观察器接口 */
export interface vscObservers {
    bgObserver: MutationObserver | null; // 背景图插件状态观察器
    tabbarObserver: MutationObserver | null; // 标签栏状态观察器
}

/**
 * 用户当前使用的语言
 *
 * 用户界面语言
 * 与{@link IAppearance.lang}相同
 * @see https://github.com/siyuan-note/siyuan/blob/master/app/src/types/config.d.ts#L265-L283
 */
export type TLang =
    | "en_US"
    | "es_ES"
    | "fr_FR"
    | "zh_CHT"
    | "zh_CN"
    | "ja_JP"
    | "it_IT"
    | "de_DE"
    | "he_IL"
    | "ru_RU"
    | "pl_PL"
    | "ar_SA";

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

/** 设置面板ID到配置文件的映射 */
interface SettingKeyMap {
    [K: string]:
        | {
              section: "theme";
              key: ThemeSettingKey;
          }
        | {
              section: "plugins";
              key: PluginSettingKey;
          };
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
    scPanelStyle: { section: "plugins", key: "shortcutPanel" }, // 快捷键面板
    mathPanel: { section: "plugins", key: "mathPanel" }, // 数学面板
    backgroundCoverDesktop: { section: "plugins", key: "backgroundCoverDesktop" }, // 桌面端图片背景
    backgroundCoverMobile: { section: "plugins", key: "backgroundCoverMobile" }, // 移动端图片背景
    doubleTabbar: { section: "plugins", key: "doubleTabbar" }, // 双标签栏
} as const;

/** 设置面板中使用的ID类型 */
export type SettingPanelId = keyof SettingKeyMap;

/** 配置文件中启用项到配置文件的映射 */
interface EnableSettingsKeyMap {
    [K: string]:
        | {
              section: "theme";
              key: ThemeSettingKey;
          }
        | {
              section: "plugins";
              key: PluginSettingKey;
          };
}

/**
 * 具体设置项映射，由配置文件中启用项映射到配置文件中
 * 配置文件启用项：设置项所属范围，设置项键名
 * 这个是列表里面的元素名
 */
export const EnableSettingsKeyMap: SettingKeyMap = {
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
    shortcutPanel: { section: "plugins", key: "shortcutPanel" }, // 快捷键面板
    mathPanel: { section: "plugins", key: "mathPanel" }, // 数学面板
    backgroundCoverDesktop: { section: "plugins", key: "backgroundCoverDesktop" }, // 桌面端图片背景
    backgroundCoverMobile: { section: "plugins", key: "backgroundCoverMobile" }, // 移动端图片背景
    doubleTabbar: { section: "plugins", key: "doubleTabbar" }, // 双标签栏
} as const;

/** 配置文件中启用项类型 */
export type EnableSettings = keyof EnableSettingsKeyMap;

// 声明文件作为模块
export {};
