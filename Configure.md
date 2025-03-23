JUMP TO: [中文](#配置)  [English](#configure)

> 请注意：目前文档正在完善中。
>
> NOTICE: Current docs is under development.

# Configure

TBC(To be completed)

## Siyuan Theme

TBC

### Siyuan App Section

#### Bazaar

TBC

#### Doc tree and outline panel

TBC

#### Double Tab bar

TBC

### Editor Section

#### CodeBlock

TBC

#### Reference

TBC

#### Embedded Block

TBC

#### Heading

TBC

#### Table

TBC

#### List

TBC

#### Database

TBC

#### Mark

TBC

## Special Adaption

### Plugin Adaption

#### Shortcut key panel(siyuan-plugin-keymap)

TBC

#### Change Background Image()

TBC

#### Math Enhance Plugin()

TBC

### Code Snippets

Theme has integrated some code snippets from the bazaar. The following is the list:

- [CodeBlock show action buttons when hover](https://ld246.com/article/1728146248791) by JeffreyChen
- [Show pinned doc name(NO icon version)](https://ld246.com/article/1728392178095) by JeffreyChen

## Custom Style

TBC

# 配置

主题目前实现了配置面板，可以通过标题栏上的`VC`按钮来编辑配置文件。每次更新后，都需要手动启用当前版本的新内容。

在设置完成后，需要点击配置面板中的保存按钮，保存并刷新界面才能生效。

对于插件的适配，如果没有安装对应插件请关闭插件适配开关，否则会增加额外的加载时间和性能消耗。

## 思源主题

以下列出的内容并非主题全部更改的内容，而是大部分可以通过配置面板选择开关的功能。如果没有安装对应插件请关闭对应开关。

### 软件本体部分

#### 集市样式

修改了设置面板中的分类按钮样式。

#### 文档树和大纲样式

1. 为文档树添加了笔记本边框。
2. 为文档树和大纲调整了缩进。

#### 双标签栏

初步实现了双标签栏，可以将钉住的标签页显示在一行中。

### 编辑器部分

#### 代码块

代码块样式修改了代码块左侧行号的宽度，并且增加了代码块悬浮按钮功能（代码片段功能），将代码块语言和代码内容对齐。

#### 引用样式

引用样式给引用的锚文本添加了前后标识和背景色。

#### 嵌入块样式

限制了嵌入块的高度，并且增加了边框。可用于缩减嵌入块在编辑器中占用空间。

#### 标题样式

1. 为不同标题设置不同颜色。
2. 为标题设置文字阴影。（可单独开关）
3. 为标题添加图标用于区分标题层级。（可单独开关）

#### 表格样式

设置了表格表头的文字颜色。其本身就有加粗效果，主题添加了居中效果。

#### 列表样式

1. 为有序列表和无序列表的序号设置颜色。
2. 为不同的层级显示不同的序号样式。

#### 数据库样式

为数据库设置边框，并且将标题和数据库内容添加分隔线。

#### 标记样式

修改了标记的背景色和外观。

## 特殊适配

### 插件适配

#### 快捷键(siyuan-plugin-keymap)

对快捷键面板的标题添加了颜色。

#### 替换背景图片()

调整大部分界面的显示效果，适配背景图插件。这会将大部分界面设为半透明状态，需要将插件设置中的**前景透明度**调为0以关闭，并且将**背景虚化**调整到0.3以上。

> 没有安装背景图插件不建议开启，会带来不必要性能消耗。不喜欢当前适配的效果也可以选择关闭。

#### 数学增强插件()

限制了编辑器下方预览框的最大宽度，可以通过横向滚轮或鼠标选中文本移动当前预览位置。

> 如非必要不建议开启。

### 代码片段

主题中合并了部分集市中的代码片段，以下是列表。

- [代码块悬浮显示操作按钮](https://ld246.com/article/1728146248791) by JeffreyChen
- [显示钉住文档名（无图标版本）](https://ld246.com/article/1728392178095) by JeffreyChen

## 自定义样式

主题中大部分样式可以通过代码片段覆盖的方法来调整。样例可见：[把 VSCode Lite Edit 主题变成自己喜欢的样子 - 链滴](https://ld246.com/article/1736062978596)、[滚动条调节 - 链滴](https://ld246.com/article/1735903636402)。

自定义颜色可以通过以下代码来实现。

```css
:root[data-theme-mode=light]{}

:root[data-theme-mode=dark]{}
```

可自定义的颜色请自行查看`color.scss`或`color.css`。

主题前段时间采用SCSS重构，可能导致部分代码片段失效，需要重新根据新生成的选择器进行调整。如有能力可查看GitHub上的SCSS代码自行理解，或选择查看本地主题代码（未压缩成单行，含少量注释）。