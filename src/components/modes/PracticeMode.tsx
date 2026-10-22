import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAppState } from '../../context/AppStateContext';
import { PRACTICE_QUESTIONS, PracticeQuestion } from '../../data/practiceQuestions';
import {
  BrainCircuit,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  ExternalLink,
  Award,
  Filter
} from 'lucide-react';

export const PracticeMode: React.FC = () => {
  const { language, t, tr } = useLanguage();
  const { navigateToGraph } = useAppState();

  const [selectedUnit, setSelectedUnit] = useState<number>(0); // 0 = all units
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, boolean>>({});
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  // Filtered question set
  const filteredQuestions = PRACTICE_QUESTIONS.filter((q) => {
    if (selectedUnit === 0) return true;
    return q.unit === selectedUnit;
  });

  const activeQuestionIndex = Math.min(currentQuestionIndex, Math.max(0, filteredQuestions.length - 1));
  const currentQ: PracticeQuestion | undefined = filteredQuestions[activeQuestionIndex];

  // Scoring
  const totalAnswered = Object.keys(submittedQuestions).length;
  let correctCount = 0;
  PRACTICE_QUESTIONS.forEach((q) => {
    if (submittedQuestions[q.id] && userAnswers[q.id] === q.correctOptionId) {
      correctCount++;
    }
  });

  const handleSelectOption = (optId: 'A' | 'B' | 'C' | 'D') => {
    if (!currentQ || submittedQuestions[currentQ.id]) return;
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: optId }));
    setWarningMessage(null);
  };

  const handleSubmitAnswer = () => {
    if (!currentQ) return;
    if (!userAnswers[currentQ.id]) {
      setWarningMessage(t.pleaseSelectOptionWarning);
      return;
    }
    setSubmittedQuestions((prev) => ({ ...prev, [currentQ.id]: true }));
    setWarningMessage(null);
  };

  const handleRetryQuestion = () => {
    if (!currentQ) return;
    setSubmittedQuestions((prev) => {
      const next = { ...prev };
      delete next[currentQ.id];
      return next;
    });
    setUserAnswers((prev) => {
      const next = { ...prev };
      delete next[currentQ.id];
      return next;
    });
    setWarningMessage(null);
  };

  const handleResetSession = () => {
    setUserAnswers({});
    setSubmittedQuestions({});
    setCurrentQuestionIndex(0);
    setWarningMessage(null);
  };

  const handleNext = () => {
    if (activeQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(activeQuestionIndex + 1);
      setWarningMessage(null);
    }
  };

  const handlePrev = () => {
    if (activeQuestionIndex > 0) {
      setCurrentQuestionIndex(activeQuestionIndex - 1);
      setWarningMessage(null);
    }
  };

  if (!currentQ) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-600">No questions found for the selected filter.</p>
        <button
          onClick={() => setSelectedUnit(0)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          View All Units
        </button>
      </div>
    );
  }

  const isSubmitted = submittedQuestions[currentQ.id] || false;
  const chosenOption = userAnswers[currentQ.id];
  const isCorrect = chosenOption === currentQ.correctOptionId;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold backdrop-blur-sm">
            <BrainCircuit className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.practiceModeTitle}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-200/90 bg-white/10 px-3 py-1 rounded-full">
            <Award className="w-3.5 h-3.5 text-yellow-300" />
            <span>
              {language === 'zh'
                ? `正确率: ${correctCount} / ${totalAnswered} (${totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0}%)`
                : `Score: ${correctCount} / ${totalAnswered} (${totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0}%)`}
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {language === 'zh'
            ? `第 ${currentQ.unit} 单元重点强化自测`
            : `Unit ${currentQ.unit} Targeted MCQ Practice`}
        </h1>

        <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-sans">
          {t.practiceModeSubtitle}
        </p>
      </div>

      {/* Unit Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mr-2 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          <span>{t.filterByUnit}:</span>
        </div>

        <button
          onClick={() => {
            setSelectedUnit(0);
            setCurrentQuestionIndex(0);
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
            selectedUnit === 0
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50'
          }`}
        >
          {t.allUnitsFilter}
        </button>

        {[1, 2, 3, 4, 5, 6].map((u) => (
          <button
            key={u}
            onClick={() => {
              setSelectedUnit(u);
              setCurrentQuestionIndex(0);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
              selectedUnit === u
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Unit {u}
          </button>
        ))}
      </div>

      {/* Progress & Meta Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span className="font-semibold text-slate-700">
          {t.questionNumber} {activeQuestionIndex + 1} / {filteredQuestions.length}
        </span>

        <span className="font-mono bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-bold">
          CED Topic {currentQ.topicCode}
        </span>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-6">
        {/* Prompt */}
        <div className="space-y-2">
          <p className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed font-sans">
            {tr(currentQ.prompt)}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((opt) => {
            const isSelected = chosenOption === opt.id;
            let optStyle =
              'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-800';

            if (isSubmitted) {
              if (opt.id === currentQ.correctOptionId) {
                optStyle =
                  'border-emerald-500 bg-emerald-50/90 text-emerald-950 font-medium ring-1 ring-emerald-500';
              } else if (isSelected && opt.id !== currentQ.correctOptionId) {
                optStyle =
                  'border-red-400 bg-red-50/90 text-red-950 font-medium ring-1 ring-red-400';
              } else {
                optStyle = 'border-slate-100 bg-slate-50/30 text-slate-400 opacity-60';
              }
            } else if (isSelected) {
              optStyle =
                'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-medium ring-1 ring-emerald-600 shadow-xs';
            }

            return (
              <div
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                className={`p-4 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer flex items-start gap-3.5 ${optStyle}`}
              >
                <div className="pt-0.5 shrink-0">
                  <div
                    className={`w-6 h-6 rounded-full border text-xs font-bold flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-300 bg-white text-slate-600'
                    }`}
                  >
                    {opt.id}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="leading-relaxed font-sans">{tr(opt.text)}</span>
                  {isSubmitted && (
                    <p className="text-xs mt-1.5 leading-relaxed opacity-90 border-t border-slate-200/50 pt-1.5">
                      {tr(opt.explanation)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Warning Banner */}
        {warningMessage && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>{warningMessage}</span>
          </div>
        )}

        {/* Action Buttons */}
        {!isSubmitted ? (
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSubmitAnswer}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 active:scale-95"
            >
              <span>{t.checkAnswerBtn}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="space-y-5 pt-2 border-t border-slate-100">
            {/* Feedback Banner */}
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 ${
                isCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-red-50 border-red-300 text-red-950'
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              )}
              <div className="text-xs sm:text-sm space-y-1 font-sans">
                <p className="font-bold">
                  {isCorrect ? (
                    language === 'zh' ? '回答正确！掌握了核心考点。' : 'Correct! You mastered this key concept.'
                  ) : (
                    language === 'zh' ? '回答有误，请仔细阅读下方的错因拆解与考点提示。' : 'Incorrect. Check the explanation and common traps below.'
                  )}
                </p>
                <p className="text-xs leading-relaxed opacity-90">
                  {tr(currentQ.overallExplanation)}
                </p>
              </div>
            </div>

            {/* Common Mistake Alert */}
            {currentQ.commonMistakeAlert && (
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/90 space-y-1.5 text-xs text-amber-950 font-sans">
                <span className="font-bold flex items-center gap-1.5 text-amber-800 uppercase tracking-wider text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{t.commonMistakesHeader}</span>
                </span>
                <p className="leading-relaxed pl-5">
                  {tr(currentQ.commonMistakeAlert)}
                </p>
              </div>
            )}

            {/* Navigation and Next controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  disabled={activeQuestionIndex === 0}
                  onClick={handlePrev}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activeQuestionIndex === 0
                      ? 'text-slate-300 border border-slate-100 cursor-not-allowed'
                      : 'text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t.prevQuestionBtn}</span>
                </button>

                <button
                  onClick={handleRetryQuestion}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t.retryQuestionBtn}</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigateToGraph(currentQ.topicId, currentQ.topicId)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900"
                >
                  <span>{t.openGraph}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                {activeQuestionIndex < filteredQuestions.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-2 transition-all active:scale-95"
                  >
                    <span>{t.nextQuestionBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleResetSession}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-xs transition-all"
                  >
                    {t.resetPracticeSessionBtn}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Session Question Navigator Dots */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span>{language === 'zh' ? '全卷试题快速导航' : 'Question Quick Navigator'}</span>
          <button
            onClick={handleResetSession}
            className="text-[11px] text-slate-400 hover:text-slate-600 font-normal"
          >
            {t.resetPracticeSessionBtn}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {filteredQuestions.map((q, idx) => {
            const isCurrent = idx === activeQuestionIndex;
            const submitted = submittedQuestions[q.id];
            const correct = userAnswers[q.id] === q.correctOptionId;

            let dotStyle = 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200';
            if (submitted) {
              dotStyle = correct
                ? 'bg-emerald-500 text-white border-emerald-600'
                : 'bg-red-500 text-white border-red-600';
            } else if (isCurrent) {
              dotStyle = 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-300';
            }

            return (
              <button
                key={q.id}
                onClick={() => {
                  setCurrentQuestionIndex(idx);
                  setWarningMessage(null);
                }}
                className={`w-8 h-8 rounded-xl border text-xs font-bold flex items-center justify-center transition-all ${dotStyle}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
