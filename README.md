# 开发者知识库

> 一个离线可用的开发者知识库：433+ 前后端框架与工具、AI 大模型评测、DevOps 教程、学习路径与 AI 术语百科，附带 ECharts 数据可视化、收藏、对比与全文搜索。

单页静态应用（无后端），构建后可直接部署到任意静态托管（默认使用 GitHub Pages）。

## ✨ 功能

- **433+ 条目**：25 个框架/工具分类 + 8 款 AI 大模型评测 + 77 个 AI 术语 + DevOps 教程 + 学习路径
- **10 张 ECharts 图表**：GitHub 星标 TOP、评级雷达、增长趋势、分类占比、热度散点、AI 能力雷达、价格对比、SWE-bench 等
- **模块化导航**：前端 / 后端 / AI 工程 / 教程 / 可视化，一个模块一个界面
- **收藏与对比**：心形收藏、2–4 工具横向对比，状态持久化到 `localStorage`
- **搜索与筛选**：即时全文搜索（`/` 或 `Ctrl+K` 聚焦）、URL 参数同步（`#q=`）
- **深色/浅色主题**：跟随系统 + 手动切换，持久化
- **PWA 离线**：Service Worker 缓存，可安装到桌面
- **数据自动更新**：`scripts/fetch-github-data.cjs` 从 GitHub API 拉取真实星标/活跃度

## 🧱 技术栈

- **Vite 5**（构建）+ 原生 JavaScript（无框架、无运行时依赖）
- **ECharts**（数据可视化）
- **Playwright**（端到端测试）
- **PWA**（`manifest.json` + Service Worker）

## 🚀 快速开始

需要 Node.js ≥ 18。

```bash
# 安装依赖
npm install

# 本地开发（http://localhost:3000）
npm run dev

# 生产构建（输出到 dist/）
npm run build

# 端到端测试
npx playwright install chromium
npm test
```

## 📁 目录结构

```
dev-knowledge-base/
├── dev-knowledge-base.html   页面入口（单页）
├── assets/                   业务代码与数据
│   ├── app.js                渲染 / 搜索 / 筛选 / 收藏 / 对比
│   ├── charts.js             ECharts 图表
│   ├── data.js               框架与工具数据
│   ├── data-ext.js           AI 模型 / 教程 / 术语数据
│   └── enhanced-ux.js        动效增强
├── _shared/                  字体与第三方库（echarts）
├── scripts/                  GitHub 数据抓取
├── tests/e2e/                Playwright 测试
├── sw.js / manifest.json     PWA
└── vite.config.js            构建配置
```

## 📄 License

[MIT](LICENSE)。数据来源于各项目官方仓库与厂商公告，版权归原作者所有。
