# SCAU OJ 访问与题目抓取

本指南说明如何使用仓库中的抓取脚本归档“数值计算 → 数值计算实验”题面。

## 准备浏览器

1. 在浏览器中登录 OJ，并打开包含实验菜单的页面。
2. 启动并连接 CDP Proxy。
3. 从 Proxy 的页面列表中找到该菜单页的 target ID。

登录凭据和浏览器会话由本机浏览器管理，不需要写入仓库。

## 运行抓取脚本

在仓库根目录打开 PowerShell，输入 Proxy 地址和菜单页 target ID：

```powershell
$env:CDP_PROXY_URL = Read-Host "CDP Proxy URL"
$targetId = Read-Host "mainMenu target ID"
node tools/crawl_numerical_experiments.mjs $targetId
```

脚本按 README.md 中列出的九个实验节点串行读取题面，每次页面加载后等待 5 秒。每道题会生成 `problem.md` 和 `problem.json`；来源 URL 会移除临时访问参数。脚本只读取 OJ 页面，不提交代码。

## 检查归档结果

完成后，对照 README.md 的题号表检查题目目录。阅读题面时以 OJ 原文为准；发现格式或内容需要更新时，重新抓取并核对生成文件。

请将 CDP Proxy 地址作为运行时环境变量提供。不要在仓库中保存 Cookie、访问令牌、浏览器会话标识或带临时参数的 URL。
