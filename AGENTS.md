# AGENTS.md This file provides guidance to CodeBuddy when working with code in this repository.

## 常用命令

### 环境准备

- `mise install`：安装 node / pnpm / prettier / lefthook / git-cliff 工具链，并通过 `[deps.lefthook]` 自动执行 `lefthook install`。
- `pnpm install`：安装依赖。仓库由 mise + pnpm 管理，Node ≥ 22.18.0。
- 增删依赖一律用 `pnpm add` / `pnpm remove`，**不要**直接编辑 `package.json`。

### 构建

- `pnpm run build`：并行执行 `build:*`，产出 `theme.css`、`theme.js`、`sub/`。
- `pnpm run build:scss`：`sass theme.scss:theme.css src/scss:sub --no-source-map`。
- `pnpm run build:ts`：`esbuild src/ts/theme.ts --bundle --format=iife --outfile=theme.js --minify`。
- `pnpm run dev`：并行 watch 模式（`dev:scss` 带 sourcemap，`dev:ts` 带 sourcemap）。
- `pnpm run clean` / `clean:scss` / `clean:ts`：删除构建产物。
- 构建系统：esbuild 打 TS 为 IIFE（生产 `--minify`，dev 带 sourcemap）；sass 直出 CSS（生产 `--no-source-map`，watch 带 sourcemap）；`run-p` 来自 npm-run-all2，用于并行执行各 `*:` 子任务。

### 检查

- `pnpm run lint`：`run-p lint:scss lint:ts`。
- `pnpm run lint:scss`：`stylelint "**/*.scss"`，配置见 `stylelint.config.ts`。
- `pnpm run lint:ts`：`tsc --noEmit`（`tsconfig.json` 已设 `noEmit`）。
- 格式化由 lefthook pre-commit 调用 prettier；手动执行 `prettier -w <files>`。配置见 `.prettierrc`（默认 2 空格，`.scss/.css/.ts/.js` 为 4 空格，printWidth 120）。
- 仓库无测试框架，改动后需自行在思源中人工验证。

### 部署到思源

- 部署脚本由用户自行编写，不同步到仓库。需根据当前用户实际情况调用或编写。
- 手工部署需复制：`theme.*`（排除 `theme.scss`、`*.css.map`）、`*.png`、`README*.md`、`resources/`、`sub/`，目标为工作空间的 `conf/appearance/themes/siyuan-vscodelite-edit/`。

### 版本与日志

- `mise run changelog`：运行 `.mise/tasks/changelog.ps1`，以 `theme.json` 的 version 为 tag 生成 `whatschange.md` 并 prettier 后 `git add`。
- `git cliff`：直接调用 git-cliff，输出文件由 `cliff.toml` 指定为 `whatschange.md`（按 commit 类型分组的变更记录）。注意 `changelog.md` 是另一份**手工维护**的完整版本历史，不要被 git-cliff 覆盖。
- 发布：向 `scss` 分支推送含 `theme.json` 变更的提交，触发 `.github/workflows/package.yml` 打包并创建 GitHub Release。

## 架构总览

这是一个**思源笔记（SiYuan）主题**，不是 npm 包也不是网站。产物是 `theme.css` + `theme.js` + `sub/*.css`，被思源以「主题 + 主题脚本」的方式加载，运行宿主是思源内嵌的 WebView（最低 WebView 95 / ES2021）。

### 产物与入口

- `theme.scss` 是主样式入口，只 `@use` **部分文件（partial）**，编译出 `theme.css`。
- `src/scss` 整个目录被编译到 `sub/`。**关键约定**：以 `_` 开头的 partial 不会单独输出，其样式只能随 `theme.css` 生效；不带 `_` 的文件会输出成 `sub/<子目录>/<名字>.css`，即「可选模块」。
- `src/ts/theme.ts` 经 esbuild 打成 IIFE（生产 minify，dev 带 sourcemap）输出为 `theme.js`。

因此**新增一个可开关样式模块**时，SCSS 文件名不能带下划线前缀，否则不会生成到 `sub/`，运行时 `@import` 必然 404。

### 运行时加载流程（`src/ts/theme.ts`）

`theme.js` 加载即执行：

1. 幂等守卫：`#themeScript` 与 `#snippetJS-VSCodeLiteEdit` 同时存在时直接 return，避免在 PDF 导出场景下重复注入。
2. `loadGlobalVars()`（defs.ts）：挂载 `vscDefaultConf`、`vscMessage`、`vscLang`、`vscTimers`、`vscObservers`、`vscCounters` 等全局变量。
3. `getSettings()`（setting.ts）：读取 `/data/snippets/vsc_edit.config.json`，文件不存在则用默认值写入一份；返回所有启用项 id 的数组 `SettingPanelId[]`。
4. `addThemeToolBar()`：在标题栏注入 `VC` 按钮（`#vscleToolbar`）。桌面端插到 `#toolbarVIP` 或 `#windowControls` 之前，移动端轮询 `button[data-type="exit-focus"]` 最多 60 次，并给 `body` 加 `vscmobile` 类。发布模式（`window.siyuan.isPublish`）不注入。
5. `addImports()`：向 `#themeStyle` 的 `CSSStyleSheet` 顶部按序 `insertRule("@import url(sub/...css)")`，把启用项映射为具体的 sub CSS 路径。部分项有依赖或环境判断：`titleShadow`/`titleIcon` 依赖 `title`；`bazaar`/`shortcutPanel`/`database`/`doctree`/`backgroundCover*`/`mathPanel`/`doubleTabbar` 在导出 PDF 时跳过；`mathPanel`/`doubleTabbar` 在移动端跳过；两个 `backgroundCover*` 共用同一份 CSS，用 `existBackgroundPlugin` 去重。
6. `addFixedAttribute()`：启动需要常驻监听的行为——背景插件检测、斜杠菜单定时器、打字机模式。
7. `addPDFScript()`：把自身 script 再插一份为 `#snippetJS-VSCodeLiteEdit`，使导出 PDF 时主题脚本也会执行。
8. `window.destroyTheme()`：思源切换主题时调用，负责移除 VC 按钮、PDF 脚本、`body` 上的 `bgenable`/`vscmobile` 类、销毁打字机监听、清空 `vscTimers`/`vscObservers` 并删除全部 `vsc*` 全局变量。**新增任何计时器/观察器，都要登记到 `vscTimers`/`vscObservers` 并在 `defs.ts` 初始化，否则无法被清理。**

### 配置系统

`src/ts/settingsSchema.ts` 是**唯一数据源（Single Source of Truth）**。追加一个开关项的完整清单：

1. `settingsSchema.ts` 的 `settingsSchema` 数组加一项 `{ key, group: "theme" | "plugins", default, label, desc? }`，其中 `label`/`desc` 是 `vscMessage` 的键名。
2. `types.d.ts` 的 `ThemeConfig.theme` 或 `ThemeConfig.plugins` 加同名字段（boolean）。
3. `defs.ts` 的 `globalThis.vscMessage` 补上对应的中英文案。
4. `theme.ts` 的 `addImports()` 的 switch 加 case，映射到 `sub/` 下的 CSS 路径。
5. 新建 `src/scss/{app,block,plugin}/<name>.scss`（无下划线）。

配套机制：

- **编译期双向断言**：`settingsSchema.ts` 末尾的三条 `Assert<...>` 强制 `ThemeConfig` 与 schema 的键名完全一致，任一侧漏改都会编译报错。注意这些断言必须留在 `.ts` 里，放进 `types.d.ts` 会被 `skipLibCheck` 跳过而失效。
- group 与 key 通过判别联合（`ThemeSchemaEntry | PluginSchemaEntry`）在类型层面绑定，theme 的键不能误放进 plugins 分组。
- `defs.ts` 里 `vscDefaultConf.theme` / `.plugins` 由 schema 按 group 过滤后 `Object.fromEntries` 自动生成，不要手写默认值。
- **配置文件真实路径是工作空间下的 `data/snippets/vsc_edit.config.json`**（常量 `CONFIG_PATH`），不是主题目录下的 `theme.json`。`theme.json` 只是主题市场元数据。
- 两套版本号：`vscDefaultConf.version` 是**配置结构版本**（整数），配置文件的 version 小于它时会推送 `confUpdate` 提示用户重新保存；`vscDefaultConf.lastSeen` 是**主题版本字符串**，必须等于 `theme.json` 的 `version`，不一致时推送 `newVersionHint` 一次性通知。
- `setting.ts` 的 `createSettingsWindow()` 用原生 DOM 拼出设置面板（复用思源的 `b3-dialog` / `b3-switch` 类）。保存时以 `vscDefaultConf` 深拷贝为基准、按 schema 回填复选框状态，从而自动丢弃已废弃的旧键；保存后调 `_reEnableTheme()`（先切到 daylight/midnight 再切回来）而非直接 reload。

### TypeScript 配置要点（`tsconfig.json`）

- 目标 ES2021，`lib` 为 `ES2021 + DOM + DOM.Iterable`，注释中标注最低支持 WebView 95（思源 issue 15147）。
- `strict` 全开，另含 `forceConsistentCasingInFileNames`、`noFallthroughCasesInSwitch`。
- `module: ESNext` + `moduleResolution: bundler` + `isolatedModules`，后两者是为了对齐 esbuild 的实际打包行为（跨文件类型导入需用 `import type`）。
- `noEmit: true`（类型检查专用，产物由 esbuild 产出）、`skipLibCheck: true`、`rootDir: src/ts`、`declaration: false`。

### 本地化

`getMsg(key)`（api.ts）按 `globalThis.vscLang` 取文案，依次回退 `en` → 第一个可用语言 → 错误占位串。语言选取在 `loadGlobalVars()` 中完成：`zh-TW` 归到 `zh-CN`，其余未知语言归到 `en`。新增语言需改 `SupportedLang`、`vscMessage.language` 标记，并补齐**所有**文案键。

### 思源 API 封装（api.ts）

基于 `fetch` POST 到 `/api/*`，自动附带 `window.siyuan.config.api.token`。提供 `_getFile` / `_writeFile` / `_postMessage` / `_reloadInterface` / `_reEnableTheme`。发布模式下写文件被禁止，`updateLastSeen()` 会提前 return。

### 插件适配模块（`src/ts/plugins/`）

- `background.ts`：`bg(times)` 轮询检测 `#bglayer` / `#bgvideo` 是否存在及可见，切换 `body.bgenable`；`bgObserve()` 用 `MutationObserver` 监听其 `style` 属性变化；`bgExistObserver()` 监听父节点 childList 以感知插件启停。
- `slashmenu.ts`：观察 `div.protyle-hint.hint--menu` 的 `class` 变化，菜单显示时接管左右方向键，按几何距离在多栏菜单间移动焦点。
- `typewriter.ts`：在 `document` 上用事件委托（capture）监听 keydown/click，把光标所在的 `[data-node-id]` 块滚到视口中央；对表格、数据库（table/gallery/kanban 各种视图）、代码块有分支处理。用 `globalThis.vscTypewriterAbort`（`AbortController`）统一注册/注销监听，重载时能先 abort 上一次的监听。

### SCSS 约定

- `_color.scss` 在 `:root[data-theme-mode="light"]` 与 `[data-theme-mode="dark"]` 下定义两套 CSS 变量，前缀 `--lite-*`（主题自定义）与 `--mk-*`（按区域划分：toolbar / filetree / tabbar / dock / 编辑区 / 控件）。用户可通过代码片段覆盖这些变量来改色，见 `Configure.md`。
- 目录划分：`app/`（界面：文档树、标签栏、状态栏、dock、滚动条、设置面板等）、`block/`（内容块：标题、列表、表格、代码块、数据库、嵌入块、标记、标签等）、`plugin/`（插件适配）。
- `stylelint.config.ts` 基于 `stylelint-config-standard-scss`，显式关闭了 BEM 选择器命名、id/自定义属性/SCSS 变量命名、注释与声明前空行、`color-function-notation`、`function-url-quotes` 等规则。其中 `media-feature-range-notation` 关闭是因为 WebView 95 不支持 `>= 768px` 这类范围语法（需 Chrome 104+）。写 SCSS 时要**守住 WebView 95 的语法边界**。等待思源提升最低 WebView 版本后，需同步修改此文档、tsconfig 配置文件、stylelint 配置文件三处。

### 提交与发布

- lefthook（`lefthook.yml`，脚本在 `.lefthook/`，本地覆盖在 `.lefthook-local/`）：
  - pre-commit（仅当 `theme.json` 的 version 有变更时）：`checkVersion.ts` 校验一致 + `mise run changelog` 生成日志。
  - pre-commit（常规）：prettier 格式化暂存文件（`*.md` / `*.json` / `src/*`）并 `stage_fixed`；有 `*.scss` 改动时跑 `pnpm run lint`。
  - commit-msg：`commitmsg.sh` 用正则强制 Conventional Commits（type 含 `wip`，注意正则允许的是 `docs` 而 cliff 分组用的是 `doc`）。
- 发布流程：同步修改 `theme.json.version` 与 `defs.ts` 的 `lastSeen` → 提交（钩子自动生成 `whatschange.md`）→ 推送 `scss` 分支 → `package.yml` 执行 build、打包 `package.zip`（排除 `*.css.map` 与 `theme.scss`）、用 git-cliff 生成 `release.md` 并创建 Release。

### 易踩的坑

- `theme.json.version` 必须等于 `defs.ts` 里 `lastSeen` 的字符串值（不是 `vscDefaultConf.version` 那个整数）。
- 新增可选样式模块的 SCSS 文件名**不能**带 `_`，否则不会编译进 `sub/`。
- `window.siyuan.isPublish` 为真时禁止写文件、不注入 VC 按钮，相关逻辑需提前 return。
- 任何新增的计时器/观察器都要在 `defs.ts` 初始化并登记，否则 `destroyTheme` 清理不掉，会造成主题切换后残留。
