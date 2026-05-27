# StockScan Web

AI 驱动的股票投资快速分析工具。基于 Claude + StockScan Skill，对指定股票执行 6 步结构化分析：模式识别 → 财务体检 → 估值定位 → 趋势判断 → 交叉验证 → 操作参考。

## 功能

- **左侧历史面板**：记录所有分析历史，点击可回看
- **股票输入**：支持中文名称、股票代码、英文名称
- **6 步分析结果**：结构化展示，每步有数据锚点
- **移动端适配**：手机浏览器可直接访问

## 技术栈

- Next.js 14 (App Router)
- React + TypeScript
- Tailwind CSS
- Claude API

## 本地开发

```bash
# 安装依赖
npm install

# 配置 API Key
cp .env.local.example .env.local
# 编辑 .env.local，填入你的 Anthropic API Key

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

## 部署

### Vercel（推荐）

1. 将代码推送到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量 `ANTHROPIC_API_KEY`
4. 自动部署

### 环境变量

| 变量 | 说明 | 必填 |
|------|------|------|
| `ANTHROPIC_API_KEY` | Anthropic API Key | 是 |

## 免责声明

本工具仅供信息参考，不构成投资建议。
