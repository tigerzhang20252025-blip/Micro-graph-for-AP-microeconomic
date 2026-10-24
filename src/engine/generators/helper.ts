import { PracticeOption } from '../../data/practiceQuestions';
import { BilingualText } from '../../types/registry';

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export interface RawOptionSpec {
  isCorrect: boolean;
  text: BilingualText;
  explanation: BilingualText;
}

/**
 * Shuffles 1 correct option and 3 distractors, assigning them IDs 'A', 'B', 'C', 'D'
 * and returning the structured options array along with the correctOptionId.
 */
export function buildFourOptions(
  correctOpt: { text: BilingualText; explanation: BilingualText },
  distractors: Array<{ text: BilingualText; explanation: BilingualText }>
): { options: PracticeOption[]; correctOptionId: 'A' | 'B' | 'C' | 'D' } {
  // Ensure we have at least 3 distractors
  const chosenDistractors = shuffleArray(distractors).slice(0, 3);
  
  const rawList: RawOptionSpec[] = [
    { isCorrect: true, text: correctOpt.text, explanation: correctOpt.explanation },
    ...chosenDistractors.map(d => ({ isCorrect: false, text: d.text, explanation: d.explanation }))
  ];

  const shuffled = shuffleArray(rawList);
  const ids: Array<'A' | 'B' | 'C' | 'D'> = ['A', 'B', 'C', 'D'];
  let correctId: 'A' | 'B' | 'C' | 'D' = 'A';

  const options: PracticeOption[] = shuffled.map((item, idx) => {
    const optId = ids[idx];
    if (item.isCorrect) {
      correctId = optId;
    }
    return {
      id: optId,
      text: item.text,
      explanation: item.explanation
    };
  });

  return { options, correctOptionId: correctId };
}
