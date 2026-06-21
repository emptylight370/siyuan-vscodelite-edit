# ChangeLog

## v3.0.1

- 增强移动端添加设置按钮的适应性
- 适配思源笔记3.7.0版本新语言代码
- 优化打字机模式
- 在主题设置中关闭打字机模式开关后正确禁用打字机模式
- 移除电脑端设置面板项在鼠标悬停时放大加粗显示效果
- 优化代码
- Enhance the adaptability of the add settings button on mobile
- Adapt to the new language code of SiYuan Note 3.7.0 version
- Optimize typewriter mode
- Disable typewriter mode properly when the typewriter mode switch is turned off in the theme settings
- Remove desktop settings panel items on hover from enlarging and bolding
- Optimize code

## v3.0.0

- 背景插件适配样式适配新默认主题
- 顶部栏工作空间菜单适配新默认主题
- 文档标签栏适配新默认主题
- 添加自定义属性：隐藏数据库主键
- 数据库外观适配新默认主题
- 添加打字机模式
- 图片查看器背景不透明
- 段落内标签样式适配新默认主题
- 初步适配新默认主题顶栏融合样式
- 面包屑高度适配新默认主题
- 修复启用标题图标后标题块中含有行级公式时显示错误问题
- 强制禁用新版背景图片插件的背景透明效果
- 适配新版背景图片插件(v1.x.x)
- 将文本样式弹窗背景透明从背景插件适配移动到通用样式
- Background plugin adaption style adapt to new default theme
- Top bar workspace menu adapt to new default theme
- Document tag bar adapt to new default theme
- Add custom attribute: hide database primary key
- Database style adapt to new default theme
- Add typewriter mode
- Image viewer background not transparent
- Inline tag style adapt to new default theme
- Initial adaption to new default theme top bar fusion style
- Breadcrumb height adapt to new default theme
- Fixed an issue where the heading icon was displayed incorrectly in heading blocks containing inline formulas
- Force disable new background plugin's background transparency effect
- Adapt to new background plugin(v1.x.x)
- Move text style popup background transparency from background plugin adaption to general style

## v2.7.8

- 修复设置面板项在放大加粗时可能出现滚动条问题
- 将繁体中文说明文档指向简体中文
- Fix issue where setting panel items may have scrollbar when enlarged and bolded
- Redirect Traditional Chinese docs to Simplified Chinese

## v2.7.7

- 电脑端设置面板项在鼠标悬停时放大加粗显示
- 优化启用背景插件时移动端设置侧栏显示背景
- 优化代码
- Settings panel items on desktop become larger and bold on hover
- Optimize background display for mobile settings sidebar when background plugin is enabled
- Optimize code

## v2.7.6

- 更新文档
- 压缩代码输出
- Update docs
- Compress code output

## v2.7.5

- 修复思源 3.6.1 斜杠菜单横向滚动条
- Fix slash menu has horizonal scrollbar on SiYuan 3.6.1

## v2.7.4

- 修改主题设置不需要重载界面
- Theme setting changes do not require interface reload

## v2.7.3

- 修改点击选中图片样式
- 修改表格标题外观与图片标题一致
- Modify the style when clicking to select an image
- Make table caption appearance consistent with image caption

## v2.7.2

- 为代码块自定义语言添加标识
- 为代码块语言列表的清空和自定义语言按钮添加边框
- 修复代码块行号超过1000行时显示不全问题
- 缩小文档内标签字体大小
- Add label for code block custom language
- Add border for clear and custom button in language list of code block
- Fix the issue where line numbers in code blocks are not fully displayed when exceeding 1000 lines
- Reduce the font size of tags within the document

## 2.7.1

- 更新赞助链接
- Update sponsorship link

## 2.7.0

- 优化代码
- Optimize code

## v2.6.3

- 修复在列表中折叠标题块的图标显示问题
- 改善标题图标的显示效果
- 优化`/`菜单多栏显示功能(#34)
- 优化代码
- Fix icon display issue with folded heading in list
- Improve the display effect of heading icon
- Improve `/` menu multi-column display feature(#34)
- Optimize code

## v2.6.2

- 修复设置面板图标丢失
- 在启用背景插件适配时让文本外观选择窗口也透明化
- 移除引述块Callout自定义属性
- 完善自定义属性`av-no-add-entry`
- 处理嵌入块样式与Query&View插件兼容性问题(#33)
- 添加`/`菜单多栏显示功能(#34)
- Fix icon missing in settings panel
- When enabled background plugin adaption, let text appearance selection window transparent
- Remove quote block Callout custom attributes
- Improve custom attribute `av-no-add-entry`
- Handling compatibility issues between embedded block styles and the Query&View plugin(#33)
- Add `/` menu multi-column display feature(#34)

## v2.6.1

- 添加主题更新后显示通知功能
- 在主题更新后显示引述块自定义属性移除通知
- 在启用背景图片插件适配时，将空白初始页的背景设置为透明
- 在关闭背景图片插件时，正确处理元素变化
- Added notification feature after theme updates
- Show notification about removal of quote block's custom attributes after theme update
- When enabling background image plugin adaptation, set the background of blank initial page to transparent
- Handle element changes properly when disabling the background image plugin

## v2.6.0

- 数据库所有视图添加数据库标题下分割线
- 更换导出PDF时应用主题样式方法(需要思源版本3.4.1)
- 优化导出PDF时执行代码
- 修复标题样式子开关不跟随主开关问题
- 重构样式文件，加快加载速度
- 优化代码
- Add division line under database title for all views
- Change method to add theme style for exporting PDF(Require SiYuan version 3.4.1)
- Optimize code executing when exporting PDF
- Fixed an issue where the title style sub switch did not follow the main switch
- Refactor style file to speed up loading
- Optimize code

## v2.5.2

- 数据库样式适配看板视图
- 添加*自定义属性*以隐藏数据库添加条目按钮
- 添加*自定义属性*以隐藏数据库添加视图按钮
- 修复启用标题图标又未启用嵌入块样式时嵌入块中连续标题会在一行中显示问题
- 集市说明文档中表格应用主题样式
- Database style adapt to kanban view
- Add _custom attribute_ to hide database add entry button
- Add _custom attribute_ to hide database add view button
- Fixed an issue where consecutive titles in embedded blocks were displayed in a line when the title icon was enabled and the embed block style was not enabled
- Apply theme style in bazaar readme table

## v2.5.1

- 文档树边框适配移动端(#27)
- 文档树缩进适配移动端
- 文档树添加层级缩进线
- 降低移动端菜单透明度
- File tree border adapt to mobile(#27)
- File tree indent adapt to mobile
- File tree add indent line
- Reduce mobile menu transparency
- minor fixes
- Optimize the code

## v2.5.0

- 优化代码
- 优化数学增强插件适配
- 重构主题设置面板
- 导出图片时暂不显示标题图标（无法加载图片）(#26)
- 导出图片时暂不显示自定义列表序号(#26)
- 修改折叠块样式
- 添加自定义属性
- Optimize the code
- Optimize the adaption of math enhance plugin
- Refactor theme's setting panel
- Hide heading icon when exporting image(can't show image)(#26)
- Not apply customized list sequence when exporting image(#26)
- Modify folded block style
- Add custom attribute

## v2.4.2

- 区分静态锚文本和动态锚文本
- 优化代码
- 发布模式下不显示主题设置按钮
- 发布模式下避免出现报错
- Distinguish between static and dynamic anchor text
- Optimize the code
- Don't show theme config button in publish mode
- Avoid console errors in publish mode

## v2.4.1

- 适配API变更(siyuan-note/siyuan#15727)
- 补充之前一直遗漏的最小思源版本
- Adapt to API change(siyuan-note/siyuan#15727)
- Supplement the minimal Siyuan version that has been missing before

## v2.4.0

- 修复背景插件适配下数据库分组的显示问题
- 微调列表中标题图标的显示位置
- 微调标题图标的显示位置
- 背景插件适配下让设置面板右侧的选项背景透明显示(#5)
- Fix display problem of database group in background plugin adaption
- Fine-tune title icons' display position in list
- Fine-tune title icons' display position
- Make the background of setting items on the right of setting panel display in transparent when enable background plugin adaption(#5)

## v2.3.9

- 修改描述
- 部分代码重构
- Change description
- Some code refactor

## v2.3.8

- 修复背景插件适配开关启用后关系图全屏背景透明无法正常查看问题
- 添加自定义属性：标记挖空
- 适配新的数据库视图外观
- Fix the issue when enabled background plugin adaption, the background of graph is transparent and can't view normally
- Add custom attribute: mark hollowing
- Adapt to new database view appearance

## v2.3.7

- 修复背景插件适配中的关系图背景
- 改进代码片段：代码块悬浮显示操作按钮的样式
- Fix graph view background with background plugin adaption switch on
- Improve the style of snippet: CodeBlock show action buttons when hover

## v2.3.6

- 修复亮色模式下集市页签颜色问题(#24)
- 为其他分隔线应用鼠标悬浮效果
- Fix the issue of bazaar tab color in bright mode(#24)
- Add mouse hover style for other division line

## v2.3.5

- 修复自定义列表序号时序号阴影显示错位问题
- 添加代码片段：修正列表序号阴影显示位置 by queguaiya
- Fix the issue where the shadow of a custom list sequence was displayed in the wrong position
- Add code snippet: Fix the display position of the list sequence shadow by queguaiya

## v2.3.4

- 继续修复标题图标显示异常(#23)
- 补全状态栏内字体回退
- Continue to fix heading icon display problem(#23)
- Complete the fallback of fonts in the status bar

## v2.3.3

- 修复标题图标在不同编辑器字号下显示异常问题(#23)
- 尝试修复启用背景插件适配时编辑器全屏显示问题(#15)
- Fix heading icon display error in different editor font size(23)
- Try to fix editor fullscreen display problem when enable background plugin adaption(#15)

## v2.3.2

- 调整Callout样式
- 修复集市中README无法显示图片
- Adjust Callout style
- Fix pics not display in bazaar's README file

## v2.3.1

- 新增引述块Callout样式的自定义属性
- Add custom attribute for the Callout style of quote block

## v2.3.0

- 使用Prettier刷一遍代码
- 新增自定义属性
- 设置面板中未设置的选项使用默认值
- 修改双标签栏的显示效果
- 修复思源版本3.1.32以上导致的标题图标错位问题
- 修复主题配置文件需要更新时无法正常加载主题问题
- 优化代码以增强稳定性
- Use Prettier to format code
- Add custom attribute
- The options not set in setting panel uses their default value
- Change display of the double tab bar
- Fix heading icon display in incorrect position in SiYuan version 3.1.32 and above
- Fix issue that can't load theme when theme config file should update
- Optimize code to enhance stability

## v2.2.11

- 修复一些遗留问题
- 重新格式化代码
- Fix some legacy issues
- Format code again, hopefully nothing changed.

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
