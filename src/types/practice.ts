import { BilingualText } from './registry';
import { PracticeQuestion } from '../data/practiceQuestions';

export interface DynamicQuestionTemplate {
  templateId: string;
  unit: number;
  topicCode: string;
  topicId: string;
  title: BilingualText;
  description: BilingualText;
  generate: () => PracticeQuestion;
}

export interface MistakeRecord {
  questionId: string;
  templateId?: string;
  unit: number;
  topicCode: string;
  topicId: string;
  prompt: BilingualText;
  userWrongOptionId: 'A' | 'B' | 'C' | 'D';
  correctOptionId: 'A' | 'B' | 'C' | 'D';
  explanation: BilingualText;
  timestamp: number;
  consecutiveCorrect: number; // 2 consecutive correct removes it from mistake book
}

export interface MockExamState {
  isActive: boolean;
  totalQuestions: number;
  timeRemainingSeconds: number;
  questions: PracticeQuestion[];
  userAnswers: Record<string, 'A' | 'B' | 'C' | 'D'>;
  submitted: boolean;
  score?: {
    correct: number;
    total: number;
    percentage: number;
    apScoreEstimate: 1 | 2 | 3 | 4 | 5;
    unitBreakdown: Record<number, { correct: number; total: number }>;
  };
}
