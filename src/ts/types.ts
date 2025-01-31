declare global {
    interface Window {
        destroyTheme?: () => Promise<void>;
    }

    // 全局变量类型定义
    var defaultConf: ThemeConfig;
    var localMessage: LocalMessage;
    var defLag: 'zh_CN' | 'en_US';
    var timer: Timers;
    var observer: Observers;
}

// 主题配置接口
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
    };
}

// 本地化消息接口
export interface LocalMessage {
    language: Record<string, boolean>;
    loadCssFail: Record<string, string>;
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
    dbitem: Record<string, string>;
    markitem: Record<string, string>;
    scitem: Record<string, string>;
    ftitem: Record<string, string>;
    bgdesktop: Record<string, string>;
    bgdesc: Record<string, string>;
    bgmobile: Record<string, string>;
    mathitem: Record<string, string>;
    mathdesc: Record<string, string>;
}

// 计时器接口
export interface Timers {
    bgTimer: number | null;
    bgObserTimer: number | null;
}

// 观察器接口
export interface Observers {
    bgObserver: MutationObserver | null;
}

/**
 * The language used by the current user
 *
 * User interface language
 * Same as {@link IAppearance.lang}
 * @see https://github.com/siyuan-note/siyuan/blob/master/app/src/types/config.d.ts#L265-L283
 */
export type TLang =
    "en_US"
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

export { };