export type Track = "beginner" | "intermediate" | "advanced";
export type Category = "business" | "cli" | "hooks" | "mcp" | "agent_sdk" | "ide";
export type BadgeTier = "bronze" | "silver" | "gold";

export interface Question {
  id: string;
  track: Track;
  category: Category;
  statement: string; // resolved from statement_pt or statement_en
  explanation: string; // resolved from explanation_pt or explanation_en
  source_url: string;
  weight: number;
  correct_answer: boolean;
}

export interface QuestionDB {
  id: string;
  track: Track;
  category: Category;
  statement_pt: string;
  statement_en: string;
  correct_answer: boolean;
  explanation_pt: string;
  explanation_en: string;
  source_url: string;
  weight: number;
  active: boolean;
}

export interface Answer {
  qid: string;
  chosen: boolean;
  time_ms: number;
}

export interface AnswerResult extends Answer {
  correct: boolean;
}

export interface ScoreResult {
  score: number;
  correctCount: number;
  percentage: number;
  badgeTier: BadgeTier | null;
  answers: AnswerResult[];
}

export interface Result {
  id: string;
  nickname: string;
  track: Track;
  round_size: number;
  correct_count: number;
  score: number;
  percentage: number;
  duration_ms: number;
  badge_tier: BadgeTier | null;
  timer_enabled: boolean;
  question_ids: string[];
  answers: AnswerResult[];
  created_at: string;
}

export interface RankingEntry {
  id: string;
  nickname: string;
  track: Track;
  score: number;
  percentage: number;
  duration_ms: number;
  badge_tier: BadgeTier | null;
  created_at: string;
}

export interface PostResultRequest {
  nickname: string;
  track: Track;
  roundSize: number;
  timerEnabled: boolean;
  durationMs: number;
  answers: Answer[];
}

export interface PostResultResponse {
  id: string;
  score: number;
  percentage: number;
  correctCount: number;
  badgeTier: BadgeTier | null;
  rankingPosition: number | null;
  answers: AnswerResult[];
}
