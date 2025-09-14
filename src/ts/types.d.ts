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
        tag: boolean;
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
    settingButtonAria: Record<string, string>;
    settingPanelTitle: Record<string, string>;
    settingTabSiYuan: Record<string, string>;
    settingTabPlugin: Record<string, string>;
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
    tagitem: Record<string, string>;
    tagdesc: Record<string, string>;
}

/** 计时器接口 */
export interface vscTimers {
    bgTimer: number | null; // 背景插件状态刷新计时器
    bgObserTimer: number | null; // 背景插件属性修改计时器
    settingMobile: number | null; //在移动端添加设置按钮的计时器
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
 * @see https://github.com/siyuan-note/siyuan/blob/master/app/src/types/config.d.ts#L265-L284
 */
export type TLang =
    | "en_US"
    | "ar_SA"
    | "de_DE"
    | "es_ES"
    | "fr_FR"
    | "he_IL"
    | "it_IT"
    | "ja_JP"
    | "pl_PL"
    | "pt_BR"
    | "ru_RU"
    | "zh_CN"
    | "zh_CHT";

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

/** 配置文件中启用项类型 */
export type EnableSettings = keyof EnableSettingsKeyMap;
