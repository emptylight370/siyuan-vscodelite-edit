import { Config } from "siyuan/types/Config";
import type { SettingGroup, SettingKey } from "./settingsSchema";

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
        /** 打字机模式 */
        typewriter: boolean;
        /** 点击标题或图标展开收起文档树 */
        filetreeExpand: boolean;
    };
}

/** 支持的语言类型（RFC 5646 简化格式） */
export type SupportedLang = "zh-CN" | "en";

/** 本地化消息文本接口 */
export type LocalizedMessage = Record<SupportedLang, string>;

/** 本地化消息接口 */
export interface vscMessage {
    // * 定义某种语言是否存在
    /** 检查存在的语言 */
    language: Record<SupportedLang, boolean>;

    // * 主题发送的提示或者通知文本
    /** 配置文件修改未保存 */
    confNotSave: LocalizedMessage;
    /** 配置文件修改保存 */
    confSave: LocalizedMessage;
    /** 配置文件需要更新 */
    confUpdate: LocalizedMessage;
    /** 双标签栏提示信息 */
    doubleTabbarMessage: LocalizedMessage;
    /** 加载配置失败 */
    loadConfigFail: LocalizedMessage;
    /** 加载CSS失败 */
    loadCssFail: LocalizedMessage;
    /** 主题加载完成 */
    loadFinish: LocalizedMessage;
    /** 写入PDF适配文件失败 */
    loadPDFPersetFail: LocalizedMessage;
    /** 主题版本更新提示 */
    newVersionHint: LocalizedMessage;
    /** 打字机模式启动 */
    typewriterON: LocalizedMessage;
    /** 打字机模式关闭 */
    typewriterOFF: LocalizedMessage;

    // * 设置按钮提示文本
    /** 主题设置按钮提示文本 */
    settingButtonAria: LocalizedMessage;

    // * 设置面板的主要文本
    /** 设置面板不保存按钮文本 */
    nSave: LocalizedMessage;
    /** 鼠标进入刷新按钮提示文本 */
    oReload: LocalizedMessage;
    /** 鼠标进入新版本更新按钮提示文本 */
    oUpdate: LocalizedMessage;
    /** 鼠标进入打开集市按钮提示文本 */
    oBazaar: LocalizedMessage;
    /** 设置面板保存按钮文本 */
    saveReload: LocalizedMessage;
    /** 设置面板标题 */
    settingPanelTitle: LocalizedMessage;
    /** 设置面板插件页签 */
    settingTabPlugin: LocalizedMessage;
    /** 设置面板思源页签 */
    settingTabSiYuan: LocalizedMessage;
    /** 鼠标进入插件页签显示提示 */
    tabTipPlugin: LocalizedMessage;
    /** 鼠标进入思源页签显示提示 */
    tabTipSiYuan: LocalizedMessage;
    /** 鼠标进入保存按钮提示文本 */
    tipSave: LocalizedMessage;
    /** 鼠标进入设置项提示文本 */
    tipSwitch: LocalizedMessage;

    // * 设置面板选项文本和提示文本
    /** 集市样式选项 */
    bazitem: LocalizedMessage;
    /** 背景插件描述文本 */
    bgdesc: LocalizedMessage;
    /** 桌面端背景插件选项 */
    bgdesktop: LocalizedMessage;
    /** 移动端背景插件选项 */
    bgmobile: LocalizedMessage;
    /** 代码块样式选项 */
    cbitem: LocalizedMessage;
    /** 数据库样式选项 */
    dbitem: LocalizedMessage;
    /** 双标签栏描述文本 */
    doubleTabbardesc: LocalizedMessage;
    /** 双标签栏选项 */
    doubleTabbaritem: LocalizedMessage;
    /** 嵌入块样式描述文本 */
    emdesc: LocalizedMessage;
    /** 嵌入块样式选项 */
    emitem: LocalizedMessage;
    /** 文档树大纲样式选项 */
    ftitem: LocalizedMessage;
    /** 高亮标注选项 */
    markitem: LocalizedMessage;
    /** 数学增强插件描述文本 */
    mathdesc: LocalizedMessage;
    /** 数学增强插件选项 */
    mathitem: LocalizedMessage;
    /** 引用标签样式选项 */
    refitem: LocalizedMessage;
    /** 快捷键面板插件选项 */
    scitem: LocalizedMessage;
    /** 段落内标签描述文本 */
    tagdesc: LocalizedMessage;
    /** 段落内标签选项 */
    tagitem: LocalizedMessage;
    /** 标题块样式选项 */
    tititem: LocalizedMessage;
    /** 标题块阴影选项 */
    titleShadow: LocalizedMessage;
    /** 标题块阴影描述文本 */
    titleShadowDesc: LocalizedMessage;
    /** 标题块图标选项 */
    titleIcon: LocalizedMessage;
    /** 标题块图标描述文本 */
    titleIconDesc: LocalizedMessage;
    /** 多栏斜杠菜单选项 */
    slashMenuitem: LocalizedMessage;
    /** 打字机模式选项 */
    typewriteritem: LocalizedMessage;
    /** 打字机模式描述 */
    typewriterdesc: LocalizedMessage;
    /** 点击标题或图表展开收起文档树选项 */
    filetreeExpanditem: LocalizedMessage;
    /** 点击标题或图表展开收起文档树描述 */
    filetreeExpanddesc: LocalizedMessage;
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
    /** 背景图插件显示状态观察器 */
    bgObserver: MutationObserver | null;
    /** 背景图插件启用状态观察器 */
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
    /** 所属分组，直接决定渲染到哪个标签页 */
    group: SettingGroup;
    /** 设置项的描述，可选 */
    description?: string;
    /** 当前是否启用，也是开关的默认状态 */
    enable: boolean;
}

/**
 * 设置面板中使用的ID类型。
 * 直接由 settingsSchema 推导（字面量联合），作为编辑器补全与类型安全的唯一来源。
 */
export type SettingPanelId = SettingKey;

declare global {
    interface Window {
        /** 主题移除时由思源触发 */
        destroyTheme?: () => void;

        /** 思源的配置项 */
        siyuan: {
            config: {
                api: {
                    // 设置中的token
                    token: string;
                };
                appearance: Config.IAppearance;
                // 和<html>中的lang一样
                lang: Config.TLang;
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
    /** 主题默认语言 */
    var vscLang: SupportedLang;
    /** 目前所有的计时器 */
    var vscTimers: vscTimers;
    /** 目前所有的观察器 */
    var vscObservers: vscObservers;
    /** 目前所有的计数器 */
    var vscCounters: vscCounters;
    /** 打字机模式的 AbortController，跨模块重载持久化 */
    var vscTypewriterAbort: AbortController | null;
}
