export type Language = 'en' | 'zh';

export interface Translations {
  // Brand & Navigation
  brandTitle: string;
  brandSubtitle: string;
  navTopicLibrary: string;
  navGraphLab: string;
  navPracticeMode: string;
  navReferenceGlossary: string;
  langSwitchButton: string; // "中文" or "English"
  cedAlignmentBadge: string;
  officialCedYear: string;

  // Search & Filter
  searchPlaceholder: string;
  filterByUnit: string;
  allUnits: string;
  filterByScope: string;
  allScopes: string;
  filterByStatus: string;
  allStatuses: string;
  clearFilters: string;
  topicsFound: string;
  noTopicsFoundTitle: string;
  noTopicsFoundDesc: string;

  // Scope Classifications
  scopeCore: string;
  scopeCoreDesc: string;
  scopeExtension: string;
  scopeExtensionDesc: string;
  scopeExcluded: string;
  scopeExcludedDesc: string;

  // Status Classifications
  statusReady: string;
  statusPlanned: string;
  statusReference: string;

  // Graph Workspace
  workspaceTitle: string;
  workspaceSubtitle: string;
  backToLibrary: string;
  controlsPanelTitle: string;
  resultsPanelTitle: string;
  insightsPanelTitle: string;
  presetScenarios: string;
  defaultScenario: string;
  resetToDefaults: string;
  graphVisibilityToggle: string;
  showSurplusAreas: string;
  showEquilibriumPoints: string;
  showGridLines: string;
  curveLegend: string;

  // Modes
  modeLearning: string;
  modeLearningDesc: string;
  modePractice: string;
  modePracticeDesc: string;
  modePracticeComingSoonTitle: string;
  modePracticeComingSoonDesc: string;
  modeReference: string;
  modeReferenceDesc: string;

  // Common UI Actions
  openGraph: string;
  exploreModel: string;
  viewDetails: string;
  close: string;
  unit: string;
  officialRefLabel: string;
  keyTerminology: string;
  primaryCurvesLabel: string;
  examWeightLabel: string;
  disclaimerText: string;
  stageBadge: string;

  // Common Economics Terms
  price: string;
  quantity: string;
  equilibriumPrice: string;
  equilibriumQuantity: string;
  demand: string;
  supply: string;
  consumerSurplus: string;
  producerSurplus: string;
  totalSurplus: string;
  deadweightLoss: string;
  marginalCost: string;
  marginalRevenue: string;
  averageTotalCost: string;
  averageVariableCost: string;
  averageFixedCost: string;
  taxRevenue: string;
  taxIncidence: string;
  consumerBurden: string;
  producerBurden: string;
  opportunityCost: string;
  productiveEfficiency: string;
  allocativeEfficiency: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Brand & Navigation
    brandTitle: 'AP Microeconomics Graph Lab',
    brandSubtitle: 'Interactive Model Simulator & CED Aligned Visual Studio',
    navTopicLibrary: 'CED Topic Library',
    navGraphLab: 'Interactive Graph Lab',
    navPracticeMode: 'Practice Mode',
    navReferenceGlossary: 'Reference & Glossary',
    langSwitchButton: '中文', // When in English, show Chinese toggle
    cedAlignmentBadge: 'AP CED 2026–27 Aligned',
    officialCedYear: 'College Board AP Microeconomics Framework',

    // Search & Filter
    searchPlaceholder: 'Search topics, formulas, curves (e.g. DWL, PPC, Tax, MR=MC)...',
    filterByUnit: 'Filter by Unit',
    allUnits: 'All Units (1–6)',
    filterByScope: 'Scope Classification',
    allScopes: 'All Scopes',
    filterByStatus: 'Interactive Status',
    allStatuses: 'All Statuses',
    clearFilters: 'Reset Filters',
    topicsFound: 'topics available',
    noTopicsFoundTitle: 'No Matching AP Topics Found',
    noTopicsFoundDesc: 'Try adjusting your search keywords, clearing unit filters, or selecting "All Scopes".',

    // Scope Classifications
    scopeCore: 'Core AP Content',
    scopeCoreDesc: 'Directly tested on AP Microeconomics Exams (FRQ & MCQ)',
    scopeExtension: 'Optional Extension',
    scopeExtensionDesc: 'Advanced microeconomic analysis, honors concepts, and college micro',
    scopeExcluded: 'Not in Current AP Exam Scope',
    scopeExcludedDesc: 'Clarification: Excluded from AP Micro or exclusive to AP Macro',

    // Status Classifications
    statusReady: 'Interactive Ready',
    statusPlanned: 'Planned for Part 2',
    statusReference: 'Reference Only',

    // Graph Workspace
    workspaceTitle: 'Interactive Graph Workspace',
    workspaceSubtitle: 'Real-time mathematical simulations with dynamic welfare calculation',
    backToLibrary: '← Back to Topic Library',
    controlsPanelTitle: 'Model Parameters & Controls',
    resultsPanelTitle: 'Real-Time Economic Calculations',
    insightsPanelTitle: 'Economic Intuition & CED Insights',
    presetScenarios: 'Preset Scenarios',
    defaultScenario: 'Default Baseline',
    resetToDefaults: 'Reset to Defaults',
    graphVisibilityToggle: 'Layer Controls',
    showSurplusAreas: 'Show Welfare Shading (CS, PS, DWL)',
    showEquilibriumPoints: 'Show Equilibrium Drop Lines',
    showGridLines: 'Show Plot Grid',
    curveLegend: 'Curve Legend',

    // Modes
    modeLearning: 'Learning Mode',
    modeLearningDesc: 'Visual exploration with real-time sliders and step-by-step economic guidance.',
    modePractice: 'Practice Mode',
    modePracticeDesc: 'Interactive challenge questions, scenario drills, and FRQ graphing practice.',
    modePracticeComingSoonTitle: 'Practice Mode Foundation Ready (Part 3)',
    modePracticeComingSoonDesc: 'The underlying calculation engine and state preservation are established. Full interactive AP question drills, FRQ checks, and self-quizzes will be activated in Part 3.',
    modeReference: 'CED Reference & Scope',
    modeReferenceDesc: 'Official College Board course structure, unit weightings, and scope boundaries.',

    // Common UI Actions
    openGraph: 'Launch Graph Lab',
    exploreModel: 'Explore Model',
    viewDetails: 'View Topic Details',
    close: 'Close',
    unit: 'Unit',
    officialRefLabel: 'Official CED Reference',
    keyTerminology: 'Key AP Terminology',
    primaryCurvesLabel: 'Key Curves',
    examWeightLabel: 'Exam Weight',
    disclaimerText: 'Designed for high school students preparing for the AP Microeconomics exam. Based on the official College Board Course and Exam Description.',
    stageBadge: 'Part 1: Foundation & Bilingual System Active',

    // Common Economics Terms
    price: 'Price (P)',
    quantity: 'Quantity (Q)',
    equilibriumPrice: 'Equilibrium Price (P*)',
    equilibriumQuantity: 'Equilibrium Quantity (Q*)',
    demand: 'Demand (D)',
    supply: 'Supply (S)',
    consumerSurplus: 'Consumer Surplus (CS)',
    producerSurplus: 'Producer Surplus (PS)',
    totalSurplus: 'Total Social Surplus',
    deadweightLoss: 'Deadweight Loss (DWL)',
    marginalCost: 'Marginal Cost (MC)',
    marginalRevenue: 'Marginal Revenue (MR)',
    averageTotalCost: 'Average Total Cost (ATC)',
    averageVariableCost: 'Average Variable Cost (AVC)',
    averageFixedCost: 'Average Fixed Cost (AFC)',
    taxRevenue: 'Government Tax Revenue',
    taxIncidence: 'Tax Incidence Distribution',
    consumerBurden: 'Consumer Tax Burden',
    producerBurden: 'Producer Tax Burden',
    opportunityCost: 'Opportunity Cost',
    productiveEfficiency: 'Productive Efficiency',
    allocativeEfficiency: 'Allocative Efficiency'
  },

  zh: {
    // Brand & Navigation
    brandTitle: 'AP 微观经济学交互图表实验室',
    brandSubtitle: '实时数理模型仿真与 CED 考纲可视化系统',
    navTopicLibrary: '考点知识库',
    navGraphLab: '交互图表实验室',
    navPracticeMode: '练习模式',
    navReferenceGlossary: '考纲索引与词汇表',
    langSwitchButton: 'English', // When in Chinese, show English toggle
    cedAlignmentBadge: '对齐 AP CED 2026–27 考纲',
    officialCedYear: '美国大学理事会 College Board 官方框架',

    // Search & Filter
    searchPlaceholder: '搜索考点、公式、曲线（如 无谓损失、PPC、消费税、MR=MC）...',
    filterByUnit: '按单元筛选',
    allUnits: '全部单元（1–6）',
    filterByScope: '考纲范围分类',
    allScopes: '全部考纲范围',
    filterByStatus: '交互实现状态',
    allStatuses: '全部状态',
    clearFilters: '重置筛选',
    topicsFound: '个相关考点',
    noTopicsFoundTitle: '未找到匹配的 AP 微观考点',
    noTopicsFoundDesc: '请尝试更换搜索关键词、清空单元筛选，或选择“全部考纲范围”。',

    // Scope Classifications
    scopeCore: '核心 AP 考纲考点',
    scopeCoreDesc: 'AP 微观经济学考试必考核心模型（选择题与大题 FRQ）',
    scopeExtension: '选学拓展考点',
    scopeExtensionDesc: '高阶微观分析、荣誉课程及大学先修拓展概念',
    scopeExcluded: '非当前 AP 考纲范围',
    scopeExcludedDesc: '官方考纲澄清：已从微观考纲移除或属于 AP 宏观专属内容',

    // Status Classifications
    statusReady: '已实现可交互',
    statusPlanned: '计划在第二阶段实现',
    statusReference: '仅作参考对比',

    // Graph Workspace
    workspaceTitle: '交互式图表工作台',
    workspaceSubtitle: '严谨经济学数学建模与实时社会福利计算',
    backToLibrary: '← 返回考点库',
    controlsPanelTitle: '模型参数与控制面板',
    resultsPanelTitle: '实时经济学数理计算',
    insightsPanelTitle: '经济学直觉与考纲解析',
    presetScenarios: '预设经济情境',
    defaultScenario: '基准状态',
    resetToDefaults: '恢复默认值',
    graphVisibilityToggle: '图层显隐控制',
    showSurplusAreas: '显示福利阴影（CS、PS、DWL）',
    showEquilibriumPoints: '显示均衡点投影辅助虚线',
    showGridLines: '显示坐标网格',
    curveLegend: '图例说明',

    // Modes
    modeLearning: '学习模式',
    modeLearningDesc: '通过实时滑块调节与分步引导直观理解经济学规律。',
    modePractice: '练习模式',
    modePracticeDesc: '交互式情境练习、图表推导挑战与 AP FRQ 画图演练。',
    modePracticeComingSoonTitle: '练习模式底层架构已就绪（将在第三阶段激活）',
    modePracticeComingSoonDesc: '实时计算引擎与双语状态基础设施已构建完毕。完整的 AP 真题式交互推演、FRQ 自测判分将在第三阶段全面接入。',
    modeReference: 'CED 考纲索引与范围',
    modeReferenceDesc: 'College Board 官方单元结构、考试占比权重及范围边界说明。',

    // Common UI Actions
    openGraph: '进入交互实验室',
    exploreModel: '探索此模型',
    viewDetails: '查看考点详情',
    close: '关闭',
    unit: '单元',
    officialRefLabel: '官方 CED 考点出处',
    keyTerminology: '核心 AP 术语对照',
    primaryCurvesLabel: '主要曲线',
    examWeightLabel: '考试占比',
    disclaimerText: '专为备考 AP 微观经济学的高中生量身设计，内容严格遵照美国大学理事会（College Board）官方课程与考试大纲（CED）。',
    stageBadge: '第一阶段：基础架构与完整双语系统已就绪',

    // Common Economics Terms
    price: '价格（P）',
    quantity: '数量（Q）',
    equilibriumPrice: '均衡价格（P*）',
    equilibriumQuantity: '均衡数量（Q*）',
    demand: '需求（D）',
    supply: '供给（S）',
    consumerSurplus: '消费者剩余（CS）',
    producerSurplus: '生产者剩余（PS）',
    totalSurplus: '总社会经济剩余',
    deadweightLoss: '无谓损失（DWL）',
    marginalCost: '边际成本（MC）',
    marginalRevenue: '边际收益（MR）',
    averageTotalCost: '平均总成本（ATC）',
    averageVariableCost: '平均可变成本（AVC）',
    averageFixedCost: '平均固定成本（AFC）',
    taxRevenue: '政府税收收入',
    taxIncidence: '税收归宿分配',
    consumerBurden: '消费者税负分担',
    producerBurden: '生产者税负分担',
    opportunityCost: '机会成本',
    productiveEfficiency: '生产效率',
    allocativeEfficiency: '配置效率'
  }
};
