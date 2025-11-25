# VSCode Lite Edit

![GitHub Release Date](https://img.shields.io/github/release-date/emptylight370/siyuan-vscodelite-edit?display_date=published_at&link=https%3A%2F%2Fgithub.com%2Femptylight370%2Fsiyuan-vscodelite-edit/releases/latest)
![GitHub Release](https://img.shields.io/github/v/release/emptylight370/siyuan-vscodelite-edit?link=https%3A%2F%2Fgithub.com%2Femptylight370%2Fsiyuan-vscodelite-edit/releases/latest)
![GitHub issue custom search in repo](https://img.shields.io/github/issues-search/emptylight370/siyuan-vscodelite-edit?query=state%3Aopen%20label%3A%22help%20wanted%22&label=Issues%20need%20helps&labelColor=%23112E32)
![GitHub Repo stars](https://img.shields.io/github/stars/emptylight370/siyuan-vscodelite-edit?link=https%3A%2F%2Fgithub.com%2Femptylight370%2Fsiyuan-vscodelite-edit)

A further beautification of the interface from VSCode Lite.

Using dark mode for testing, expected no problems with light mode.

If display errors appear, reload SiYuan please.

Origin author: [TinkMingKing](https://github.com/TinkMingKing)

Instruction for use: [liandi](https://ld246.com/article/1728034766990)
Instruction for config：[GitHub](https://github.com/emptylight370/siyuan-vscodelite-edit/blob/scss/Configure.md)

# Features

- Style various heading levels(futher change)
- Fine-tune layout and color scheme
- Customize change
- Adjust code block
- Table display style
- Fit some plugins
- Limit display height of embedded block(can close)
- Multi-level list serial number style
- Configuration edit page
- doc tree and outline indentation
- Adjust highlight mark style
- Double tab bar, can display pinned tab in single line

# Configure

You can currently edit configuration files using the `VC` button on the title bar.

Limited by the configuration loading method, updated configurations for new versions need to be manually enabled in the configuration panel. This way, previous configuration data will not be lost.

# ChangeLog

> Full changelog view [ChangeLog](https://github.com/emptylight370/siyuan-vscodelite-edit/blob/scss/changelog.md)
> Commit history view [whatschange](https://github.com/emptylight370/siyuan-vscodelite-edit/blob/scss/whatschange.md)

- v2.6.0
  - Add division line under database title for all views
  - Change method to add theme style for exporting PDF(SiYuan version 3.4.1)
  - Fixed an issue where the title style sub switch did not follow the main switch
- v2.5.2
  - Database style adapt to kanban view
  - Add _custom attribute_ to hide database add entry button
  - Add _custom attribute_ to hide database add view button
  - Fixed an issue where consecutive titles in embedded blocks were displayed in a line when the title icon was enabled and the embed block style was not enabled
  - Apply theme style in bazaar readme table
- v2.5.1
  - File tree border adapt to mobile
  - File tree indent adapt to mobile
  - File tree add indent line
  - Reduce mobile menu transparency

# Special fitness

## Custom attributes

![readme_custom_attribute](resources/readme_custom_attribute.webp)

### How to use

To enable custom attributes, add the `vsce` attribute in the **Custom Attributes** panel of a block or document, and assign one or more valid attribute values. If mutiple values are used, separate them with spaces.

Since Siyuan will officially release [Callout block](https://github.com/siyuan-note/siyuan/issues/16051) in the future, the theme will remove the self-implemented quote block Callout style after this feature is launched. At that time, please perform the migration operation yourself.

### Usable attribute values

|       values       | Scope                       | Effect                                                           | Supported Since | Last Updated |
| :----------------: | --------------------------- | ---------------------------------------------------------------- | --------------- | ------------ |
|      `no-tag`      | document or content block   | Disable in-paragraph tag styles in the selected range            | 2.3.0           | 2.3.0        |
|    `mark-hide`     | document or paragraph block | Mark hollowing, hide marked text, display on mouse hover         | 2.3.8           | 2.3.8        |
|    `table-min`     | table block                 | Force the minimum column width without affecting manual settings | 2.3.0           | 2.3.0        |
|     `no-thead`     | table block                 | Disable the color and align of table head(`<thead>`)             | 2.3.0           | 2.3.0        |
|    `hide-thead`    | table block                 | Hide `<thead>` element visually                                  | 2.5.0           | 2.5.0        |
|  `callout-error`   | quote block                 | callout❌Red                                                     | 2.3.1           | 2.3.2        |
|   `callout-hint`   | quote block                 | callout💡Blue                                                    | 2.3.1           | 2.3.2        |
|   `callout-info`   | quote block                 | calloutℹ️White                                                   | 2.3.1           | 2.3.2        |
|   `callout-note`   | quote block                 | callout📝White                                                   | 2.3.1           | 2.3.2        |
| `callout-question` | quote block                 | callout❓Yellow                                                  | 2.3.1           | 2.3.2        |
|  `callout-quote`   | quote block                 | callout📣Blue                                                    | 2.3.1           | 2.3.2        |
| `callout-success`  | quote block                 | callout✅Green                                                   | 2.3.1           | 2.3.2        |
|   `callout-todo`   | quote block                 | callout☑️Green                                                   | 2.3.1           | 2.3.2        |
| `callout-warning`  | quote block                 | callout⚠️Yellow                                                  | 2.3.1           | 2.3.2        |
| `av-no-add-entry`  | database block              | Hide database add entry button (add function works normally)     | 2.5.2           | 2.5.2        |
|  `av-no-add-view`  | database block              | Hide database add view button (add function works normally)      | 2.5.2           | 2.5.2        |

## Plugin fitness

It is recommended to disable the plugin compatibility switch when no corresponding plugin is installed to reduce the burden on theme loading.  
Currently adapted plugins are:

- Shortcut key panel(Category title color)
- Custom block Styles(fix display problem in embedded block caused by theme)
- Background Cover(By making the foreground transparent. Please set "foreground transparency" to 0 in the plugin settings to disable it, and enable the Blurring in settings(set to greater than 0))
- Math Enhancement Plugin(Limit plugin preview width)

<details>
<summary>In case of you want to know, this is the screenshot about using with Background Cover plugin</summary>
<img src="resources/readme_background_plugin.webp" alt="readme_background_plugin" />
</details>

## Snippests

- [CodeBlock show action buttons when hover](https://ld246.com/article/1728146248791) by JeffreyChen
- [Show pinned doc name(NO icon version)](https://ld246.com/article/1728392178095) by JeffreyChen
- [Fix the display position of the list sequence shadow](https://ld246.com/article/1749707279347/comment/1749718290195) by queguaiya

# Feedback

Bug report & Known issue: [Issue](https://github.com/emptylight370/siyuan-vscodelite-edit/issues)

Don't use GitHub & Can't visit Github?  
Please [email to me](mailto:1378990254@qq.com)(1378990254@qq.com).  
Or [join QQ channel](https://pd.qq.com/s/7uxvabgbp).  
Or [Liandi Forum](https://ld246.com/article/1728034766990).

# LICENSE

Follow origin repository [TinkMingKing/siyuan-themes-vscodelite](https://github.com/TinkMingKing/siyuan-themes-vscodelite) use GPL3.0 LICENSE

# Thanks

|                               Repository                               |                        Author                         |                                         Content                                         | License |
| :--------------------------------------------------------------------: | :---------------------------------------------------: | :-------------------------------------------------------------------------------------: | :-----: |
| [vscodelite](https://github.com/TinkMingKing/siyuan-themes-vscodelite) |    [TinkMingKing](https://github.com/TinkMingKing)    |                                          theme                                          | GPL3.0  |
|       [Savor](https://github.com/royc01/notion-theme/tree/main)        |          [royc01](https://github.com/royc01)          | Connect Siyuan API code (js)<br>Configuration file code(js)<br>list-level effects (css) |  None   |
| [SiYuan api](https://github.com/siyuan-note/siyuan/blob/master/API.md) |                   SiYuan Developers                   |                                      API interface                                      | AGPL3.0 |
|   [doctree modify](https://github.com/zxkmm/siyuan_doctree_compress)   |           [zxkmm](https://github.com/zxkmm)           |                           Document tree beautification ideas                            |   MIT   |
|        [Cliff-Dark](https://github.com/chenshinshi/Cliff-Dark)         | [Chensinshi](https://github.com/chenshinshi)&Crowds21 |                              Transparent background ideas                               |  None   |
