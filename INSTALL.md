# ChatStyle 插件安装指南

## 自动安装（推荐）

1. 打开 Obsidian
2. 进入 设置 → 第三方插件
3. 关闭安全模式
4. 点击"浏览社区插件"
5. 搜索"ChatStyle"
6. 点击安装并启用

## 手动安装

1. 下载最新版本的插件文件
2. 将文件解压到你的 Obsidian vault 的 `.obsidian/plugins/chatstyle/` 目录下
3. 重启 Obsidian
4. 在设置中启用 ChatStyle 插件

## 文件结构

安装后，你的插件目录应该包含以下文件：

```
.obsidian/plugins/chatstyle/
├── main.js
├── manifest.json
├── styles.css
└── README.md
```

## 验证安装

1. 创建一个新的 Markdown 文件
2. 插入以下测试代码：

```chat
@小明
@小红

1小明:你好！
2小红:你好，小明！
```

3. 切换到预览模式，应该能看到聊天界面

## 故障排除

### 插件无法加载
- 检查文件是否正确放置在插件目录中
- 确保 manifest.json 文件存在且格式正确
- 重启 Obsidian

### 聊天界面不显示
- 确保使用了正确的代码块语法 ```chat
- 检查聊天格式是否符合语法要求
- 查看开发者控制台是否有错误信息

### 样式显示异常
- 检查是否有其他插件或主题冲突
- 尝试禁用其他插件测试
- 重置插件设置到默认值

## 获取帮助

如果遇到问题，请：
1. 查看 README.md 中的使用说明
2. 检查 GitHub Issues 页面
3. 提交新的 Issue 描述问题