import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAppState } from '../../context/AppStateContext';
import { LEARNING_ACTIVITIES, LearningActivity } from '../../data/learningActivities';
import { getModelById } from '../../engine/models/index';
import { GraphContainer } from '../graph/GraphContainer';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Award
} from 'lucide-react';

export const LearningMode: React.FC = () => {
  const { language, t, tr } = useLanguage();
  const {
    activeLearningActivityId,
    setActiveLearningActivityId,
    navigateToGraph
  } = useAppState();

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [completedActivities, setCompletedActivities] = useState<Record<string, boolean>>({});

  const currentActivity: LearningActivity =
    LEARNING_ACTIVITIES.find((a) => a.id === activeLearningActivityId) ||
    LEARNING_ACTIVITIES[0];

  const currentModel = getModelById(currentActivity.modelId);

  // Determine graph parameters based on submitted state:
  // Before submit: initial params; After submit: target params!
  const activeParams = isSubmitted
    ? currentActivity.graphTargetParams
    : currentActivity.graphInitialParams;

  // Run calculation on the active parameters
  const calculationOutput = currentModel
    ? currentModel.calculate(activeParams)
    : null;

  const handleSelectOption = (optionId: string) => {
    if (!isSubmitted) {
      setSelectedOptionId(optionId);
    }
  };

  const handleSubmit = () => {
    if (selectedOptionId) {
      setIsSubmitted(true);
      const chosen = currentActivity.options.find((o) => o.id === selectedOptionId);
      if (chosen?.isCorrect) {
        setCompletedActivities((prev) => ({ ...prev, [currentActivity.id]: true }));
      }
    }
  };

  const handleSkipAndReveal = () => {
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setSelectedOptionId(null);
    setIsSubmitted(false);
    setShowHint(false);
  };

  const handleSwitchActivity = (activityId: string) => {
    setActiveLearningActivityId(activityId);
    setSelectedOptionId(null);
    setIsSubmitted(false);
    setShowHint(false);
  };

  const handleNextChallenge = () => {
    const currentIndex = LEARNING_ACTIVITIES.findIndex((a) => a.id === currentActivity.id);
    const nextIndex = (currentIndex + 1) % LEARNING_ACTIVITIES.length;
    handleSwitchActivity(LEARNING_ACTIVITIES[nextIndex].id);
  };

  const selectedOption = currentActivity.options.find((o) => o.id === selectedOptionId);
  const isCorrect = selectedOption?.isCorrect ?? false;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t.learningModeTitle}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-indigo-200/80 bg-white/10 px-3 py-1 rounded-full">
            <Award className="w-3.5 h-3.5 text-yellow-400" />
            <span>
              {language === 'zh'
                ? `已掌握: ${Object.keys(completedActivities).length} / ${LEARNING_ACTIVITIES.length}`
                : `Mastered: ${Object.keys(completedActivities).length} / ${LEARNING_ACTIVITIES.length}`}
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {tr(currentActivity.title)}
        </h1>

        <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed font-sans max-w-3xl">
          {t.learningModeSubtitle}
        </p>
      </div>

      {/* Challenge Navigator Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {LEARNING_ACTIVITIES.map((act, index) => {
          const isCurrent = act.id === currentActivity.id;
          const isDone = completedActivities[act.id];
          return (
            <button
              key={act.id}
              onClick={() => handleSwitchActivity(act.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                isCurrent
                  ? 'bg-blue-600 text-white shadow-sm'
                  : isDone
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                  : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-500 text-[10px] flex items-center justify-center font-bold">
                  {index + 1}
                </span>
              )}
              <span>Unit {act.unit}: {tr(act.title).split('：')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Challenge Card (Left) & Real-time Graph (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Challenge, Prediction & Explanation */}
        <div className="lg:col-span-6 space-y-4">
          {/* Scenario Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>
                {language === 'zh' ? '经济学情境背景' : 'Economic Scenario Context'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
              {tr(currentActivity.scenario)}
            </p>
          </div>

          {/* Prediction Question Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                {t.predictionPromptTitle}
              </span>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                {tr(currentActivity.predictionPrompt)}
              </h3>
            </div>

            {/* Prediction Options */}
            <div className="space-y-2.5">
              {currentActivity.options.map((option) => {
                const isSelected = selectedOptionId === option.id;
                let optionStyle =
                  'border-slate-200/90 bg-slate-50/50 hover:bg-slate-100/80 text-slate-800';

                if (isSubmitted) {
                  if (option.isCorrect) {
                    optionStyle =
                      'border-emerald-500 bg-emerald-50 text-emerald-950 font-medium ring-1 ring-emerald-500';
                  } else if (isSelected && !option.isCorrect) {
                    optionStyle =
                      'border-red-400 bg-red-50 text-red-950 font-medium ring-1 ring-red-400';
                  } else {
                    optionStyle = 'border-slate-100 bg-slate-50/40 text-slate-400 opacity-60';
                  }
                } else if (isSelected) {
                  optionStyle =
                    'border-blue-600 bg-blue-50/80 text-blue-950 font-medium shadow-xs ring-1 ring-blue-600';
                }

                return (
                  <div
                    key={option.id}
                    onClick={() => handleSelectOption(option.id)}
                    className={`p-3.5 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer flex items-start gap-3 ${optionStyle}`}
                  >
                    <div className="pt-0.5 shrink-0">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                          isSelected
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected ? '✓' : ''}
                      </div>
                    </div>
                    <span className="leading-relaxed">{tr(option.label)}</span>
                  </div>
                );
              })}
            </div>

            {/* Hint Accordion */}
            <div>
              <button
                onClick={() => setShowHint(!showHint)}
                className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showHint ? t.hideHintBtn : t.hintBtn}</span>
              </button>

              {showHint && (
                <div className="mt-2 p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 leading-relaxed font-sans">
                  <span className="font-bold mr-1">
                    {language === 'zh' ? '💡 解题提示：' : '💡 Hint: '}
                  </span>
                  {tr(currentActivity.hint)}
                </div>
              )}
            </div>

            {/* Actions: Submit or Next */}
            {!isSubmitted ? (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  disabled={!selectedOptionId}
                  onClick={handleSubmit}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2 ${
                    selectedOptionId
                      ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer active:scale-95'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>{t.submitPredictionBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleSkipAndReveal}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  {t.skipAndRevealBtn}
                </button>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                {/* Result Feedback Banner */}
                <div
                  className={`p-4 rounded-xl border flex items-start gap-3 ${
                    isCorrect
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-amber-50 border-amber-300 text-amber-950'
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div className="text-xs sm:text-sm space-y-1">
                    <p className="font-bold">
                      {isCorrect
                        ? t.predictionCorrectBanner
                        : t.predictionIncorrectBanner}
                    </p>
                    {selectedOption && (
                      <p className="text-xs leading-relaxed opacity-90">
                        {tr(selectedOption.feedback)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Step-by-Step Derivation */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    {t.stepByStepTitle}
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 font-sans">
                    {currentActivity.stepByStepExplanation.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2 leading-relaxed">
                        <ChevronRight className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>{tr(step)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Takeaway Box */}
                <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-950 font-sans">
                  <span className="font-bold mr-1">{t.keyTakeawayTitle}:</span>
                  {tr(currentActivity.keyTakeaway)}
                </div>

                {/* Navigation Controls */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={handleNextChallenge}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 active:scale-95"
                  >
                    <span>{t.tryNextChallengeBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t.resetChallengeBtn}</span>
                  </button>

                  <button
                    onClick={() => navigateToGraph(currentActivity.modelId, currentActivity.topicId)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 ml-auto"
                  >
                    <span>{t.openInGraphLabBtn}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Synchronized Interactive Graph Visualization */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                  {language === 'zh'
                    ? isSubmitted
                      ? '实时模型图表（已显示预测验证结果）'
                      : '实时模型图表（预测前初始状态）'
                    : isSubmitted
                    ? 'Live Graph Model (Target Outcome Revealed)'
                    : 'Live Graph Model (Initial State)'}
                </h3>
              </div>

              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                {currentActivity.modelId}
              </span>
            </div>

            {/* Graph Container */}
            {calculationOutput && (
              <GraphContainer
                data={calculationOutput}
                title={tr(currentActivity.title)}
                visibilityScope={currentActivity.modelId}
              />
            )}

            {/* Real-time Calculation Outcomes */}
            {calculationOutput && calculationOutput.results.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                {calculationOutput.results.slice(0, 6).map((res) => (
                  <div key={res.id} className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-500 block truncate">
                      {tr(res.label)}
                    </span>
                    <span
                      className="text-xs font-bold font-mono block mt-0.5 truncate"
                      style={{ color: res.color || '#1e293b' }}
                    >
                      {res.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
