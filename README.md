# Python Numerical Computation

SCAU《数值计算》课程 OJ 实验题目归档与 Python 解答。

## 当前范围

本仓库整理 OJ“实验 → 数值计算 → 数值计算实验”中的 9 道题目。当前保存题面原文，尚未添加 Python 解答。

| OJ 实验 | pid | 题号 | 题目 |
|---------|-----|------|------|
| 数值计算实验1.1 | 1452 | 18957 | 计算自然对数 ln(x) 的导数 |
| 数值计算实验1.2 | 1501 | 18991 | 调和级数求和 |
| 数值计算实验2.1 | 1503 | 18996 | 求正弦函数值 |
| 数值计算实验2.2 | 1505 | 18997 | 求余弦函数值 |
| 数值计算实验3.1 | 1507 | 18998 | 求对数函数值 ln(x) |
| 数值计算实验3.2 | 1509 | 18999 | 求指数函数值 exp(x) |
| 数值计算实验4 | 1512 | 19000 | 二分法解非线性方程 |
| 数值计算实验5 | 1514 | 19001 | 黄金分割求函数最小值 |
| 数值计算实验6 | 1516 | 19020 | 选列主元约当消元法求线性方程组唯一解 |

## 目录结构

题目按 OJ 实验节点和题号归档，目录名使用英文：

```text
Experiment 1.1/
└── 18957 Derivative of Natural Logarithm ln(x)/
    ├── problem.md
    └── problem.json
```

- `problem.md` 提供便于阅读的题面。
- `problem.json` 保存题目各段原始 HTML 和文本，以及不含临时访问参数的 OJ 来源链接。
- Python 解答放在同题目录的 `main.py`，从仓库根目录运行。

## 文档

- [Python 解答规范](./docs/代码规范.md)
- [OJ 访问与抓取指南](./docs/OJ-访问指南.md)
- [数值计算提交注意事项](./docs/OJ提交易错点总结.md)

## 重新读取 OJ 题目

准备已登录 OJ 的浏览器页面并连接 CDP Proxy，从页面列表取得 mainMenu 页面 ID。然后在 PowerShell 中从仓库根目录运行：

```powershell
$env:CDP_PROXY_URL = Read-Host "CDP Proxy URL"
$targetId = Read-Host "mainMenu target ID"
node tools/crawl_numerical_experiments.mjs $targetId
```

脚本串行读取九个实验节点，每次页面加载后等待 5 秒，只读取题面，不会向 OJ 提交代码。请勿将浏览器会话信息、临时访问参数或个人机器路径写入仓库。
