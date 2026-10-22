export type Language = 'en' | 'zh';

export interface Translations {
  // Brand & Navigation
  brandTitle: string;
  brandSubtitle: string;
  navTopicLibrary: string;
  navGraphLab: string;
  navLearningMode: string;
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

  // Learning Mode
  learningModeTitle: string;
  learningModeSubtitle: string;
  predictionPromptTitle: string;
  submitPredictionBtn: string;
  skipAndRevealBtn: string;
  predictionCorrectBanner: string;
  predictionIncorrectBanner: string;
  stepByStepTitle: string;
  keyTakeawayTitle: string;
  tryNextChallengeBtn: string;
  resetChallengeBtn: string;
  openInGraphLabBtn: string;
  hintBtn: string;
  hideHintBtn: string;
  activityProgress: string;

  // Practice Mode
  practiceModeTitle: string;
  practiceModeSubtitle: string;
  questionNumber: string;
  scoreTitle: string;
  checkAnswerBtn: string;
  retryQuestionBtn: string;
  nextQuestionBtn: string;
  prevQuestionBtn: string;
  resetPracticeSessionBtn: string;
  reviewAnswersBtn: string;
  commonMistakesHeader: string;
  examTipHeader: string;
  pleaseSelectOptionWarning: string;
  allUnitsFilter: string;
  practiceCompletedTitle: string;
  practiceCompletedDesc: string;

  // Reference Mode
  refTabGlossary: string;
  refTabRules: string;
  refTabMistakes: string;
  refTabFramework: string;
  searchGlossaryPlaceholder: string;
  rulesHeader: string;
  mistakesHeader: string;
  officialFrameworkHeader: string;
  conditionLabel: string;
  appliesToLabel: string;
  wrongViewLabel: string;
  correctViewLabel: string;
  whyItMattersLabel: string;

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
    navLearningMode: 'Prediction Learning',
    navPracticeMode: 'Practice MCQs',
    navReferenceGlossary: 'Reference & Rules',
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
    statusPlanned: 'Planned Model',
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
    modeLearning: 'Prediction Learning Mode',
    modeLearningDesc: 'Prediction-first interactive challenges using validated mathematical graph models.',
    modePractice: 'AP-Style Practice Mode',
    modePracticeDesc: 'Original multiple-choice questions, detailed explanations, and distractor breakdowns.',
    modePracticeComingSoonTitle: 'Practice Questions Ready',
    modePracticeComingSoonDesc: 'Comprehensive AP-style question bank covering all 6 course units.',
    modeReference: 'CED Reference & Cheat Sheet',
    modeReferenceDesc: 'Official College Board course structure, unit weightings, decision rules, and pitfalls.',

    // Learning Mode
    learningModeTitle: 'Prediction-First Learning Challenges',
    learningModeSubtitle: 'Hypothesize outcomes before seeing the live graph update — scientifically proven to deepen intuition',
    predictionPromptTitle: 'Economic Prediction Question',
    submitPredictionBtn: 'Submit Prediction',
    skipAndRevealBtn: 'Skip & Reveal Graph Answer',
    predictionCorrectBanner: '🎉 Excellent Prediction! Your economic intuition is correct.',
    predictionIncorrectBanner: '💡 Not quite, but this is a classic AP trap! Review the real graph adjustment below.',
    stepByStepTitle: 'Step-by-Step Economic Derivation',
    keyTakeawayTitle: 'Key AP Takeaway',
    tryNextChallengeBtn: 'Next Challenge →',
    resetChallengeBtn: 'Reset Scenario',
    openInGraphLabBtn: 'Open in Full Graph Lab ↗',
    hintBtn: 'Show Economic Hint',
    hideHintBtn: 'Hide Hint',
    activityProgress: 'Challenge',

    // Practice Mode
    practiceModeTitle: 'AP-Style Practice Questions',
    practiceModeSubtitle: 'Original multiple-choice practice derived from official College Board learning objectives',
    questionNumber: 'Question',
    scoreTitle: 'Session Performance',
    checkAnswerBtn: 'Submit Answer',
    retryQuestionBtn: 'Retry Question',
    nextQuestionBtn: 'Next Question →',
    prevQuestionBtn: '← Previous Question',
    resetPracticeSessionBtn: 'Reset Session Progress',
    reviewAnswersBtn: 'Review Answers',
    commonMistakesHeader: '⚠️ Common AP Exam Trap & Distractor Breakdown',
    examTipHeader: '🎯 AP Exam Pro-Tip',
    pleaseSelectOptionWarning: 'Please select an answer choice before submitting.',
    allUnitsFilter: 'All Units (1–6)',
    practiceCompletedTitle: 'Practice Set Completed!',
    practiceCompletedDesc: 'Great job! You have completed all questions in this set.',

    // Reference Mode
    refTabGlossary: 'AP Glossary',
    refTabRules: 'Golden Decision Rules',
    refTabMistakes: 'Top Exam Traps',
    refTabFramework: 'Official CED Scope',
    searchGlossaryPlaceholder: 'Search AP abbreviations or terms (e.g. DWL, MRP, MR=MC)...',
    rulesHeader: 'Fundamental Decision Rules & Equilibrium Conditions',
    mistakesHeader: 'Top AP Exam Traps & Misconceptions to Avoid',
    officialFrameworkHeader: 'College Board AP Microeconomics Official Framework (2026–27)',
    conditionLabel: 'Mathematical Condition',
    appliesToLabel: 'Applies To',
    wrongViewLabel: '❌ Common Wrong Intuition',
    correctViewLabel: '✅ Rigorous Economic Truth',
    whyItMattersLabel: 'Why It Matters on the Exam',

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
    disclaimerText: 'Original educational resource designed for high school students preparing for the AP Microeconomics exam. Derived from the official College Board Course and Exam Description.',
    stageBadge: 'Part 3: Complete Learning, Practice & Reference Suite Active',

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
    productiveEfficiency: 'Productive Efficiency (min ATC)',
    allocativeEfficiency: 'Allocative Efficiency (P = MC)',
  },
  zh: {
    // Brand & Navigation
    brandTitle: 'AP微观经济学图表实验室',
    brandSubtitle: '交互式数理模型仿真与 CED 考纲对齐学习平台',
    navTopicLibrary: '考纲专题库',
    navGraphLab: '交互图表实验室',
    navLearningMode: '预测探究模式',
    navPracticeMode: '真题演练模式',
    navReferenceGlossary: '速查与考点精解',
    langSwitchButton: 'English', // When in Chinese, show English toggle
    cedAlignmentBadge: '对齐 AP CED 2026–27',
    officialCedYear: '美国大学理事会 AP 微观经济学课程体系',

    // Search & Filter
    searchPlaceholder: '搜索考点、公式、曲线（如 DWL、PPC、从量税、MR=MC）...',
    filterByUnit: '按单元筛选',
    allUnits: '全单元（1–6）',
    filterByScope: '考纲考查范围',
    allScopes: '全部考纲范围',
    filterByStatus: '交互可用状态',
    allStatuses: '全部状态',
    clearFilters: '重置筛选条件',
    topicsFound: '个经济学主题可用',
    noTopicsFoundTitle: '未找到匹配的 AP 考点',
    noTopicsFoundDesc: '尝试更换搜索关键词、清除单元筛选，或选择“全部考纲范围”。',

    // Scope Classifications
    scopeCore: 'AP 核心必考',
    scopeCoreDesc: '大学理事会 AP 微观考卷（选择题与大题）核心考察重点',
    scopeExtension: '荣誉微观拓展',
    scopeExtensionDesc: '高级微观分析、大学先修荣誉微观经济学进阶概念',
    scopeExcluded: '考纲不考说明',
    scopeExcludedDesc: '澄清辨析：已移出考纲之历史模型或纯 AP 宏观专属内容',

    // Status Classifications
    statusReady: '交互图表已就绪',
    statusPlanned: '已规划模型',
    statusReference: '仅作考纲对比',

    // Graph Workspace
    workspaceTitle: '交互图表工作台',
    workspaceSubtitle: '基于严谨数理公式的动态仿真与福利剩余实时结算',
    backToLibrary: '← 返回考纲专题库',
    controlsPanelTitle: '模型参数与交互滑块',
    resultsPanelTitle: '实时经济学测算指标',
    insightsPanelTitle: '经济学直觉与考点剖析',
    presetScenarios: '经典预设场景',
    defaultScenario: '基准默认场景',
    resetToDefaults: '重置为默认值',
    graphVisibilityToggle: '图层显示控制',
    showSurplusAreas: '显示福利阴影（CS、PS、DWL）',
    showEquilibriumPoints: '显示均衡点垂直投影线',
    showGridLines: '显示坐标网格',
    curveLegend: '曲线图例',

    // Modes
    modeLearning: '预测探究模式',
    modeLearningDesc: '基于实效图表引擎的“先预测后验证”进阶学习挑战。',
    modePractice: 'AP 风格自测模式',
    modePracticeDesc: '原创 AP 风格选择题训练、详尽步骤拆解与高频错因剖析。',
    modePracticeComingSoonTitle: '真题演练题库已就绪',
    modePracticeComingSoonDesc: '涵盖全部 6 个单元的原创 AP 风格高质量选择题库。',
    modeReference: '考点速查与高频陷阱',
    modeReferenceDesc: '大学理事会官方课程结构、单元考比、黄金决策法则与核心易错点。',

    // Learning Mode
    learningModeTitle: '“先预测后验证”探究学习挑战',
    learningModeSubtitle: '在观察图表发生变化前先做出经济学预测——科学验证可极大增强考场直觉',
    predictionPromptTitle: '经济学动态预测提问',
    submitPredictionBtn: '提交我的预测',
    skipAndRevealBtn: '跳过并直接查看图表答案',
    predictionCorrectBanner: '🎉 预测完全准确！你的经济学逻辑严谨无误。',
    predictionIncorrectBanner: '💡 没关系！这是极其经典的 AP 考试思维陷阱，快看下方真实图表与推导。',
    stepByStepTitle: '经济学分步严密推导',
    keyTakeawayTitle: 'AP 核心考点结论',
    tryNextChallengeBtn: '下一挑战 →',
    resetChallengeBtn: '重置情境',
    openInGraphLabBtn: '在图表实验室中深入探索 ↗',
    hintBtn: '显示经济学解题提示',
    hideHintBtn: '隐藏提示',
    activityProgress: '挑战关卡',

    // Practice Mode
    practiceModeTitle: 'AP 风格微观经济学真题演练',
    practiceModeSubtitle: '基于大学理事会官方考纲学习目标精心原创，拒绝死记硬背',
    questionNumber: '试题',
    scoreTitle: '本次练习统计',
    checkAnswerBtn: '提交核对答案',
    retryQuestionBtn: '重新挑战此题',
    nextQuestionBtn: '下一题 →',
    prevQuestionBtn: '← 上一题',
    resetPracticeSessionBtn: '重置练习进度',
    reviewAnswersBtn: '回顾错题与解析',
    commonMistakesHeader: '⚠️ AP 考试高频陷阱与混淆项深度拆解',
    examTipHeader: '🎯 AP 考官高分提分秘笈',
    pleaseSelectOptionWarning: '请在提交前先勾选一个答案选项。',
    allUnitsFilter: '全单元（1–6）',
    practiceCompletedTitle: '本套练习已全部完成！',
    practiceCompletedDesc: '太棒了！你已顺利答完当前筛选条件下的全部练习题目。',

    // Reference Mode
    refTabGlossary: '核心中英术语词汇表',
    refTabRules: '黄金决策法则',
    refTabMistakes: '高频考试易错陷阱',
    refTabFramework: '官方考纲范围全景',
    searchGlossaryPlaceholder: '搜索 AP 英文缩写或中文术语（如 DWL、MRP、MR=MC）...',
    rulesHeader: '微观经济学核心决策法则与均衡条件',
    mistakesHeader: '历年 AP 阅卷官重点指出的高频失分误区精解',
    officialFrameworkHeader: '美国大学理事会 AP 微观经济学官方课程框架（2026–27）',
    conditionLabel: '数学判断准则',
    appliesToLabel: '适用市场与主体',
    wrongViewLabel: '❌ 考生常见错误直觉',
    correctViewLabel: '✅ 严密经济学科学结论',
    whyItMattersLabel: '考场重要性与分值意义',

    // Common UI Actions
    openGraph: '打开图表实验室',
    exploreModel: '深入探索模型',
    viewDetails: '查看考点详情',
    close: '关闭',
    unit: '单元',
    officialRefLabel: '官方 CED 考点条目',
    keyTerminology: '核心 AP 专业术语',
    primaryCurvesLabel: '主要经济学曲线',
    examWeightLabel: '考试分值占比',
    disclaimerText: '本平台为专供高中学生备考 AP 微观经济学考试研发的原创互动学习工具，内容对齐美国大学理事会官方课程大纲。',
    stageBadge: 'Part 3: 探究、演练与速查全套学习功能已完全就绪',

    // Common Economics Terms
    price: '价格（P）',
    quantity: '数量（Q）',
    equilibriumPrice: '均衡价格（P*）',
    equilibriumQuantity: '均衡数量（Q*）',
    demand: '需求曲线（D）',
    supply: '供给曲线（S）',
    consumerSurplus: '消费者剩余（CS）',
    producerSurplus: '生产者剩余（PS）',
    totalSurplus: '社会总剩余',
    deadweightLoss: '无谓损失（DWL）',
    marginalCost: '边际成本（MC）',
    marginalRevenue: '边际收益（MR）',
    averageTotalCost: '平均总成本（ATC）',
    averageVariableCost: '平均可变成本（AVC）',
    averageFixedCost: '平均固定成本（AFC）',
    taxRevenue: '政府税收收入',
    taxIncidence: '税负归宿分摊',
    consumerBurden: '消费者税负',
    producerBurden: '生产者税负',
    opportunityCost: '机会成本',
    productiveEfficiency: '生产效率（min ATC 最低点）',
    allocativeEfficiency: '配置效率（P = MC）',
  }
};
