# VSCode Lite Edit

![GitHub Release Date](https://img.shields.io/github/release-date/lingfengyu-dreaming/siyuan-vscodelite-edit?display_date=published_at)
![GitHub Release](https://img.shields.io/github/v/release/lingfengyu-dreaming/siyuan-vscodelite-edit)
![GitHub Repo stars](https://img.shields.io/github/stars/lingfengyu-dreaming/siyuan-vscodelite-edit)


从VSCode Lite脱胎而来，进一步美化界面。

使用暗色模式测试，预计明亮模式没有问题。

如果出现显示错误请重新加载思源。

原作者：[TinkMingKing](https://github.com/TinkMingKing)

# 特性

- 各级标题样式（进一步调整）
- 微调布局及配色
- 个性化改动
- 调整代码块
- 表格显示效果
- 适配部分插件
- 限制嵌入块显示高度（可手动关闭）
- 多级序号样式
- 配置编辑页面
- 文档树和大纲缩进

# 配置

目前可以使用标题栏上的`VC`按钮编辑配置文件。

受配置加载方式限制，新版本更新的配置需要在配置面板手动启用。这样不会丢失之前的配置数据。

# 更新日志

> 完整更新日志查看[changelog](https://github.com/lingfengyu-dreaming/siyuan-vscodelite-edit/blob/main/changelog.md)

- V1.4.0
  - 适配替换背景图片插件（需要关闭插件设置中前景透明度）
- V1.3.5
  - 更新说明文档
  - 调整文档树部分样式
  - 尝试适配自定义背景情况（dock）
  - 尝试禁用移动端编辑器滚动条
- V1.3.4
  - 新增文档树和大纲缩进（可能和插件冲突）

# 插件适配

目前已适配的插件有：

- 快捷键面板（分类标题颜色）
- 自定义块样式（修复由主题造成的嵌入块中自定义块显示问题）
- 替换背景图片（通过让前景透明实现，请关闭插件设置中的前景透明度）

# 反馈

反馈问题和已知问题：[Issue](https://github.com/lingfengyu-dreaming/siyuan-vscodelite-edit/issues)。

不使用GitHub或无法访问？  
[发邮件](mailto:1378990254@qq.com)（1378990254@qq.com）。  
或者[加入QQ频道](https://pd.qq.com/s/7uxvabgbp)。

# 许可证

跟随上级储存库[TinkMingKing/siyuan-themes-vscodelite](https://github.com/TinkMingKing/siyuan-themes-vscodelite)使用GNU3.0协议

# 感谢

|                                  存储库                                   |                         作者                          |                   内容                   | 许可证  |
| :-----------------------------------------------------------------------: | :---------------------------------------------------: | :--------------------------------------: | :-----: |
|  [vscodelite](https://github.com/TinkMingKing/siyuan-themes-vscodelite)   |    [TinkMingKing](https://github.com/TinkMingKing)    |                  原主题                  | GNU3.0  |
|         [Savor](https://github.com/royc01/notion-theme/tree/main)         |          [royc01](https://github.com/royc01)          | 连接思源API代码(js)<br>列表层级效果(css) |   无    |
| [思源api](https://github.com/siyuan-note/siyuan/blob/master/API_zh_CN.md) |                      思源开发者                       |                 API代码                  | AGPL3.0 |
|     [文档树自定义](https://github.com/zxkmm/siyuan_doctree_compress)      |           [zxkmm](https://github.com/zxkmm)           |              文档树美化思路              |   MIT   |
|          [Cliff-Dark](https://github.com/chenshinshi/Cliff-Dark)          | [Chensinshi](https://github.com/chenshinshi)&Crowds21 |               背景透明思路               |   无    |