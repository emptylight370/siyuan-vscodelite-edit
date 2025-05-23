# ChangeLog

## v2.2.11

- Format code, hopefully nothing changed.

## v2.2.10

- 修复列表中标题图标显示问题
- Fix display issue of heading icon in list

## v2.2.9

- 修复新版本思源中提示 401Unauthorized 问题
- Fix 401Unauthorized issue in SiYuan new version

## v2.2.8

- 为文章内标签使用文章标签颜色
- Use the color of article tags for tags inside the article.

## v2.2.7

- 修复启用标题图标后角标被压缩问题
- 缓解标题中如果含有特殊样式会显示异常问题
- 修复标题中没有文本时不显示光标问题
- Fixed the issue that the corner mark was compressed after enabling the title icon
- Mitigate an issue where the heading would display exceptions if it contained a special style
- Fixed the issue that the cursor was not displayed when there was no text in the heading

## v2.2.6

- 微调标题图标显示效果，未解决可能导致运行时错误的问题
- 思源使用繁体中文现在会显示简体中文设置面板
- Fine-tune the display effect of the title icon to address potential runtime error issues.
- Using Traditional Chinese in SiYuan will show Simplified Chinese setting panel now

## v2.2.5

- 添加代码片段：显示钉住文档名 by JeffreyChen
- 侧栏分隔线在鼠标悬停时高亮(#19)
- Add code snippet: Show pinned doc name by JeffreyChen
- Side dock division line will highlight when mouse hovering(#19)

## v2.2.4

- 修复文档树缩进异常
- Fixed document tree indent exception

## v2.2.3

- 修复双标签栏的报错
- Fix an error in double tab bar

## v2.2.2

- 初步实现双标签栏，可以将钉住的标签页显示在一行中
- Implement double tab bar partly, can display pinned tab in single line

## v2.2.1

- 回退2.2.0修改
- Revert changes in 2.2.0

## v2.2.0

- 能够在导出PDF时手动加载自定义块样式插件的样式文件
- Be able to load plugin Custom Block Styles' stylesheet manually when exporting PDF

## v2.1.5

- 修复任务列表可能不显示标记问题(#20)
- Fixed issue that task list may not display icon in some cases(#20)

## v2.1.4

- 修复背景图片插件适配开关判断问题
- 修改退出聚焦按钮颜色
- 微调列表序号位置
- Fixed the background image plugin compatibility switch issue
- Modified the color of the exit focus button
- Fine tune list sequence position

## v2.1.3

- 修复移动端VC按钮显示问题(#18)
- Fix VC button display problem on mobile(#18)

## v2.1.2

- 修复桌面端VC按钮显示问题(#18)
- 将集市的标签页聚焦效果移植到属性面板
- 为dock栏图标添加圆角
- 标签页下拉面板关闭标签页按钮添加鼠标悬浮高亮样式
- 下拉面板添加鼠标悬浮高亮样式
- Fix VC button display problem on desktop(#18)
- Migrate the market's tab focus effect to the Property Panel
- Add rounded corners to the dock bar icon
- Tab drop-down panel Close tab button Add mouse hover highlight style
- Add a mouse hover highlight style to the drop-down panel

## v2.1.1

- 修复替换背景插件适配样式重复添加问题
- Fix issue with Background Cover Plugin adaption style duplicate

## v2.1.0

- 修复设置面板中不显示标题图标问题
- 重构JavaScript代码到TypeScript，并优化代码
- Fix heading icon not display in setting panel
- Refactor JavaScript to TypeScript and optimize the code

## v2.0.11

- 在移动端添加主题配置按钮
- Add theme configure button for mobile view

## v2.0.10

- 修复替换背景图插件适配中电脑端部分菜单显示问题
- Fix some menu's display problem with Background Cover plugin adaption

## v2.0.9

- 适配替换背景图插件的移动端
- Adapt Background Cover plugin's mobile

## v2.0.8

- 修改标签样式
- Modify tag style

## v2.0.7

- 跟进代码块样式上游更改
- Follow up on upstream changes to code block styles

## v2.0.6

- 修复js代码
- 导出PDF时禁用文字选择
- 导出PDF时禁用代码块复制按钮
- Fix js code
- Disable text select when expoerting PDF
- Disable code block copy button when exporting PDF

## v2.0.5

- 微调标题图标样式
- Minor modify header icon

## v2.0.4

- 修复无序列表最后的标记显示问题
- Fix the display problem of last label in unordered list

## v2.0.3

- fix package problem

## v2.0.2

- fix package problem

## v2.0.1

- fix package problem

## v2.0.0

- 使用sass重构
- 进一步拆分标题可选样式
- Refactoring with SASS
- Further split header optional styles

## v1.5.5

- 添加无序列表多级样式
- 在集市中应用标题颜色和列表颜色
- Add unordered list serial style
- Apply title color and list color in bazaar

## v1.5.4

- 调整代码块样式，修复浅色模式下颜色问题
- Adjust codeblock style, fix color problem in light mode

## v1.5.3

- 调整标注样式
- 调整代码块样式
- 嵌入代码片段：代码块悬浮显示操作按钮 by JefferyChen
- Adjust mark style
- Adjust codeblock style
- Include snippest: CodeBlock show action buttons when hover by JefferyChen

## v1.5.2

- 修复标注文本换行时不能显示背景问题
- Fixed the problem that the background cannot be displayed when the marked text is wrapped

## v1.5.1

- 紧急修复更新内容未打包问题
- Emergency fix update to address the issue with unpackaged content

## v1.5.0

- 修复导出PDF时丢失部分样式的问题
- Fix some styles would lost when exporting PDF

## v1.4.19

- 添加高亮标注样式
- Add highlight mark style

## v1.4.18

- 修复虚拟引用显示为引用样式的问题
- Fixed an issue where virtual references were displayed as reference styles

## v1.4.17

- 高亮退出聚焦按钮
- 修复块引加粗外观
- Highlight the exit focus button
- Repair reference text with bold appearance

## v1.4.16

- 标签关闭按钮添加悬停背景
- 为钉住的标签添加显示效果
- 微调集市标签字体样式，可能需要搭配字体插件才能看出区别
- tab close button add hover background
- Add special style for pinned tab
- Fine-tune the font style for market tabs; the differences might be more noticeable with a font plugin installed

## v1.4.15

- 重绘标题图标
- 修复标题显示效果(#14)
- Redraw heading icon
- Fix heading display style(#14)

## v1.4.14

- 调整背景插件适配下全屏显示效果(#15)
- Adjust fullscreen display style under background image plugin adaption(#15)

## v1.4.13

- 修改仓库链接，可能需要重新安装
- Edit repo link, maybe you should reinstall

## v1.4.12

- 去除表格透明以缓解表格失去背景问题（仅透明背景）
- Remove transparency from tables to alleviate the problem of losing background in tables(only transparent background)

## v1.4.11

- 可以禁用标题阴影(#13)
- Can disable heading block shadow(#13)

## v1.4.10

- 修复大纲中标题失去颜色问题
- Fixed the issue where the title in the outline lost color

## v1.4.9

- 修复标题无法居中问题(#9)
- Fixed the problem that the title could not be centered(#9)

## v1.4.8

- 标题添加阴影
- 标题符号转为svg并添加颜色
- Header add shadow
- Header icon convert to svg and add color

## v1.4.7

- 尝试修复导出预览效果
- 尝试修复设置界面右侧设置选项显示效果
- 尝试修复导出PDF预览面板右侧意外滚动条
- Try to fix the export preview style
- Try to repair the display style of setting options on the right side of the settings panel
- Try to fix the unexcepted scrollbar on the right side of export PDF preview panel

## v1.4.6

- 限制数学增强插件公式预览区域的宽度，可调整
- Limit the width of the mathematical enhancement plug-in formula preview area, adjustable

## v1.4.5

- 修复背景插件启用时意外影响移动端显示问题
- Fixed a problem that accidentally affected the mobile display when the background plug-in was enabled

## v1.4.4

- readme update
- fix known issue

## v1.4.3

- 让不透明的块更透明一点（可能带来显示问题）(#5)
- Make opaque blocks more transparent (may cause display problems)(#5)

## v1.4.2

- readme update

## v1.4.1

- 调整背景透明时数据库和嵌入块的背景(#5)
- Adjust the background of database and embedded blocks when the background is transparent(#5)

## v1.4.0

- 适配替换背景图片插件（需要关闭插件设置中前景透明度）(#5)
- Adapt Background Cover plugin (need to turn off foreground transparency in plugin settings)(#5)

## v1.3.5

- 更新说明文档
- 调整文档树部分样式
- 尝试适配自定义背景情况（dock）
- 尝试禁用移动端编辑器滚动条
- Update readme doc
- Adjust doc tree styles partly
- Try to adapt customized background(dock)
- Try to hide editor scroll bar on mobile app

## v1.3.4

- 新增文档树和大纲缩进（可能和插件冲突）
- Add document tree and outline indentation (may conflict with plugin)

## v1.3.3

- 新增本地化适配
- New localized adaptation

## v1.3.2

- 调整列表多层级样式
- 修复捐赠链接
- Adjust list multi-level styles
- Fix donate link

## v1.3.1

- 修复切换颜色主题需要重新加载的问题
- Fixed an issue where switching color modes requires reloading

## v1.3.0

- 更新加载主题的方式（可能需要多次重启或刷新）
- 添加数据库的样式
- 修改引用锚文本的样式
- 去除嵌入块的横向滚动条
- Update how themes are loaded (may require multiple restarts or refreshments)
- Add styles to the database
- Modify the style of reference anchor text
- Remove horizontal scroll bars from embedded blocks

## v1.2.3

- 快速修复Readme说明
- Readme quick fix

## v1.2.2

- 完成配置面板
- Accomplish Configure Panel

## v1.2.1

- 为有序列表添加不同缩进层级的编号类型(#4)
- 为无序列表添加颜色显示
- Add numbering types with different indentation levels to ordered lists (#4)
- Add color display to unordered lists

## v1.2.0

- 使用配置文件来调整主题显示效果，但是尚无法直接打开配置文件编辑。
- Use configuration file to amend display style, but can't directly open file to edit.

## v1.1.6

- Readme fix

## v1.1.5

- minor fix

## v1.1.4

- 修复了插件自定义块样式定义的块在嵌入块中的显示问题
- Fix plugin Custom Block Style's display problem in embedded block

## v1.1.3

- 修复了嵌入块的显示问题，表现为嵌入块内所有非段落块都单独显示。现在行级公式块不会单独显示了。

- Fix a display problem of embedded block, showing as any non-paragraph block will display in single line. Now it won't display like this.

## v1.1.2

- 调整了嵌入块的显示效果，限制高度到70vh
- Adjust the display style of embedded block, limit the height to 70vh

## v1.1.1

- minor bug fixed

## v1.1.0

- 改善引用锚文本显示效果
- 调整适配插件为导入模块
- 调整文件组成为导入模块
- Improve reference text display
- Change fit plugin's code to import module
- Change files to import module

## v1.0.11

- 调整代码块行号宽度为3em，缓解代码块换行冲突问题
- Expand code block line number width to 3em, alleviate code block soft wrap conflict

## v1.0.10

- 修复了集市中选中分类高亮问题
- Fix bazaar selected category highlight

## v1.0.9

- 修复README
- Fix README

## v1.0.8

- 修改README_zh到README_zh_CN
- Modify README_zh to README_zh_CN

## v1.0.7

- 修复标签栏意外滚动
- Fix tab-header accidently scroll

## v1.0.6

- Nothing change

## v1.0.5

- 更新许可证
- Update LICENSE

## v1.0.4

- 更新预览图
- Update preview image

## v1.0.3

- 修改了标题样式（好麻烦）
- Adjust title style

## v1.0.2

- 调整了部分颜色效果
- 调整了代码块行号显示
- 调整了有序列表显示效果
- 调整了状态栏显示效果
- 适配快捷键面板
- Adjust some color
- Adjust code block line number display style
- Adjust ordered list display style
- Adjust status bar display style
- Fit shortcut panel

## v1.0.1

- 调整了页面滚动条显示效果
- 调整了部分颜色效果
- Adjust scroll bar display style
- Adjust some color

## v1.0.0

- 从VSCode Lite复制项目，第一次更新
- 调整了各级标题样式
- 调整了部分区域宽高
- 调整了表格显示效果
- Copied from VSCode Ltie, first update
- Adjust title style
- Adjust some area's width and height
- Adjust table display style
