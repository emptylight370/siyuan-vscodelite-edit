JUMP TO: [中文](#配置) [English](#configure)

> 请注意：目前文档正在完善中。
>
> NOTICE: Current docs is under development.

# Configure

Theme has implement a configure panel, you can edit the config file by the `VC` button on the title bar. You should turn on the new config manually after upgrade to new version.

After setting, you should click the save button in the panel, and reload the interface to take effect.

For the plugin adaption, turn off the switch if not install the plugin, or it would lead to longer loading time and lower performance.

## Siyuan Theme

The items listed below are not the all contents changed by theme, but mostly can switch by configure panel. If doesn't install the plugin please turn off the switch.

### Siyuan App Section

#### Bazaar

Modify the style of category button in the setting panel.

#### Doc tree and outline panel

1. Add notebook border for doc tree.
2. Adjust indent of doc tree and outline tree.

#### Double Tab bar

Preliminary implementation of dual tab bars, which can display pinned tabs in a single line.

### Editor Section

#### CodeBlock

CodeBlock style change the width of line-number, and add floating button on code block(feature from code snippet), align the code block language and contents.

#### Reference

Reference style add symbol around the anchor text and change background color.

#### Embedded Block

Limit the height of embedded block, and add border. Using to reduce the occupied space of embedded block in the editor.

#### Heading

1. Set different color of different heading.
2. Add text shadow of heading.(has single switch)
3. Add icon to distinguish different level of heading.(has single switch)

#### Table

Set the text color of table head and move them to the center of line. It itself has bold style.

#### List

1. Sets the color for the ordinal numbers of ordered and unordered lists.
2. Set different appearance of different level of ordinal number.

#### Database

Add border of database, and seperate the title and contents of database.

#### Mark

Change the background color and appearance of mark.

#### Tag

Tags in a content block use the same style as document tags.

## Special Adaption

### Plugin Adaption

#### Shortcut key panel(siyuan-plugin-keymap)

Add colors for the plugin panel.

#### Change Background Image(siyuan-plugin-background-cover)

Adjust the display effect of most interfaces to adapt to the background image plugin. This will set most interfaces to a semi-transparent state. If you need to adjust background visibility, open the `sub/backgroundPlugin.css` file in the theme folder and modify:

```css
#bglayer,
#bgvideo {
  opacity: 1 !important;
}
```

Change `1` to a value between 0 and 1. You can also try adding a code snippet, but its effect is not guaranteed.

> Not recommended to turn this on when the background plugin is not installed, as it will cause unnecessary performance consumption. You can also turn it off if you don't like the current adaptation effect.

#### Math Enhance Plugin(siyuan-plugin-math-enhance)

Limit the max width of the preview window under the editor, you can scroll by horizonal wheel or select the texts.

> Don't turn this on unless it's necessary for you.

### Code Snippets

Theme has integrated some code snippets from the bazaar. The following is the list:

- [CodeBlock show action buttons when hover](https://ld246.com/article/1728146248791) by JeffreyChen
- [Show pinned doc name(NO icon version)](https://ld246.com/article/1728392178095) by JeffreyChen

## Custom Style

Most style of theme can cover by snippets. This is examples: [Turn VSCode Lite Edit into your favourite appearance - LianDi](https://ld246.com/article/1736062978596)(in Chinese), [Scroll bar adjustment - LianDi](https://ld246.com/article/1735903636402)(in Chinese).

You can set colors by the following code:

```css
:root[data-theme-mode="light"] {
}

:root[data-theme-mode="dark"] {
}
```

Those color you can modify are in `color.scss` or `color.css`.

Theme has refactored with SCSS, may cause some snippets unusable, should rewrite with new CSS selectors. If you can, you can view the SCSS code on GitHub, or view the CSS code in local folder(didn't compress to one line, contains a little comments).

## Custom Attribute

Theme provides some available custom attributes, please view in [README](README.md#custom-attributes).

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

#### 标签样式

在段落中的标签应用类似于文档标签的样式。

## 特殊适配

### 插件适配

#### 快捷键(siyuan-plugin-keymap)

对快捷键面板的标题添加了颜色。

#### 替换背景图片(siyuan-plugin-background-cover)

调整大部分界面的显示效果，适配背景图插件。这会将大部分界面设为半透明状态。如需调整背景可见度，打开主题文件夹/sub/backgroundPlugin.css文件，修改其中的：

```css
#bglayer,
#bgvideo {
  opacity: 1 !important;
}
```

将 `1` 改为 0\~1 之间的数值即可。也可尝试添加代码片段，但不保证生效。

> 没有安装背景图插件不建议开启，会带来不必要性能消耗。不喜欢当前适配的效果也可以选择关闭。

#### 数学增强插件(siyuan-plugin-math-enhance)

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
:root[data-theme-mode="light"] {
}

:root[data-theme-mode="dark"] {
}
```

可自定义的颜色请自行查看`color.scss`或`color.css`。

主题前段时间采用SCSS重构，可能导致部分代码片段失效，需要重新根据新生成的选择器进行调整。如有能力可查看GitHub上的SCSS代码自行理解，或选择查看本地主题代码（未压缩成单行，含少量注释）。

## 自定义属性

目前主题提供了一些可用的自定义属性，请自行前往[说明文档](README.zh-CN.md#可用属性值)查看。
