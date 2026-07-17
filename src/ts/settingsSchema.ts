import type { vscMessage } from "./types";

/**
 * 设置项所属分组
 * - `theme`：思源内置功能的外观调整
 * - `plugins`：特定插件的外观适配
 * @since 3.0.7
 * @version 3.0.7
 */
export type SettingGroup = "theme" | "plugins";

/**
 * 单个设置项的声明式定义
 * @since 3.0.7
 * @version 3.0.7
 */
export interface SettingSchemaEntry {
    /** 配置键，必须与 ThemeConfig.theme / ThemeConfig.plugins 的字段名一致 */
    key: string;
    /** 分组，直接决定渲染到哪个标签页 */
    group: SettingGroup;
    /** 默认值 */
    default: boolean;
    /** 标题文案的 i18n key（对应 vscMessage 中的键） */
    label: Exclude<keyof vscMessage, "language">;
    /** 描述文案的 i18n key（可选） */
    desc?: Exclude<keyof vscMessage, "language">;
}

/**
 * ! 设置项唯一数据源（Single Source of Truth）
 *
 * 新增设置只需在此追加一项；默认配置、设置面板渲染、分组、保存与校验
 * 全部由本数组推导，无需再手动修改 defs.ts / setting.ts 中的多处样板。
 * `as const satisfies` 保留每个 key 的字面量类型（用于编辑器补全与类型安全），
 * 同时约束每项结构符合 SettingSchemaEntry。
 * @since 3.0.7
 * @version 3.0.7
 */
export const settingsSchema = [
    // 标题样式
    { key: "title", group: "theme", default: true, label: "tititem" },
    // 标题阴影样式
    { key: "titleShadow", group: "theme", default: true, label: "titleShadow", desc: "titleShadowDesc" },
    // 标题图标
    { key: "titleIcon", group: "theme", default: true, label: "titleIcon", desc: "titleIconDesc" },
    // 文档树和大纲
    { key: "doctree", group: "theme", default: true, label: "ftitem" },
    // 代码块
    { key: "codeBlock", group: "theme", default: true, label: "cbitem" },
    // 引用
    { key: "reference", group: "theme", default: true, label: "refitem" },
    // 高亮标记
    { key: "mark", group: "theme", default: true, label: "markitem" },
    // 段落内标签
    { key: "tag", group: "theme", default: true, label: "tagitem", desc: "tagdesc" },
    // 集市
    { key: "bazaar", group: "theme", default: true, label: "bazitem" },
    // 嵌入块
    { key: "embeddedBlock", group: "theme", default: true, label: "emitem", desc: "emdesc" },
    // 数据库
    { key: "database", group: "theme", default: true, label: "dbitem" },
    // 多栏斜杠菜单
    { key: "slashMenu", group: "theme", default: false, label: "slashMenuitem" },

    // 快捷键面板
    { key: "shortcutPanel", group: "plugins", default: true, label: "scitem" },
    // 电脑端背景图片
    { key: "backgroundCoverDesktop", group: "plugins", default: true, label: "bgdesktop", desc: "bgdesc" },
    // 移动端背景图片
    { key: "backgroundCoverMobile", group: "plugins", default: false, label: "bgmobile", desc: "bgdesc" },
    // 数学增强
    { key: "mathPanel", group: "plugins", default: false, label: "mathitem", desc: "mathdesc" },
    // 双标签页
    { key: "doubleTabbar", group: "plugins", default: false, label: "doubleTabbaritem", desc: "doubleTabbardesc" },
    // 打字机模式
    { key: "typewriter", group: "plugins", default: false, label: "typewriteritem", desc: "typewriterdesc" },
    // 点击标题或图标展开收起文档树
    {
        key: "filetreeExpand",
        group: "plugins",
        default: false,
        label: "filetreeExpanditem",
        desc: "filetreeExpanddesc",
    },
] as const satisfies readonly SettingSchemaEntry[];

/**
 * 由 schema 自动推导的“所有设置键”字面量联合类型。
 * 用于编辑器补全与类型安全，替代原先手写在 ThemeConfig 中的键名联合。
 * @since 3.0.7
 * @version 3.0.7
 */
export type SettingKey = (typeof settingsSchema)[number]["key"];

/**
 * 由 schema 推导的“带字面量的单条设置项”类型（group 与 key 在元组内绑定）。
 * 可用于更严格的关联访问（如 config[s.group][s.key] 的收窄）。
 * @since 3.0.7
 * @version 3.0.7
 */
export type SettingEntry = (typeof settingsSchema)[number];
