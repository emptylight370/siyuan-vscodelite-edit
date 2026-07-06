# CODEBUDDY.md This file provides guidance to CodeBuddy when working with code in this repository.

## 常用开发命令

### 构建命令

- `pnpm run build`：构建完整的主题文件（包括SCSS编译和TypeScript打包）
- `pnpm run build:scss`：仅编译SCSS文件，输出到`theme.css`和`sub/`目录
- `pnpm run build:ts`：仅编译TypeScript文件，使用esbuild打包到`theme.js`
- `pnpm run dev`：启动开发监视模式，自动重新编译SCSS和TypeScript
- `pnpm run dev:scss`：仅监视SCSS文件变化
- `pnpm run dev:ts`：仅监视TypeScript文件变化
- `pnpm run clean`：清理所有构建输出文件
- `pnpm run clean:scss`：仅清理SCSS编译输出
- `pnpm run clean:ts`：仅清理TypeScript编译输出

### 代码质量检查

- `pnpm run lint`：同时检查SCSS和TypeScript代码
- `pnpm run lint:scss`：仅检查SCSS文件（使用stylelint）
- `pnpm run lint:ts`：仅检查TypeScript文件（使用`tsc --noEmit`）

### 开发工具

- `mise install`：使用mise安装项目依赖和工具链
- `pnpm install`：使用pnpm安装项目依赖
- `mise run changelog`：根据git提交历史生成更新日志（使用conventional commit格式）

## 项目架构概览

这是一个思源笔记（SiYuan Note）的VSCode Lite Edit主题项目，采用TypeScript和SCSS构建。

### 核心架构

项目采用模块化设计，分为以下几个主要部分：

1. **TypeScript核心模块** (`src/ts/`)
   - `theme.ts`：主题入口点，处理主题加载、卸载和动态样式注入
   - `setting.ts`：设置面板管理，包括配置文件的读写和UI创建
   - `api.ts`：与思源笔记API的交互封装
   - `defs.ts`：全局变量和常量的定义与初始化
   - `types.d.ts`：TypeScript类型定义，包括主题配置、本地化消息等
   - `plugins/`：插件适配模块，包括背景插件和斜杠菜单适配

2. **SCSS样式系统** (`src/scss/`)
   - `_color.scss`：颜色变量定义，支持亮色/暗色主题
   - `app/`：应用程序界面样式（文档树、标签栏、状态栏等）
   - `block/`：内容块样式（代码块、表格、列表、标题等）
   - `plugin/`：插件适配样式（背景插件、双标签栏、快捷键面板等）

3. **构建系统**
   - esbuild：TypeScript打包，输出为IIFE格式，比Rollup更快
   - SCSS通过sass编译器直接输出，支持source map
   - 使用npm-run-all2（命令为`run-p`）并行执行构建任务

### TypeScript配置要点

- 目标环境：ES2021，最低支持WebView 95
- 严格模式：启用`strict`严格类型检查（含`forceConsistentCasingInFileNames`、`noFallthroughCasesInSwitch`）
- 模块系统：ESNext + bundler模块解析，配合`isolatedModules`对齐esbuild打包行为
- 输出配置：`rootDir`为`src/ts`，`outDir`为项目根目录，不生成声明文件

### 配置系统

主题采用动态配置系统，用户可以通过标题栏的"VC"按钮打开设置面板：

- 配置文件存储在思源笔记的`data/conf/appearance/theme/siyuan-vscodelite-edit/theme.json`
- 配置项分为思源主题配置和插件适配配置
- 支持动态启用/禁用各个样式模块

### 插件适配机制

主题支持多种思源笔记插件的适配：

- **背景图插件** (`backgroundCoverDesktop`/`backgroundCoverMobile`)：通过MutationObserver监测插件状态
- **斜杠菜单** (`slashMenu`)：监测并调整多栏斜杠菜单的显示
- **快捷键面板**：添加颜色样式
- **数学增强插件**：限制预览窗口宽度
- **双标签栏**：实现钉住标签页的单行显示

### 本地化系统

支持多语言（当前支持中文和英文）：

- 本地化消息定义在`types.d.ts`中的`vscMessage`接口
- 根据思源笔记的语言设置自动选择对应语言
- 新的语言需要添加到`SupportedLang`类型和`language`记录中

### 构建流程

1. **SCSS编译**：`theme.scss`作为主入口，导入各个模块的SCSS文件，输出到`theme.css`和`sub/`目录
2. **TypeScript编译**：`theme.ts`作为入口，通过esbuild打包为IIFE格式的`theme.js`
3. **样式注入**：运行时根据用户配置动态向CSS样式表中插入`@import`规则

### 开发注意事项

1. **版本管理**：`theme.json`中的版本号必须与`defs.ts`中的`vscDefaultConf.version`保持一致
2. **提交规范**：使用[conventional commit](https://www.conventionalcommits.org/)格式，lefthook会在提交时检查
3. **代码格式化**：使用Prettier，配置在`.prettierrc`中
4. **依赖管理**：使用mise和pnpm，确保Node.js版本≥22.18.0
5. **依赖操作**：操作依赖项时使用`pnpm add`、`pnpm remove`等命令，不直接修改`package.json`

### 配置系统工作原理

1. `theme.json`定义主题元数据和默认配置
2. `defs.ts`中的`vscDefaultConf`定义运行时默认配置
3. 用户配置通过设置面板修改，存储在思源笔记的`data/snippets/`目录
4. 样式注入在`theme.ts`中通过动态插入`@import`规则实现模块化加载

### 版本更新

- `mise run changelog`：生成更新日志，使用cliff.toml配置
- `changelog.md`：完整的版本变更历史
- `whatschange.md`：按文件/模块分类的变更记录

### 测试部署

构建完成后，需要将以下文件复制到思源笔记的主题目录：

- `theme.*`（除`theme.scss`和`theme.css.map`）
- `*.png`
- `README*.md`
- `resources/`
- `sub/`

目标路径：`~/data/conf/appearance/theme/siyuan-vscodelite-edit/`
