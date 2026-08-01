# VSCode Lite Edit

[![GitHub Release Date](https://img.shields.io/github/release-date/emptylight370/siyuan-vscodelite-edit?display_date=published_at)](https://github.com/emptylight370/siyuan-vscodelite-edit/releases/latest)
[![GitHub Release](https://img.shields.io/github/v/release/emptylight370/siyuan-vscodelite-edit)](https://github.com/emptylight370/siyuan-vscodelite-edit/releases/latest)
[![GitHub issue custom search in repo](https://img.shields.io/github/issues-search/emptylight370/siyuan-vscodelite-edit?query=state%3Aopen%20label%3A%22help%20wanted%22&label=Issues%20need%20help&labelColor=%23112E32)](https://github.com/emptylight370/siyuan-vscodelite-edit/issues?q=is%3Aissue%20state%3Aopen%20label%3A%22help%20wanted%22)
[![GitHub Repo stars](https://img.shields.io/github/stars/emptylight370/siyuan-vscodelite-edit)](https://github.com/emptylight370/siyuan-vscodelite-edit)

> [!WARNING]
> 主题3.0.0及以上版本适配思源3.7.0，旧版本思源请自行下载安装2.x版本主题。

从VSCode Lite脱胎而来，进一步美化界面。

使用暗色模式测试，预计明亮模式没有问题。

如果出现显示错误请重新加载思源。

原作者：[TinkMingKing](https://github.com/TinkMingKing)

使用说明：[链滴](https://ld246.com/article/1728034766990)
配置说明：[GitHub](https://github.com/emptylight370/siyuan-vscodelite-edit/blob/scss/Configure.md)

# 特性

- 各级标题样式（进一步调整）
- 微调布局及配色
- 个性化改动
- 调整代码块
- 表格显示效果
- 适配部分插件
- 限制嵌入块显示高度（可手动关闭）
- 多级列表序号样式
- 配置编辑页面
- 文档树和大纲缩进
- 调整高亮标注样式
- 双标签栏，可将钉住标签页单独一行显示
- 打字机模式，将光标所在块居中显示

# 配置

目前可以使用标题栏上的`VC`按钮编辑配置文件。

受配置加载方式限制，新版本更新的配置需要在配置面板手动启用。这样不会丢失之前的配置数据。

# 更新日志

> 完整更新日志查看[changelog](https://github.com/emptylight370/siyuan-vscodelite-edit/blob/scss/changelog.md)
> 提交历史日志查看[whatschange](https://github.com/emptylight370/siyuan-vscodelite-edit/blob/scss/whatschange.md)

- v3.0.12
  - 适配大纲渲染块引用样式
  - 适配大纲渲染标签样式
  - 适配大纲渲染标记样式
  - 修复标题图标因标题字数增加缩小问题
  - 修复导出预览模式中部分情况下标题显示问题
  - 优化打字机模式
  - 修复集市返回按钮消失问题
  - 修复集市样式
  - 高亮集市统计数字
- v3.0.11
  - 适配标题序号
  - 适配文档前数据库页签
  - 修复导出PDF报错
- v3.0.9
  - 暂时禁用文档树缩进线
  - 在通过标题、图标展开收起文档树时，在可点击打开文档处显示特殊光标。需在主题设置中启用
  - 优化打字机模式

# 特殊适配

## 自定义属性

![readme_custom_attribute](resources/readme_custom_attribute.webp)

### 启用方法

在块或文档的**自定义属性面板**中新增`vsce`属性，在其中填入一个或多个有效的属性值。若使用多个属性值，需以空格分隔。

> [!IMPORTANT]
> 因为思源官方发布了[Callout block(提示块)](https://github.com/siyuan-note/siyuan/issues/16051)（[发布链接](https://ld246.com/article/1765878002926)），主题在之前的版本已经移除自行实现的引述块Callout样式。现在，你可以根据[此文档](https://ld246.com/article/1765879590836)进行迁移操作。

### 可用属性值

|    可用属性值     | 使用范围     | 使用效果                               | 最低支持 | 最近更新 |
| :---------------: | ------------ | -------------------------------------- | -------- | -------- |
|     `no-tag`      | 文档或内容块 | 禁用所选范围中的段落内标签样式         | 2.3.0    | 2.3.0    |
|    `mark-hide`    | 文档或段落块 | 标记挖空，隐藏标记文本，鼠标悬浮显示   | 2.3.8    | 2.3.8    |
|    `table-min`    | 表格块       | 强制使用最小列宽，不影响手动设定       | 2.3.0    | 2.3.0    |
|    `no-thead`     | 表格块       | 禁用表头(`<thead>`)的颜色和居中对齐    | 2.3.0    | 2.3.0    |
|   `hide-thead`    | 表格块       | 视觉上隐藏表头元素                     | 2.5.0    | 2.5.0    |
| `av-no-add-entry` | 数据库块     | 隐藏数据库添加条目按钮（添加功能正常） | 2.5.2    | 2.6.2    |
| `av-no-add-view`  | 数据库块     | 隐藏数据库添加视图按钮（添加功能正常） | 2.5.2    | 2.5.2    |
| `av-no-main-key`  | 数据库块     | 隐藏数据库主键                         | 3.0.0    | 3.0.0    |

## 插件适配

插件适配开关没有安装对应插件时候建议关闭，减轻主题加载负担。  
目前已适配的插件有：

- 快捷键面板（分类标题颜色）
- 自定义块样式（修复由主题造成的嵌入块中自定义块显示问题）
- 替换背景图片（通过覆写部分插件设置实现，相关设置不生效属正常现象）
- 数学增强插件（限制插件预览宽度）

<details>
<summary>如果你想看，这里是和替换背景图片插件一起使用的效果</summary>
<img src="resources/readme_background_plugin.webp" alt="readme_background_plugin" />
</details>

## 代码片段

- [代码块悬浮显示操作按钮](https://ld246.com/article/1728146248791) by JeffreyChen
- [显示钉住文档名（无图标版本）](https://ld246.com/article/1728392178095) by JeffreyChen
- [修正列表序号阴影显示位置](https://ld246.com/article/1749707279347/comment/1749718290195) by queguaiya

# 反馈

反馈问题和已知问题：[Issue](https://github.com/emptylight370/siyuan-vscodelite-edit/issues)。

不使用GitHub或无法访问？  
[发邮件](mailto:1378990254@qq.com)（1378990254@qq.com）。  
或者[加入QQ频道](https://pd.qq.com/s/7uxvabgbp)。  
或者[链滴社区](https://ld246.com/article/1728034766990)。

支持开发：[链接](https://blog.emptylight.cn/sponsor)

# 许可证

跟随上级储存库[TinkMingKing/siyuan-themes-vscodelite](https://github.com/TinkMingKing/siyuan-themes-vscodelite)使用GPL3.0协议

# 感谢

|                                  存储库                                   |                         作者                          |                             内容                             | 许可证  |
| :-----------------------------------------------------------------------: | :---------------------------------------------------: | :----------------------------------------------------------: | :-----: |
|  [vscodelite](https://github.com/TinkMingKing/siyuan-themes-vscodelite)   |    [TinkMingKing](https://github.com/TinkMingKing)    |                            原主题                            | GPL3.0  |
|         [Savor](https://github.com/royc01/notion-theme/tree/main)         |          [royc01](https://github.com/royc01)          | 连接思源API代码(js)<br>配置文件代码(js)<br>列表层级效果(css) |   无    |
| [思源api](https://github.com/siyuan-note/siyuan/blob/master/API_zh_CN.md) |                      思源开发者                       |                           API接口                            | AGPL3.0 |
|     [文档树自定义](https://github.com/zxkmm/siyuan_doctree_compress)      |           [zxkmm](https://github.com/zxkmm)           |                        文档树美化思路                        |   MIT   |
|          [Cliff-Dark](https://github.com/chenshinshi/Cliff-Dark)          | [Chensinshi](https://github.com/chenshinshi)&Crowds21 |                         背景透明思路                         |   无    |
