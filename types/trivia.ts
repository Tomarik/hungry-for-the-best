export type Difficulty = "easy" | "medium" | "hard";

export type Tag = "geography" | "history" | "science" | "pop_culture";

export const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];
export const TAGS: Tag[] = ["geography", "history", "science", "pop_culture"];

export interface TriviaQuestion {
  id: string;
  question: string;
  answers: string[];
  difficulty: Difficulty;
  tags: Tag[];
  answeredCorrectly: boolean;
  answeredOn: string | null;
  isDeleted: boolean;
  flaggedForReview: boolean;
}

export interface CreateTriviaInput {
  question: string;
  answers: string[];
  difficulty: Difficulty;
  tags: Tag[];
}