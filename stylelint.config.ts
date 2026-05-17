import { Config } from "stylelint";

export default {
    extends: ["stylelint-config-standard-scss"],
    rules: {
        // 允许 BEM 命名：block__element--modifier
        "selector-class-pattern": null,
        // 允许 kebab-case 等格式
        "selector-id-pattern": null,
        // 允许自定义属性名格式
        "custom-property-pattern": null,
        // 允许 SCSS 变量名使用其他格式
        "scss/dollar-variable-pattern": null,
        // 允许注释前无空行
        "comment-empty-line-before": null,
        // 允许声明前无空行
        "declaration-empty-line-before": null,
        // 允许自定义属性前有空行
        "custom-property-empty-line-before": null,
        // 允许 SCSS 双斜杠注释前无空行
        "scss/double-slash-comment-empty-line-before": null,
        // 允许 rgb() 使用逗号分隔（兼容 SCSS）
        "color-function-notation": null,
        // 允许 mixin 名称使用其他格式
        "scss/at-mixin-pattern": null,
        // 允许 at-rule 前无空行
        "at-rule-empty-line-before": null,
        // TODO: WebView 95 不支持 media-feature-range-notation 的 ">= 768px" 语法
        // 最低需要 Chrome 104 (2022-07)，可在此版本稳定后移除
        "media-feature-range-notation": null,
        // 允许 url() 不加引号
        "function-url-quotes": null,
    },
} satisfies Config;
