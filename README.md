# AP Microeconomics Graph Lab | AP微观经济学交互图表实验室

<div align="center">

An interactive AP Microeconomics modeling studio, bilingual learning lab, and dynamic exam practice platform aligned with the **College Board AP Microeconomics CED (2026–27)**.

面向高中生备考 AP 微观经济学考试的**交互式数理模型仿真、双语考点精解与动态真题演练平台**（对齐 College Board 2026–27 官方 CED 考纲）。

[English](#english) · [简体中文](#简体中文)

</div>

---

<a id="english"></a>

## English

### Overview

**AP Microeconomics Graph Lab** turns static AP Microeconomics diagrams into live mathematical models paired with bilingual explanations, guided inquiry activities, procedural question generation, and exam-style reference sheets.

- **CED Coverage**: Covers all **6 official AP Microeconomics Units** across **27 registered topics** (**23** Core AP Content, **2** Optional Extensions, **2** Not in Current AP Exam Scope), with **25 active interactive topics** powered by **19 distinct mathematical graph engines**.
- **Bilingual Switch & Global Search**: Instant switching between **English** and **Simplified Chinese (`中文`)**, plus a `⌘K` / `Ctrl+K` quick spotlight dictionary covering **123 AP Microeconomics terms & acronyms** (`MC`, `ATC`, `DWL`, `MRP`, `MFC`, etc.).
- **Precision SVG Graphing**: Multi-graph support (e.g., Perfect Competition Industry Market & Individual Firm side-by-side), interactive hover crosshairs, curve layer toggles with one-click **Show all curves**, Liang-Barsky boundary clipping (`clipPolylineToAxes`), anti-collision label placement, and automatic axis expansion (`resolveGraphDomain`) when key points, welfare polygons, or shifted curves extend beyond baseline limits.

### Key Modes

1. **Topic Library (`library`)**
   - Filterable catalog across Units 1–6, scope classification, and interactive readiness, jumping directly into topic-calibrated graph presets (`TOPIC_INITIAL_PARAMS`).
2. **Interactive Graph Lab (`graph`)**
   - Real-time sliders, toggles, scenario presets, shaded welfare regions (`CS`, `PS`, `DWL`, tax revenue, profit/loss rectangles), dynamic AP-style discrete cost/utility schedules, and instant metric cards.
3. **Prediction Learning (`learning`)**
   - **7 guided predict-first experiments** (e.g., PPC capital growth, simultaneous supply/demand shifts, binding price ceilings, lump-sum vs. per-unit taxes, first-degree price discrimination, monopsony minimum wage, and Pigouvian taxes).
4. **Practice MCQs & Mock Exam (`practice`)**
   - **13 curated classic MCQs** paired with **31 dynamic procedural question templates** across Units 1–6 that generate fresh numerical variants on demand.
   - Timed **Mock Exam Simulator** (`15 Q / 18 min`, `30 Q / 35 min`, `60 Q / 70 min`) with Question-by-Question Answer Review (`All` / `Missed` filter + direct Graph Lab links).
   - Built-in **Mistake Drill Notebook** tracking wrong/skipped questions with streak-based mastery progression (`consecutiveCorrect`) and similar-variant regeneration.
5. **Reference & Rules (`reference`)**
   - Bilingual **Core AP Formulas**, **AP Decision Rules** (`MR = MC`, `P < AVC` shutdown, `MRP = MFC`, etc.), **Common Exam Pitfalls**, official CED scope matrix, and full 123-term searchable glossary.

### Tech Stack

- **Frontend**: React 18, TypeScript 5.7, Vite 6
- **Styling & Icons**: Tailwind CSS 3, `clsx`, `tailwind-merge`, Lucide React
- **Deployment**: Static SPA build (`dist/`) ready for Cloudflare Pages via `wrangler`

### Project Structure

```text
src/
├── components/
│   ├── common/          # GlobalSearchModal (⌘K bilingual dictionary & jump navigation)
│   ├── graph/           # GraphContainer (SVG renderer), GraphControls, GraphResults, GraphWorkspace
│   ├── layout/          # Responsive Navbar & Footer
│   ├── modes/           # LearningMode, PracticeMode, ReferenceMode
│   └── registry/        # TopicLibrary, TopicCard
├── context/             # AppStateContext (routing, TOPIC_INITIAL_PARAMS, curve visibility)
├── data/                # topicRegistry, learningActivities, practiceQuestions, referenceContent, economicDictionary
├── engine/
│   ├── economicMath.ts  # Shared numerical solvers & geometry helpers
│   ├── graphDomain.ts   # Adaptive domain resolution preventing clipped points/areas
│   ├── generators/      # 31 dynamic procedural question templates (Units 1–6)
│   ├── models/          # 19 interactive economic model engines & registry
│   └── search/          # Acronym & bilingual terminology search engine
├── i18n/                # LanguageContext & EN/ZH translations
├── test/                # foundation.test.ts (26 automated audit suites + generator fuzzing)
└── types/               # TypeScript contracts for graphs, topics, learning & practice
```

### Getting Started

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Type-check
npx tsc --noEmit

# Run full audit suite (26 suites including 250-run fuzzing across all 31 generators)
npm test

# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy dist/ to Cloudflare Pages
npm run deploy
```

---

<a id="简体中文"></a>

## 简体中文

### 项目简介

**AP 微观经济学交互图表实验室（AP Microeconomics Graph Lab）** 是一套面向 AP 微观经济学考试的双语互动学习与演练平台，严格对齐 **College Board AP Microeconomics CED（2026–27）** 考纲体系。

- **考纲全覆盖**：完整收录 AP 微观经济学 **6 大官方单元**共 **27 个专题**（其中 **23** 个核心必考专题、**2** 个拓展专题、**2** 个非考纲参考专题），包含 **25 个激活交互专题**与 **19 个独立数理模型引擎**。
- **全双语与快捷检索**：支持 **中文 / English** 一键无刷新切换；按 `⌘K`（或 `Ctrl+K`）可呼出覆盖 **123 个高频术语与缩写**（如 `MC`、`ATC`、`DWL`、`MRP`、`MFC` 等）的全局检索弹窗并直达对应图表。
- **高精度 SVG 教学绘图**：支持双联联动视图（如完全竞争市场与厂商并排图）、鼠标悬停数据十字准星、单曲线图层显隐及 **显示全部曲线** 一键恢复、Liang-Barsky 边界裁剪（`clipPolylineToAxes`）、标签防碰撞排版，以及当关键点、福利阴影多边形或整条曲线越界时自动扩展坐标轴（`resolveGraphDomain`）。

### 五大核心模式

1. **考纲专题库（Topic Library）**
   - 支持按单元（U1–U6）、考纲范围与交互状态筛选，点击卡片即可加载对应专题预设参数（`TOPIC_INITIAL_PARAMS`）进入实验室。
2. **交互图表实验室（Graph Lab）**
   - 提供实时滑块、开关、经典场景预设（Presets）、福利阴影区域着色（消费者剩余 CS、生产者剩余 PS、无谓损失 DWL、税收、利润/亏损矩形）、AP 大题风格离散成本/效用表与关键指标结果卡片。
3. **预测探究模式（Prediction Learning）**
   - 内置 **7 个「先预测、再验证」引导式探究实验**，覆盖 PPC 资本增长、供求双移、有效价格上限、一次性税 vs 从量税、一级价格歧视、买方垄断最低工资及庇古税。
4. **真题演练模式（Practice MCQs）**
   - 包含 **13 道精选经典母题**与覆盖 Unit 1–6 的 **31 类动态题生成引擎**，支持一键生成数值不重复的新变式题。
   - 提供定时**全真模拟考**（`15 题 / 18 分钟`、`30 题 / 35 分钟`、`60 题 / 70 分钟`），交卷后自动归档错题并支持按全部/错题筛选进行逐题复盘与关联图表跳转。
   - 内置**智能错题本（Mistake Drill）**，支持连对次数追踪（`consecutiveCorrect`）、答错清零重练与同类变式题巩固。
5. **速查与考点精解（Reference & Rules）**
   - 汇总核心公式表、AP 经济学决策法则（如 `MR = MC`、`P < AVC` 停产准则、`MRP = MFC`）、常见考官失分陷阱、CED 考纲分级对照表以及完整 123 词条双语词汇表。

### 技术栈

- **前端框架**：React 18、TypeScript 5.7、Vite 6
- **样式与图标**：Tailwind CSS 3、`clsx`、`tailwind-merge`、Lucide React
- **部署发布**：纯前端静态产物构建（`dist/`），支持通过 `wrangler` 部署至 Cloudflare Pages

### 目录结构

```text
src/
├── components/
│   ├── common/          # GlobalSearchModal（⌘K 双语词典检索与跳转）
│   ├── graph/           # GraphContainer（SVG 渲染）、GraphControls、GraphResults、GraphWorkspace
│   ├── layout/          # 响应式 Navbar 与 Footer
│   ├── modes/           # LearningMode、PracticeMode、ReferenceMode
│   └── registry/        # TopicLibrary、TopicCard
├── context/             # AppStateContext（视图路由、专题预设 TOPIC_INITIAL_PARAMS、曲线显隐状态）
├── data/                # 专题目录、探究实验、经典题库、速查内容与 123 条双语词典
├── engine/
│   ├── economicMath.ts  # 通用数值求解与几何辅助函数
│   ├── graphDomain.ts   # 自适应坐标域扩展（防止关键点与福利阴影区被裁切）
│   ├── generators/      # 31 个动态题生成器（Unit 1–6）
│   ├── models/          # 19 个经济模型计算引擎与注册表
│   └── search/          # 缩写与中英文概念搜索引擎
├── i18n/                # LanguageContext 与中英文翻译表
├── test/                # foundation.test.ts（26 套自动化审计 + 题库 Fuzz 测试）
└── types/               # 图表、专题与练习模块 TypeScript 类型定义
```

### 本地开发与测试命令

```bash
# 安装依赖
npm install

# 启动本地开发服务器
npm run dev

# TypeScript 类型检查
npx tsc --noEmit

# 运行全套自动化审计（26 套测试，含 31 个动态题生成器各 250 次 Fuzz 测试）
npm test

# 构建生产环境静态包
npm run build

# 本地预览生产包
npm run preview

# 构建并发布至 Cloudflare Pages
npm run deploy
```
