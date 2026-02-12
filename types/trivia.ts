export type Difficulty = "easy" | "medium" | "hard";

export type Tag =

  | "general"
  | "geography"
  | "food"
  | "history"
  | "science"
  | "pop_culture"
  | "music"
  | "space"
  | "tv"
  | "movie"
  | "brand"
  | "tech"
  | "sport"
  | "art"
  | "animal"
  | "holiday"
  | "health"
  | "video_game"
  | "travel"
  | "toy";

export const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];
export const TAGS: Tag[] = [

  "general",
  "geography",
  "food",
  "history",
  "holiday",
  "science",
  "pop_culture",
  "music",
  "space",
  "tv",
  "movie",
  "brand",
  "tech",
  "sport",
  "art",
  "animal",
  "health",
  "video_game",
  "travel",
  "toy",
];

export interface TriviaQuestion {
  id: string;
  question: string;
  answers: string[];
  difficulty: Difficulty;
  tags: Tag[];
  customTags: string[];
  answeredCorrectly: boolean;
  answeredOn: string | null;
  flaggedForReview: boolean;
}

export interface CreateTriviaInput {
  question: string;
  answers: string[];
  difficulty: Difficulty;
  tags: Tag[];
  customTags: string[];
}