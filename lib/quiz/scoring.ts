import type { Answer, AnswerResult, BadgeTier, ScoreResult } from "./types";

interface ScoringQuestion {
  id: string;
  correctAnswer: boolean;
  weight: number;
}

export function calculateScore(
  answers: Answer[],
  questions: ScoringQuestion[],
  roundSize: number
): ScoreResult {
  const qMap = new Map(questions.map((q) => [q.id, q]));
  let score = 0;
  let correctCount = 0;
  const answerResults: AnswerResult[] = [];

  for (const a of answers) {
    const q = qMap.get(a.qid);
    if (!q) continue;
    const correct = a.chosen === q.correctAnswer;
    if (correct) {
      score += q.weight;
      correctCount += 1;
    }
    answerResults.push({ ...a, correct });
  }

  const percentage = roundSize > 0 ? (correctCount / roundSize) * 100 : 0;
  const badgeTier: BadgeTier | null =
    percentage >= 90 ? "gold"
    : percentage >= 80 ? "silver"
    : percentage >= 70 ? "bronze"
    : null;

  return { score, correctCount, percentage, badgeTier, answers: answerResults };
}
