/**
 * 静态检测主题中可能已失效的选择器（类名）。
 *
 * 原理：提取 theme.css 与 sub/*.css 中的所有类名，在思源源码
 * （app/src 的 ts/js/scss）中做全文子串搜索，搜不到的类名即「疑似死选择器」。
 * 只扫源码不扫构建产物：源码始终是最新的，而本地构建产物可能缺失或过期。
 *
 * 可直接运行：node scripts/check-selectors.ts [思源仓库路径]
 * 结果写入 check-selectors-report.json，并在控制台输出摘要。
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const THEME_ROOT: string = fileURLToPath(new URL("..", import.meta.url));
const SIYUAN_ROOT: string = process.argv[2] ?? undefined;

if (!SIYUAN_ROOT) {
    console.error("请提供思源仓库路径");
    process.exit(1);
}

/**
 * 忽略的类名（主题自身注入 / 已知不属于思源 DOM 的）。
 * 注意：仅扫 app/src 时，运行时动态生成的类名会误报，已列入下方白名单：
 * - viewer-*：思源内置 viewerjs（SCSS 用 &- 嵌套书写，无完整字面量）
 * - protyle-action--first：由 lute 渲染引擎动态生成（仅存在于 lute.min.js）
 * - keymap 插件相关：第三方插件的 DOM 类名，不在思源仓库中，无法静态验证
 */
const IGNORE_PREFIXES: RegExp[] = [
    /^vsc/i,
    /^bgenable$/i,
    /^ThemeSettingPage$/,
    /^viewer-(backdrop|fixed)$/,
    /^protyle-action--first$/,
    /^keymap-plugin-(container|header|header-2|item)$/,
    /^repeated-key$/,
];

/** 主题侧要扫描的 CSS 文件 */
function collectCssFiles(): string[] {
    const files: string[] = [join(THEME_ROOT, "theme.css")];
    const walk = (dir: string): void => {
        for (const entry of readdirSync(dir, { withFileTypes: true })) {
            const p = join(dir, entry.name);
            if (entry.isDirectory()) walk(p);
            else if (extname(entry.name) === ".css") files.push(p);
        }
    };
    walk(join(THEME_ROOT, "sub"));
    return files;
}

/** 从 CSS 文本提取类名（去掉注释与字符串后按 .xxx 抓取） */
function extractClassNames(css: string): Set<string> {
    const text = css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, "");
    const names = new Set<string>();
    const re = /\.([A-Za-z_][-\w]*)/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) names.add(m[1]);
    return names;
}

/** 收集思源源码语料文件路径（仅 app/src，不含构建产物） */
function collectCorpusFiles(root: string): string[] {
    const files: string[] = [];
    const exts = new Set([".js", ".ts", ".scss"]);
    const walk = (dir: string): void => {
        for (const entry of readdirSync(dir, { withFileTypes: true })) {
            const p = join(dir, entry.name);
            if (entry.isDirectory()) walk(p);
            else if (exts.has(extname(entry.name).toLowerCase())) files.push(p);
        }
    };
    walk(join(root, "app", "src"));
    return files;
}

const cssFiles: string[] = collectCssFiles();
const corpusFiles: string[] = collectCorpusFiles(SIYUAN_ROOT);

// 类名 → 来源 CSS 文件（theme.css 合并了所有 partial，统一记作 theme.css）
const classSources = new Map<string, string[]>();
for (const file of cssFiles) {
    const classes = extractClassNames(readFileSync(file, "utf8"));
    for (const cls of classes) {
        if (IGNORE_PREFIXES.some((re) => re.test(cls))) continue;
        const sources = classSources.get(cls) ?? [];
        sources.push(relative(THEME_ROOT, file).replaceAll("\\", "/"));
        classSources.set(cls, sources);
    }
}

// 语料全文缓存
const corpus: string[] = corpusFiles.map((f) => readFileSync(f, "utf8"));

const dead = new Map<string, string[]>(); // 来源文件 → [类名]
for (const [cls, sources] of [...classSources].sort(([a], [b]) => a.localeCompare(b))) {
    const found = corpus.some((text) => text.includes(cls));
    if (!found) {
        for (const src of new Set(sources)) {
            const list = dead.get(src) ?? [];
            list.push(cls);
            dead.set(src, list);
        }
    }
}

const total: number = classSources.size;
const deadCount: number = new Set([...dead.values()].flat()).size;
console.log(`主题类名共 ${total} 个，疑似失效 ${deadCount} 个：\n`);
for (const [src, classes] of dead) {
    console.log(`${src}（${classes.length}）:`);
    console.log("  " + classes.join(", ") + "\n");
}

writeFileSync(
    join(THEME_ROOT, "check-selectors-report.json"),
    JSON.stringify(Object.fromEntries([...dead].map(([k, v]) => [k, v.sort()])), null, 2),
);
console.log("完整报告已写入 check-selectors-report.json");
