# Python Numerical Computation 项目指南

本仓库整理 SCAU《数值计算》课程 OJ 实验题目，并用于 Python 解答。

## 题目结构

- 题目目录按 OJ 层级组织，所有目录名使用英文：`Experiment {编号}/{题号} {English Title}/`。
- 每题使用 `problem.md` 保存可读题面，`problem.json` 保存各段原始 HTML、文本及不含临时访问参数的 OJ 来源链接。
- 保留 OJ 原文、公式、样例和提示；不要擅自修正题面中的拼写或格式。
- Python 解答放在同题目录下的 `main.py`，运行方式为 `python main.py`。

## 当前 OJ 范围

来源路径为“实验 → 数值计算 → 数值计算实验”。九个实验节点及 pid 见 README.md。当前已归档 9 道题目原文，Python 解答尚未添加。

## 抓取工具

`tools/crawl_numerical_experiments.mjs` 使用已登录浏览器和 CDP Proxy 串行读取上述九个实验节点，并保存到英文目录。运行前设置 `CDP_PROXY_URL`，并传入 mainMenu 页面 target ID：

```powershell
$env:CDP_PROXY_URL = Read-Host "CDP Proxy URL"
$targetId = Read-Host "mainMenu target ID"
node tools/crawl_numerical_experiments.mjs $targetId
```

抓取时每次页面加载后等待 5 秒；保存到仓库的 OJ 来源链接不包含临时访问参数。脚本只读取题面，不会提交代码。
