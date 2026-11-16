import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAppState } from '../../context/AppStateContext';
import { PRACTICE_QUESTIONS, PracticeQuestion } from '../../data/practiceQuestions';
import {
  generateRandomDynamicQuestion,
  generateSimilarQuestion,
  generateMockExamQuestions
} from '../../engine/generators';
import { MistakeRecord, MockExamState } from '../../types/practice';
import {
  BrainCircuit,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  ExternalLink,
  Award,
  Filter,
  Sparkles,
  Timer,
  BookOpen,
  CheckSquare,
  Flame,
  RefreshCw,
  Trophy
} from 'lucide-react';

type PracticeTab = 'infinite' | 'mock' | 'mistakes' | 'classic';

const MOCK_DURATION_SECONDS: Record<number, number> = {
  15: 18 * 60,
  30: 35 * 60,
  60: 70 * 60
};

export const PracticeMode: React.FC = () => {
  const { language, t, tr } = useLanguage();
  const { navigateToTopic } = useAppState();

  const [activeTab, setActiveTab] = useState<PracticeTab>('infinite');
  const [selectedUnit, setSelectedUnit] = useState<number>(0); // 0 = all units

  // -------------------------------------------------------------
  // 1. Infinite Dynamic Practice State
  // -------------------------------------------------------------
  const [dynamicQuestion, setDynamicQuestion] = useState<PracticeQuestion>(() =>
    generateRandomDynamicQuestion(0)
  );
  const [dynamicAnswer, setDynamicAnswer] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isDynamicSubmitted, setIsDynamicSubmitted] = useState<boolean>(false);
  const [dynamicStats, setDynamicStats] = useState<{ answered: number; correct: number }>({
    answered: 0,
    correct: 0
  });

  // -------------------------------------------------------------
  // 2. Mistake Notebook State (Persisted in localStorage)
  // -------------------------------------------------------------
  const [mistakes, setMistakes] = useState<MistakeRecord[]>(() => {
    try {
      const saved = localStorage.getItem('ap_micro_mistakes_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeDrillMistake, setActiveDrillMistake] = useState<{
    originalRecord: MistakeRecord;
    variantQuestion: PracticeQuestion;
    chosenOption: 'A' | 'B' | 'C' | 'D' | null;
    isSubmitted: boolean;
  } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('ap_micro_mistakes_v1', JSON.stringify(mistakes));
    } catch {
      // ignore
    }
  }, [mistakes]);

  // -------------------------------------------------------------
  // 3. AP Mock Exam State
  // -------------------------------------------------------------
  const [mockExam, setMockExam] = useState<MockExamState>({
    isActive: false,
    totalQuestions: 15,
    timeRemainingSeconds: MOCK_DURATION_SECONDS[15],
    questions: [],
    userAnswers: {},
    submitted: false
  });
  const [activeMockIndex, setActiveMockIndex] = useState<number>(0);
  const [selectedExamLength, setSelectedExamLength] = useState<number>(15);
  const [mockReviewFilter, setMockReviewFilter] = useState<'all' | 'incorrect'>('all');
  const loggedExamRef = useRef<boolean>(false);

  // Countdown timer for Mock Exam
  useEffect(() => {
    if (!mockExam.isActive || mockExam.submitted) return;

    const timer = setInterval(() => {
      setMockExam((prev) => {
        if (prev.timeRemainingSeconds <= 1) {
          clearInterval(timer);
          return handleAutoSubmitExam(prev);
        }
        return { ...prev, timeRemainingSeconds: prev.timeRemainingSeconds - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mockExam.isActive, mockExam.submitted]);

  // Log missed Mock Exam questions into Mistake Notebook once upon submission
  useEffect(() => {
    if (!mockExam.isActive || !mockExam.submitted || loggedExamRef.current) return;
    loggedExamRef.current = true;

    const missedRecords: MistakeRecord[] = mockExam.questions
      .filter((q) => mockExam.userAnswers[q.id] !== q.correctOptionId)
      .map((q) => ({
        questionId: q.id,
        templateId: q.templateId || 'dyn-ppc-opp-cost',
        unit: q.unit,
        topicCode: q.topicCode,
        topicId: q.topicId,
        prompt: q.prompt,
        userWrongOptionId: mockExam.userAnswers[q.id] || 'SKIPPED',
        correctOptionId: q.correctOptionId,
        explanation: q.overallExplanation,
        timestamp: Date.now(),
        consecutiveCorrect: 0
      }));

    if (missedRecords.length > 0) {
      setMistakes((prev) => {
        const missedIds = new Set(missedRecords.map((m) => m.questionId));
        return [...missedRecords, ...prev.filter((m) => !missedIds.has(m.questionId))];
      });
    }
  }, [mockExam.isActive, mockExam.submitted, mockExam.questions, mockExam.userAnswers]);

  // -------------------------------------------------------------
  // 4. Classic Curated Questions State (with Dynamic Variant Generation)
  // -------------------------------------------------------------
  const [classicIndex, setClassicIndex] = useState<number>(0);
  const [classicAnswers, setClassicAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [classicSubmitted, setClassicSubmitted] = useState<Record<string, boolean>>({});
  const [classicVariants, setClassicVariants] = useState<Record<string, PracticeQuestion>>({});

  const filteredClassic = PRACTICE_QUESTIONS.filter(
    (q) => selectedUnit === 0 || q.unit === selectedUnit
  );
  const currentClassic = filteredClassic[Math.min(classicIndex, Math.max(0, filteredClassic.length - 1))];
  const activeClassic = (currentClassic && classicVariants[currentClassic.id]) || currentClassic;

  // -------------------------------------------------------------
  // Handlers: Infinite Dynamic Mode
  // -------------------------------------------------------------
  const handleLoadNewDynamicQuestion = (unit?: number) => {
    const targetUnit = unit !== undefined ? unit : selectedUnit;
    const q = generateRandomDynamicQuestion(targetUnit);
    setDynamicQuestion(q);
    setDynamicAnswer(null);
    setIsDynamicSubmitted(false);
  };

  const handleGenerateSimilar = () => {
    if (dynamicQuestion.templateId) {
      const q = generateSimilarQuestion(dynamicQuestion.templateId);
      setDynamicQuestion(q);
    } else {
      handleLoadNewDynamicQuestion();
    }
    setDynamicAnswer(null);
    setIsDynamicSubmitted(false);
  };

  const handleSubmitDynamicAnswer = () => {
    if (!dynamicAnswer) return;
    setIsDynamicSubmitted(true);

    const isCorrect = dynamicAnswer === dynamicQuestion.correctOptionId;
    setDynamicStats((prev) => ({
      answered: prev.answered + 1,
      correct: isCorrect ? prev.correct + 1 : prev.correct
    }));

    // Record mistake if wrong
    if (!isCorrect) {
      const newMistake: MistakeRecord = {
        questionId: dynamicQuestion.id,
        templateId: dynamicQuestion.templateId,
        unit: dynamicQuestion.unit,
        topicCode: dynamicQuestion.topicCode,
        topicId: dynamicQuestion.topicId,
        prompt: dynamicQuestion.prompt,
        userWrongOptionId: dynamicAnswer,
        correctOptionId: dynamicQuestion.correctOptionId,
        explanation: dynamicQuestion.overallExplanation,
        timestamp: Date.now(),
        consecutiveCorrect: 0
      };
      setMistakes((prev) => [newMistake, ...prev.filter((m) => m.questionId !== dynamicQuestion.id)]);
    }
  };

  // -------------------------------------------------------------
  // Handlers: Mock Exam Mode
  // -------------------------------------------------------------
  const handleStartMockExam = (length: number) => {
    const questions = generateMockExamQuestions(length);
    const totalSeconds = MOCK_DURATION_SECONDS[length] ?? length * 70;
    loggedExamRef.current = false;
    setMockReviewFilter('all');

    setMockExam({
      isActive: true,
      totalQuestions: length,
      timeRemainingSeconds: totalSeconds,
      questions,
      userAnswers: {},
      submitted: false
    });
    setActiveMockIndex(0);
  };

  const handleAutoSubmitExam = (state: MockExamState): MockExamState => {
    let correct = 0;
    const unitBreakdown: Record<number, { correct: number; total: number }> = {
      1: { correct: 0, total: 0 },
      2: { correct: 0, total: 0 },
      3: { correct: 0, total: 0 },
      4: { correct: 0, total: 0 },
      5: { correct: 0, total: 0 },
      6: { correct: 0, total: 0 }
    };

    state.questions.forEach((q) => {
      const u = q.unit;
      if (!unitBreakdown[u]) unitBreakdown[u] = { correct: 0, total: 0 };
      unitBreakdown[u].total++;

      if (state.userAnswers[q.id] === q.correctOptionId) {
        correct++;
        unitBreakdown[u].correct++;
      }
    });

    const pct = Math.round((correct / state.totalQuestions) * 100);
    let apScoreEstimate: 1 | 2 | 3 | 4 | 5 = 1;
    if (pct >= 80) apScoreEstimate = 5;
    else if (pct >= 66) apScoreEstimate = 4;
    else if (pct >= 50) apScoreEstimate = 3;
    else if (pct >= 35) apScoreEstimate = 2;

    return {
      ...state,
      submitted: true,
      score: {
        correct,
        total: state.totalQuestions,
        percentage: pct,
        apScoreEstimate,
        unitBreakdown
      }
    };
  };

  const handleSubmitMockExam = () => {
    setMockExam((prev) => handleAutoSubmitExam(prev));
  };

  // -------------------------------------------------------------
  // Handlers: Mistake Targeted Drill
  // -------------------------------------------------------------
  const handleStartMistakeDrill = (record: MistakeRecord) => {
    const variant = generateSimilarQuestion(record.templateId);
    setActiveDrillMistake({
      originalRecord: record,
      variantQuestion: variant,
      chosenOption: null,
      isSubmitted: false
    });
  };

  const handleSubmitMistakeDrill = () => {
    if (!activeDrillMistake || !activeDrillMistake.chosenOption) return;
    const isCorrect =
      activeDrillMistake.chosenOption === activeDrillMistake.variantQuestion.correctOptionId;

    setActiveDrillMistake((prev) => (prev ? { ...prev, isSubmitted: true } : null));

    if (isCorrect) {
      setMistakes((prev) =>
        prev
          .map((m) => {
            if (m.questionId === activeDrillMistake.originalRecord.questionId) {
              return { ...m, consecutiveCorrect: m.consecutiveCorrect + 1 };
            }
            return m;
          })
          .filter((m) => m.consecutiveCorrect < 2)
      );
    } else {
      setMistakes((prev) =>
        prev.map((m) => {
          if (m.questionId === activeDrillMistake.originalRecord.questionId) {
            return { ...m, consecutiveCorrect: 0, timestamp: Date.now() };
          }
          return m;
        })
      );
    }
  };

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Practice Hub Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold backdrop-blur-sm">
              <BrainCircuit className="w-4 h-4 text-blue-400" />
              <span>{language === 'zh' ? 'AP 微观经济学刷题中心' : 'AP Microeconomics Practice Hub'}</span>
            </div>

            <div className="flex items-center gap-3">
              {activeTab === 'infinite' && dynamicStats.answered > 0 && (
                <div className="flex items-center gap-2 text-xs font-mono bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>
                    {language === 'zh' ? '动态练习' : 'Dynamic Session'}: {dynamicStats.correct}/
                    {dynamicStats.answered} (
                    {Math.round((dynamicStats.correct / dynamicStats.answered) * 100)}%)
                  </span>
                </div>
              )}
              {mistakes.length > 0 && (
                <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  {mistakes.length} {language === 'zh' ? '道待消灭错题' : 'Mistakes to conquer'}
                </span>
              )}
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {language === 'zh'
              ? 'AP 微观经济学智能题库与全真模拟中心'
              : 'AP Microeconomics Infinite Practice & Exam Simulator'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            {language === 'zh'
              ? '告别机械死记硬背！依托底层数理模拟引擎，题目参数、商品背景与选项实时动态生成，搭配错因智能剖析与错题靶向消除。'
              : 'Beyond static quizzes! Powered by real-time mathematical economic models, every question dynamically randomizes parameters and scenarios with targeted distractor explanations.'}
          </p>
        </div>
      </div>

      {/* Main Mode Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200">
        <button
          onClick={() => setActiveTab('infinite')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'infinite'
              ? 'bg-white text-blue-700 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>{t.practiceTabInfinite}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-mono">
            {language === 'zh' ? '无限刷题' : 'Infinite'}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('mock')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'mock'
              ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Timer className="w-4 h-4 text-indigo-600" />
          <span>{t.practiceTabMock}</span>
        </button>

        <button
          onClick={() => setActiveTab('mistakes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all relative ${
            activeTab === 'mistakes'
              ? 'bg-white text-rose-700 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Flame className="w-4 h-4 text-rose-600" />
          <span>{t.practiceTabMistakes}</span>
          {mistakes.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('classic')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'classic'
              ? 'bg-white text-slate-800 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <BookOpen className="w-4 h-4 text-slate-600" />
          <span>{t.practiceTabClassic}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: INFINITE DYNAMIC PRACTICE (无限动态变式演练) */}
      {/* ========================================================================= */}
      {activeTab === 'infinite' && (
        <div className="space-y-6">
          {/* Unit Selector Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <span className="text-xs font-bold text-slate-500 mr-1 shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              {t.filterByUnit}:
            </span>
            {[0, 1, 2, 3, 4, 5, 6].map((unitNum) => (
              <button
                key={unitNum}
                onClick={() => {
                  setSelectedUnit(unitNum);
                  handleLoadNewDynamicQuestion(unitNum);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                  selectedUnit === unitNum
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {unitNum === 0 ? t.allUnitsFilter : `Unit ${unitNum}`}
              </button>
            ))}
          </div>

          {/* Dynamic Question Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
            {/* Question Header & Meta */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/60 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Unit {dynamicQuestion.unit} ({dynamicQuestion.topicCode})
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-slate-100 text-slate-600">
                  {language === 'zh' ? '动态参数变式' : 'Dynamic Numerical Variant'}
                </span>
              </div>

              <button
                onClick={() => navigateToTopic(dynamicQuestion.topicId)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                <span>{language === 'zh' ? '在交互模型中模拟此题' : 'Simulate in Graph Lab'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Question Prompt */}
            <div className="space-y-3">
              <p className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed font-sans">
                {tr(dynamicQuestion.prompt)}
              </p>
            </div>

            {/* Multiple Choice Options */}
            <div className="space-y-3 pt-2">
              {dynamicQuestion.options.map((opt) => {
                const isSelected = dynamicAnswer === opt.id;
                const isOptionCorrect = opt.id === dynamicQuestion.correctOptionId;

                let optCardStyle = 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/30';
                let indicatorStyle = 'border-slate-300 text-slate-600';

                if (isDynamicSubmitted) {
                  if (isOptionCorrect) {
                    optCardStyle = 'border-emerald-500 bg-emerald-50/70 ring-1 ring-emerald-500 text-emerald-950';
                    indicatorStyle = 'bg-emerald-600 text-white border-emerald-600';
                  } else if (isSelected && !isOptionCorrect) {
                    optCardStyle = 'border-rose-400 bg-rose-50/70 ring-1 ring-rose-400 text-rose-950';
                    indicatorStyle = 'bg-rose-600 text-white border-rose-600';
                  } else {
                    optCardStyle = 'border-slate-200/70 opacity-60 bg-slate-50/50';
                  }
                } else if (isSelected) {
                  optCardStyle = 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 text-blue-950';
                  indicatorStyle = 'bg-blue-600 text-white border-blue-600';
                }

                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      if (!isDynamicSubmitted) setDynamicAnswer(opt.id);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${optCardStyle}`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border ${indicatorStyle}`}
                      >
                        {opt.id}
                      </div>
                      <div className="flex-1 pt-0.5 space-y-2">
                        <span className="text-sm sm:text-base font-medium">
                          {tr(opt.text)}
                        </span>

                        {/* Option explanation revealed after submission */}
                        {isDynamicSubmitted && (
                          <div
                            className={`text-xs leading-relaxed pt-2 border-t mt-2 ${
                              isOptionCorrect
                                ? 'text-emerald-800 border-emerald-200/60'
                                : isSelected
                                ? 'text-rose-800 border-rose-200/60'
                                : 'text-slate-600 border-slate-200/60'
                            }`}
                          >
                            <span className="font-bold mr-1">
                              {language === 'zh'
                                ? isOptionCorrect
                                  ? '✓ [正确依据]'
                                  : '✗ [辨析与错因]'
                                : isOptionCorrect
                                ? '✓ [Correct Reasoning]'
                                : '✗ [Distractor Analysis]'}
                              :
                            </span>
                            {tr(opt.explanation)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Answer Control / Next Question Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              {!isDynamicSubmitted ? (
                <button
                  onClick={handleSubmitDynamicAnswer}
                  disabled={!dynamicAnswer}
                  className={`px-6 py-3 rounded-2xl font-bold text-sm shadow-sm transition-all flex items-center gap-2 ${
                    dynamicAnswer
                      ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer hover:shadow'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>{t.checkAnswerBtn}</span>
                </button>
              ) : (
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleGenerateSimilar}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4 text-indigo-600" />
                    <span>{t.generateSimilarBtn}</span>
                  </button>

                  <button
                    onClick={() => handleLoadNewDynamicQuestion()}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>{t.generateNextDynamicBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Comprehensive Explanation & Pro-Tips after submission */}
            {isDynamicSubmitted && (
              <div className="pt-4 space-y-4">
                <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200/60 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-blue-900">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>{language === 'zh' ? '全解全析与核心逻辑推导' : 'Detailed Solution & Economic Logic'}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                    {tr(dynamicQuestion.overallExplanation)}
                  </p>
                </div>

                {dynamicQuestion.commonMistakeAlert && (
                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs sm:text-sm text-amber-900 space-y-1">
                    <span className="font-bold flex items-center gap-1.5 text-amber-800">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      {t.commonMistakesHeader}
                    </span>
                    <p className="text-slate-700 leading-relaxed pl-5">
                      {tr(dynamicQuestion.commonMistakeAlert)}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: AP MOCK EXAM SIMULATION (全真模拟考) */}
      {/* ========================================================================= */}
      {activeTab === 'mock' && (
        <div className="space-y-6">
          {!mockExam.isActive ? (
            // Pre-Exam Setup Card
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 text-center space-y-6 max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
                <Trophy className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">
                  {language === 'zh' ? 'AP 微观经济学考前全真模拟试卷' : 'AP Micro Full Exam Simulation'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  {language === 'zh'
                    ? '根据大学理事会 AP 微观官方考纲各单元考查权重，随机抽取并配比题目，实时倒计时仿真，考后生成 6 单元诊断报告与预估 AP 得分。'
                    : 'Generated based on official College Board AP Micro CED exam weights with a timed test experience and comprehensive 6-unit diagnostic breakdown.'}
                </p>
              </div>

              {/* Length selector */}
              <div className="flex justify-center gap-3">
                {[
                  { count: 15, time: language === 'zh' ? '18 分钟' : '18 min', label: language === 'zh' ? '15 题 · 快速小测' : '15 Qs · Quick Check' },
                  { count: 30, time: language === 'zh' ? '35 分钟' : '35 min', label: language === 'zh' ? '30 题 · 半套模考' : '30 Qs · Half Exam' },
                  { count: 60, time: language === 'zh' ? '70 分钟' : '70 min', label: language === 'zh' ? '60 题 · 全真大考' : '60 Qs · Full Exam' }
                ].map((item) => (
                  <button
                    key={item.count}
                    onClick={() => setSelectedExamLength(item.count)}
                    className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold transition-all text-center flex-1 max-w-[150px] ${
                      selectedExamLength === item.count
                        ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <div>{item.label}</div>
                    <div className="text-[11px] font-mono text-slate-400 mt-1">{item.time}</div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleStartMockExam(selectedExamLength)}
                className="px-8 py-3.5 rounded-2xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
              >
                <Timer className="w-4 h-4" />
                <span>{t.startMockExamBtn}</span>
              </button>
            </div>
          ) : !mockExam.submitted ? (
            // Active Exam In Progress
            <div className="space-y-6">
              {/* Exam Top Bar with Timer and Progress */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-800">
                    {language === 'zh' ? '模拟考试进行中' : 'Mock Exam in Progress'}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    ({Object.keys(mockExam.userAnswers).length} / {mockExam.totalQuestions} {language === 'zh' ? '已作答' : 'Answered'})
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold ${
                      mockExam.timeRemainingSeconds < 300
                        ? 'bg-rose-50 text-rose-600 border border-rose-200 animate-pulse'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Timer className="w-3.5 h-3.5" />
                    <span>{formatTime(mockExam.timeRemainingSeconds)}</span>
                  </div>

                  <button
                    onClick={handleSubmitMockExam}
                    className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all"
                  >
                    {language === 'zh' ? '交卷核分' : 'Submit Exam'}
                  </button>
                </div>
              </div>

              {/* Question Grid Navigator */}
              <div className="flex flex-wrap gap-1.5 p-3 bg-white rounded-2xl border border-slate-200">
                {mockExam.questions.map((q, idx) => {
                  const isAnswered = mockExam.userAnswers[q.id] !== undefined;
                  const isCurrent = idx === activeMockIndex;

                  let btnStyle = 'bg-slate-100 text-slate-600 hover:bg-slate-200';
                  if (isAnswered) btnStyle = 'bg-indigo-100 text-indigo-700 font-bold border border-indigo-300';
                  if (isCurrent) btnStyle = 'bg-indigo-600 text-white font-bold ring-2 ring-indigo-500/30';

                  return (
                    <button
                      key={q.id}
                      onClick={() => setActiveMockIndex(idx)}
                      className={`w-8 h-8 rounded-lg text-xs font-mono transition-all ${btnStyle}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Active Exam Question */}
              {mockExam.questions[activeMockIndex] && (
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-indigo-600">
                      {language === 'zh'
                        ? `第 ${activeMockIndex + 1} / ${mockExam.totalQuestions} 题 · 第 ${mockExam.questions[activeMockIndex].unit} 单元 (${mockExam.questions[activeMockIndex].topicCode})`
                        : `Question ${activeMockIndex + 1} of ${mockExam.totalQuestions} · Unit ${mockExam.questions[activeMockIndex].unit} (${mockExam.questions[activeMockIndex].topicCode})`}
                    </span>
                  </div>

                  <p className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed">
                    {tr(mockExam.questions[activeMockIndex].prompt)}
                  </p>

                  <div className="space-y-3 pt-2">
                    {mockExam.questions[activeMockIndex].options.map((opt) => {
                      const qId = mockExam.questions[activeMockIndex].id;
                      const isSelected = mockExam.userAnswers[qId] === opt.id;

                      return (
                        <div
                          key={opt.id}
                          onClick={() => {
                            setMockExam((prev) => ({
                              ...prev,
                              userAnswers: { ...prev.userAnswers, [qId]: opt.id }
                            }));
                          }}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 text-indigo-950'
                              : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50/50'
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'border-slate-300 text-slate-600'
                            }`}
                          >
                            {opt.id}
                          </div>
                          <span className="text-sm sm:text-base font-medium pt-0.5">
                            {tr(opt.text)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Navigator Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      onClick={() => setActiveMockIndex(Math.max(0, activeMockIndex - 1))}
                      disabled={activeMockIndex === 0}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                        activeMockIndex === 0
                          ? 'opacity-40 cursor-not-allowed text-slate-400'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>{t.prevQuestionBtn}</span>
                    </button>

                    <button
                      onClick={() =>
                        setActiveMockIndex(
                          Math.min(mockExam.totalQuestions - 1, activeMockIndex + 1)
                        )
                      }
                      disabled={activeMockIndex === mockExam.totalQuestions - 1}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                        activeMockIndex === mockExam.totalQuestions - 1
                          ? 'opacity-40 cursor-not-allowed text-slate-400'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      <span>{t.nextQuestionBtn}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Exam Results & Performance Diagnostic
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {t.mockExamComplete}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      {language === 'zh'
                        ? '恭喜完成全套模拟答题！查看你的各单元得分率与能力画像：'
                        : 'Congratulations on finishing the simulation! Review your performance report below:'}
                    </p>
                  </div>

                  {/* Big AP Score Card */}
                  <div className="flex items-center gap-4 bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200/80 p-4 rounded-2xl">
                    <div className="text-center">
                      <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                        {t.estimatedApScore}
                      </div>
                      <div className="text-3xl sm:text-4xl font-extrabold text-indigo-900 font-mono">
                        {mockExam.score?.apScoreEstimate} <span className="text-lg">/ 5</span>
                      </div>
                    </div>
                    <div className="h-10 w-px bg-indigo-200"></div>
                    <div className="text-center">
                      <div className="text-xs font-bold text-slate-500">
                        {language === 'zh' ? '综合得分率' : 'Accuracy'}
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-slate-800 font-mono">
                        {mockExam.score?.correct} / {mockExam.score?.total} (
                        {mockExam.score?.percentage}%)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Unit by Unit Diagnostic Bars */}
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-slate-800">
                    {language === 'zh' ? '各单元能力诊断细分' : 'Unit-by-Unit Diagnostic Breakdown'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[1, 2, 3, 4, 5, 6].map((u) => {
                      const data = mockExam.score?.unitBreakdown[u] || { correct: 0, total: 0 };
                      const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
                      return (
                        <div key={u} className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-700">Unit {u}</span>
                            <span className="font-mono text-slate-600">
                              {data.correct} / {data.total} ({pct}%)
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${pct}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Question-by-Question Review */}
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-bold text-sm text-slate-800">
                      {language === 'zh' ? '逐题答案复盘与解析' : 'Question-by-Question Answer Review'}
                    </h3>
                    <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                      <button
                        onClick={() => setMockReviewFilter('all')}
                        className={`px-3 py-1 rounded-lg transition-colors ${
                          mockReviewFilter === 'all'
                            ? 'bg-white text-indigo-700 shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {language === 'zh' ? `全部 (${mockExam.questions.length})` : `All (${mockExam.questions.length})`}
                      </button>
                      <button
                        onClick={() => setMockReviewFilter('incorrect')}
                        className={`px-3 py-1 rounded-lg transition-colors ${
                          mockReviewFilter === 'incorrect'
                            ? 'bg-white text-rose-700 shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {language === 'zh'
                          ? `错题 / 未答 (${mockExam.questions.filter((q) => mockExam.userAnswers[q.id] !== q.correctOptionId).length})`
                          : `Missed (${mockExam.questions.filter((q) => mockExam.userAnswers[q.id] !== q.correctOptionId).length})`}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
                    {mockExam.questions
                      .map((q, idx) => ({ q, idx }))
                      .filter(({ q }) =>
                        mockReviewFilter === 'all' ? true : mockExam.userAnswers[q.id] !== q.correctOptionId
                      )
                      .map(({ q, idx }) => {
                        const userAns = mockExam.userAnswers[q.id];
                        const isQCorrect = userAns === q.correctOptionId;
                        const userOpt = q.options.find((o) => o.id === userAns);
                        const correctOpt = q.options.find((o) => o.id === q.correctOptionId);

                        return (
                          <div
                            key={q.id}
                            className={`p-4 rounded-2xl border space-y-2.5 text-xs ${
                              isQCorrect
                                ? 'bg-emerald-50/40 border-emerald-200/80'
                                : 'bg-rose-50/40 border-rose-200/80'
                            }`}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2 py-0.5 rounded-md font-bold ${
                                    isQCorrect
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-rose-100 text-rose-800'
                                  }`}
                                >
                                  {isQCorrect
                                    ? language === 'zh'
                                      ? '✓ 正确'
                                      : '✓ Correct'
                                    : userAns
                                    ? language === 'zh'
                                      ? '✗ 答错'
                                      : '✗ Incorrect'
                                    : language === 'zh'
                                    ? '— 未作答'
                                    : '— Skipped'}
                                </span>
                                <span className="font-mono font-semibold text-slate-600">
                                  #{idx + 1} · Unit {q.unit} ({q.topicCode})
                                </span>
                              </div>
                              <button
                                onClick={() => navigateToTopic(q.topicId)}
                                className="inline-flex items-center gap-1 text-blue-600 hover:underline font-semibold"
                              >
                                <span>{language === 'zh' ? '在图像中复习' : 'Graph Lab'}</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            </div>

                            <p className="text-sm font-medium text-slate-900 leading-relaxed">
                              {tr(q.prompt)}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
                                <span className="font-bold text-slate-500 block mb-0.5">
                                  {language === 'zh' ? '你的选择' : 'Your Answer'}:{' '}
                                  <span className={isQCorrect ? 'text-emerald-700' : 'text-rose-700'}>
                                    {userAns || (language === 'zh' ? '未作答' : 'None')}
                                  </span>
                                </span>
                                {userOpt && <span className="text-slate-700">{tr(userOpt.text)}</span>}
                              </div>
                              <div className="p-2.5 rounded-xl bg-white border border-emerald-200/80">
                                <span className="font-bold text-emerald-700 block mb-0.5">
                                  {language === 'zh' ? '正确答案' : 'Correct Answer'}: {q.correctOptionId}
                                </span>
                                {correctOpt && <span className="text-slate-800">{tr(correctOpt.text)}</span>}
                              </div>
                            </div>

                            <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200/60 text-slate-700 leading-relaxed">
                              <span className="font-bold text-slate-800 mr-1">
                                {language === 'zh' ? '解析:' : 'Explanation:'}
                              </span>
                              {tr(q.overallExplanation)}
                            </div>
                          </div>
                        );
                      })}
                    {mockReviewFilter === 'incorrect' &&
                      mockExam.questions.filter((q) => mockExam.userAnswers[q.id] !== q.correctOptionId).length ===
                        0 && (
                        <div className="p-6 text-center text-emerald-700 font-semibold bg-emerald-50 rounded-2xl border border-emerald-200 text-xs">
                          {language === 'zh' ? '太厉害了！本次模拟考全对无错题！' : 'Perfect score — zero missed questions!'}
                        </div>
                      )}
                  </div>
                </div>

                {/* Restart Mock Button */}
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => handleStartMockExam(selectedExamLength)}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{language === 'zh' ? '再刷一套全新变式模考' : 'Start Another Mock Exam'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: MISTAKE NOTEBOOK (智能错题消灭本) */}
      {/* ========================================================================= */}
      {activeTab === 'mistakes' && (
        <div className="space-y-6">
          {activeDrillMistake ? (() => {
            const liveRecord = mistakes.find(
              (m) => m.questionId === activeDrillMistake.originalRecord.questionId
            );
            const currentStreak = liveRecord ? liveRecord.consecutiveCorrect : 2;
            const isDrillCorrect =
              activeDrillMistake.chosenOption === activeDrillMistake.variantQuestion.correctOptionId;

            return (
              // Targeted Drill Card for Single Mistake
              <div className="bg-white rounded-3xl border border-rose-200 shadow-md p-6 sm:p-8 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-rose-100">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-rose-600" />
                      {language === 'zh' ? '错题靶向变式强化' : 'Mistake Targeted Variant'}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-slate-100 text-slate-700">
                      {language === 'zh'
                        ? `连对进度: ${Math.min(2, currentStreak)} / 2`
                        : `Mastery Streak: ${Math.min(2, currentStreak)} / 2`}
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveDrillMistake(null)}
                    className="text-xs text-slate-500 hover:text-slate-800 underline"
                  >
                    {language === 'zh' ? '返回错题列表' : 'Back to Mistake List'}
                  </button>
                </div>

                <p className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed">
                  {tr(activeDrillMistake.variantQuestion.prompt)}
                </p>

                <div className="space-y-3 pt-2">
                  {activeDrillMistake.variantQuestion.options.map((opt) => {
                    const isSelected = activeDrillMistake.chosenOption === opt.id;
                    const isCorrect =
                      opt.id === activeDrillMistake.variantQuestion.correctOptionId;

                    let optStyle = 'border-slate-200 hover:border-rose-300';
                    let badgeStyle = 'border-slate-300 text-slate-600';
                    if (activeDrillMistake.isSubmitted) {
                      if (isCorrect) {
                        optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold';
                        badgeStyle = 'bg-emerald-600 text-white border-emerald-600';
                      } else if (isSelected) {
                        optStyle = 'border-rose-500 bg-rose-50 text-rose-950';
                        badgeStyle = 'bg-rose-600 text-white border-rose-600';
                      } else {
                        optStyle = 'border-slate-200/70 opacity-60 bg-slate-50/50';
                      }
                    } else if (isSelected) {
                      optStyle = 'border-rose-600 bg-rose-50/60 ring-2 ring-rose-500/20';
                      badgeStyle = 'bg-rose-600 text-white border-rose-600';
                    }

                    return (
                      <div
                        key={opt.id}
                        onClick={() => {
                          if (!activeDrillMistake.isSubmitted) {
                            setActiveDrillMistake((prev) =>
                              prev ? { ...prev, chosenOption: opt.id } : null
                            );
                          }
                        }}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${optStyle}`}
                      >
                        <div
                          className={`w-6 h-6 rounded-lg border flex items-center justify-center font-bold text-xs shrink-0 ${badgeStyle}`}
                        >
                          {opt.id}
                        </div>
                        <div className="flex-1">
                          <span>{tr(opt.text)}</span>
                          {activeDrillMistake.isSubmitted && (
                            <div className="text-xs mt-1 text-slate-600 pt-1 border-t border-slate-100">
                              {tr(opt.explanation)}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {activeDrillMistake.isSubmitted && (
                  <div className="space-y-3">
                    <div
                      className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center gap-2 ${
                        isDrillCorrect
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-rose-50 border-rose-200 text-rose-800'
                      }`}
                    >
                      {isDrillCorrect ? (
                        liveRecord ? (
                          <span>
                            {language === 'zh'
                              ? '回答正确！连对次数更新为 1 / 2，再答对 1 道相似变式即可从错题本中消除。'
                              : 'Correct! Streak updated to 1 / 2 — answer 1 more similar variant correctly to clear this mistake.'}
                          </span>
                        ) : (
                          <span>
                            {language === 'zh'
                              ? '连续两次答对同类变式！该易错考点已彻底攻克并从错题本消除。'
                              : '2 consecutive correct answers! This concept has been mastered and cleared from your Mistake Notebook.'}
                          </span>
                        )
                      ) : (
                        <span>
                          {language === 'zh'
                            ? '本次回答有误，连对计数已重置为 0 / 2。请结合解析复盘后再挑战一道新变式！'
                            : 'Incorrect — consecutive mastery streak has been reset to 0 / 2. Review the explanation and try another variant.'}
                        </span>
                      )}
                    </div>

                    <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/70 text-xs text-slate-700 leading-relaxed space-y-1">
                      <div className="font-bold text-blue-900">
                        {language === 'zh' ? '核心思路精讲' : 'Detailed Economic Logic'}
                      </div>
                      <p>{tr(activeDrillMistake.variantQuestion.overallExplanation)}</p>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 flex flex-wrap justify-between items-center gap-3">
                  {!activeDrillMistake.isSubmitted ? (
                    <button
                      onClick={handleSubmitMistakeDrill}
                      disabled={!activeDrillMistake.chosenOption}
                      className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      {t.checkAnswerBtn}
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setActiveDrillMistake(null)}
                        className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                      >
                        {language === 'zh' ? '返回错题列表' : 'Back to Mistake List'}
                      </button>
                      {liveRecord && (
                        <button
                          onClick={() => handleStartMistakeDrill(liveRecord)}
                          className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>{language === 'zh' ? '再练一道同类变式' : 'Next Similar Variant'}</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })() : mistakes.length === 0 ? (
            // Empty Mistake Book
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">
                {language === 'zh' ? '错题本空空如也，保持得太棒了！' : 'Mistake Notebook is Empty! Great Job!'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                {language === 'zh'
                  ? '在“无限动态变式演练”中答错的题目会自动收集到这里，并提供专属相似变式题消灭训练。'
                  : 'Questions you miss in practice will be automatically cataloged here for targeted elimination drills.'}
              </p>
            </div>
          ) : (
            // Mistake List
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 pb-2">
                <span>
                  {language === 'zh'
                    ? `已记录 ${mistakes.length} 道待强化的易错考点（连对 2 次同类变式即可彻底攻克消除）：`
                    : `${mistakes.length} concepts to review (Answer 2 similar variants correctly to clear):`}
                </span>
                <button
                  onClick={() => setMistakes([])}
                  className="text-rose-600 hover:underline cursor-pointer"
                >
                  {language === 'zh' ? '清空全部错题' : 'Clear All Mistakes'}
                </button>
              </div>

              {mistakes.map((m) => (
                <div
                  key={m.questionId}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 hover:border-slate-300 transition-all"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        Unit {m.unit} ({m.topicCode})
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-slate-100 text-slate-600">
                        {language === 'zh' ? `连对 ${m.consecutiveCorrect}/2` : `Streak ${m.consecutiveCorrect}/2`}
                      </span>
                    </div>
                    <button
                      onClick={() => handleStartMistakeDrill(m)}
                      className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>{t.clearMistakeBtn}</span>
                    </button>
                  </div>

                  <p className="text-sm font-medium text-slate-800 leading-relaxed">
                    {tr(m.prompt)}
                  </p>

                  <div className="text-xs p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-700 space-y-1">
                    <div className="text-rose-700 font-medium">
                      ❌ {language === 'zh' ? '当时错选项' : 'Your Answer'}:{' '}
                      {m.userWrongOptionId === 'SKIPPED'
                        ? language === 'zh'
                          ? '未作答'
                          : 'Unanswered'
                        : m.userWrongOptionId}{' '}
                      | ✅ {language === 'zh' ? '正确答案' : 'Correct'}: {m.correctOptionId}
                    </div>
                    <div className="text-slate-600 leading-relaxed pt-1">
                      {tr(m.explanation)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: CLASSIC CURATED QUESTIONS (精选固定真题库) */}
      {/* ========================================================================= */}
      {activeTab === 'classic' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <span className="text-xs font-bold text-slate-500 mr-1 shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              {t.filterByUnit}:
            </span>
            {[0, 1, 2, 3, 4, 5, 6].map((unitNum) => (
              <button
                key={unitNum}
                onClick={() => {
                  setSelectedUnit(unitNum);
                  setClassicIndex(0);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                  selectedUnit === unitNum
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {unitNum === 0 ? t.allUnitsFilter : `Unit ${unitNum}`}
              </button>
            ))}
          </div>

          {currentClassic && (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
              {/* Question Header & Dynamic Variant Toggle */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-600">
                    {language === 'zh'
                      ? `第 ${classicIndex + 1} / ${filteredClassic.length} 题 · 第 ${activeClassic.unit} 单元`
                      : `Question ${classicIndex + 1} of ${filteredClassic.length} · Unit ${activeClassic.unit}`}
                  </span>
                  {classicVariants[currentClassic.id] ? (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-mono text-[11px] font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      <span>{language === 'zh' ? '动态参数变式题' : 'Live Numerical Variant'}</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono text-[11px] font-semibold">
                      {language === 'zh' ? '经典考纲原题' : 'CED Archetype'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {currentClassic.templateId && (
                    <button
                      onClick={() => {
                        const variant = generateSimilarQuestion(currentClassic.templateId);
                        setClassicVariants((prev) => ({
                          ...prev,
                          [currentClassic.id]: variant
                        }));
                        setClassicSubmitted((prev) => ({ ...prev, [currentClassic.id]: false }));
                        setClassicAnswers((prev) => {
                          const next = { ...prev };
                          delete next[currentClassic.id];
                          return next;
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 border border-amber-300 transition-colors shadow-2xs"
                      title={language === 'zh' ? '换一组全新随机数值与背景重算此题' : 'Generate new randomized numbers and scenario'}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>{language === 'zh' ? '🔀 生成本题动态变式' : 'Generate Live Variant'}</span>
                    </button>
                  )}

                  {classicVariants[currentClassic.id] && (
                    <button
                      onClick={() => {
                        setClassicVariants((prev) => {
                          const next = { ...prev };
                          delete next[currentClassic.id];
                          return next;
                        });
                        setClassicSubmitted((prev) => ({ ...prev, [currentClassic.id]: false }));
                        setClassicAnswers((prev) => {
                          const next = { ...prev };
                          delete next[currentClassic.id];
                          return next;
                        });
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors"
                      title={language === 'zh' ? '恢复考纲原题' : 'Restore original archetype'}
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{language === 'zh' ? '还原原题' : 'Restore'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => navigateToTopic(activeClassic.topicId)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    <span>{t.openGraph}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed font-sans">
                {tr(activeClassic.prompt)}
              </p>

              <div className="space-y-3 pt-2">
                {activeClassic.options.map((opt) => {
                  const isSubmitted = classicSubmitted[currentClassic.id];
                  const isSelected = classicAnswers[currentClassic.id] === opt.id;
                  const isCorrect = opt.id === activeClassic.correctOptionId;

                  let style = 'border-slate-200 hover:border-blue-300';
                  if (isSubmitted) {
                    if (isCorrect) style = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold';
                    else if (isSelected) style = 'border-rose-400 bg-rose-50 text-rose-950';
                  } else if (isSelected) {
                    style = 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20';
                  }

                  return (
                    <div
                      key={opt.id}
                      onClick={() => {
                        if (!isSubmitted) {
                          setClassicAnswers((prev) => ({
                            ...prev,
                            [currentClassic.id]: opt.id
                          }));
                        }
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${style}`}
                    >
                      <div className="w-6 h-6 rounded-lg border flex items-center justify-center font-bold text-xs shrink-0">
                        {opt.id}
                      </div>
                      <div className="flex-1">
                        <span>{tr(opt.text)}</span>
                        {isSubmitted && (
                          <div className="text-xs mt-1 text-slate-600 pt-1 border-t border-slate-100">
                            {tr(opt.explanation)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setClassicIndex(Math.max(0, classicIndex - 1))}
                  disabled={classicIndex === 0}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 disabled:opacity-30"
                >
                  {t.prevQuestionBtn}
                </button>

                {!classicSubmitted[currentClassic.id] ? (
                  <button
                    onClick={() => {
                      const chosen = classicAnswers[currentClassic.id];
                      if (chosen) {
                        setClassicSubmitted((prev) => ({
                          ...prev,
                          [currentClassic.id]: true
                        }));

                        // If answer is incorrect, save to Mistake Notebook with valid templateId for targeted drill
                        const isAnsCorrect = chosen === activeClassic.correctOptionId;
                        if (!isAnsCorrect) {
                          const mistakeRecord: MistakeRecord = {
                            questionId: activeClassic.id,
                            templateId: activeClassic.templateId || currentClassic.templateId || 'dyn-ppc-opp-cost',
                            unit: activeClassic.unit,
                            topicCode: activeClassic.topicCode,
                            topicId: activeClassic.topicId,
                            prompt: activeClassic.prompt,
                            userWrongOptionId: chosen,
                            correctOptionId: activeClassic.correctOptionId,
                            explanation: activeClassic.overallExplanation,
                            timestamp: Date.now(),
                            consecutiveCorrect: 0
                          };
                          setMistakes((prev) => [
                            mistakeRecord,
                            ...prev.filter((m) => m.questionId !== mistakeRecord.questionId)
                          ]);
                        }
                      }
                    }}
                    disabled={!classicAnswers[currentClassic.id]}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs bg-blue-600 text-white disabled:opacity-40"
                  >
                    {t.checkAnswerBtn}
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      setClassicIndex(
                        Math.min(filteredClassic.length - 1, classicIndex + 1)
                      )
                    }
                    disabled={classicIndex === filteredClassic.length - 1}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white disabled:opacity-30"
                  >
                    {t.nextQuestionBtn}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
