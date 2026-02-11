import type {
  TriviaQuestion,
  CreateTriviaInput,
  Difficulty,
  Tag,
} from "../types/trivia.ts";

/// <reference lib="deno.unstable" />

let kv: Deno.Kv;

async function getKv() {
  if (!kv) {
    kv = await Deno.openKv();
  }
  return kv;
}

// --- Create ---

export async function createTrivia(
  input: CreateTriviaInput,
): Promise<TriviaQuestion> {
  const id = crypto.randomUUID();
  const question: TriviaQuestion = {
    id,
    question: input.question,
    answers: input.answers,
    difficulty: input.difficulty,
    tags: input.tags,
    answeredCorrectly: false,
    answeredOn: null,
    isDeleted: false,
    flaggedForReview: false,
  };

  const kv = await getKv();
  const atomic = kv.atomic();

  // Primary key
  atomic.set(["trivia", id], question);

  // Difficulty index
  atomic.set(["trivia_by_difficulty", input.difficulty, id], id);

  // Tag indexes
  for (const tag of input.tags) {
    atomic.set(["trivia_by_tag", tag, id], id);
  }

  const result = await atomic.commit();
  if (!result.ok) {
    throw new Error("Failed to create trivia question");
  }

  return question;
}

// --- Read (single) ---

export async function getTriviaById(
  id: string,
): Promise<TriviaQuestion | null> {
  const kv = await getKv();
  const entry = await kv.get<TriviaQuestion>(["trivia", id]);
  return entry.value;
}

// --- Read (all, excluding soft-deleted) ---

export async function getAllTrivia(): Promise<TriviaQuestion[]> {
  const kv = await getKv();
  const results: TriviaQuestion[] = [];
  const entries = kv.list<TriviaQuestion>({ prefix: ["trivia"] });

  for await (const entry of entries) {
    // Skip secondary index keys — primary keys have exactly 2 parts
    if (entry.key.length !== 2) continue;
    const question = entry.value;
    if (!question.isDeleted) {
      results.push(question);
    }
  }

  return results;
}

// --- Read (by difficulty) ---

export async function getTriviaByDifficulty(
  difficulty: Difficulty,
): Promise<TriviaQuestion[]> {
  const kv = await getKv();
  const results: TriviaQuestion[] = [];
  const entries = kv.list<string>({
    prefix: ["trivia_by_difficulty", difficulty],
  });

  for await (const entry of entries) {
    const id = entry.value;
    // getTriviaById handles its own getKv call, but since we are awaiting, it is safe.
    const question = await getTriviaById(id);
    if (question && !question.isDeleted) {
      results.push(question);
    }
  }

  return results;
}

// --- Read (by tag) ---

export async function getTriviaByTag(tag: Tag): Promise<TriviaQuestion[]> {
  const kv = await getKv();
  const results: TriviaQuestion[] = [];
  const entries = kv.list<string>({ prefix: ["trivia_by_tag", tag] });

  for await (const entry of entries) {
    const id = entry.value;
    const question = await getTriviaById(id);
    if (question && !question.isDeleted) {
      results.push(question);
    }
  }

  return results;
}

// --- Read (unanswered by difficulty) ---

export async function getUnansweredByDifficulty(
  difficulty: Difficulty,
): Promise<TriviaQuestion[]> {
  const questions = await getTriviaByDifficulty(difficulty);
  return questions.filter((q) => !q.answeredCorrectly);
}

// --- Read (flagged for review) ---

export async function getFlaggedTrivia(): Promise<TriviaQuestion[]> {
  const all = await getAllTrivia();
  return all.filter((q) => q.flaggedForReview);
}

// --- Update ---

export async function updateTrivia(
  id: string,
  updates: Partial<Omit<TriviaQuestion, "id">>,
): Promise<TriviaQuestion | null> {
  // We need the KV instance for the atomic operation later
  const kv = await getKv();
  
  const existing = await getTriviaById(id);
  if (!existing) return null;

  const updated: TriviaQuestion = { ...existing, ...updates };
  const atomic = kv.atomic();

  // If difficulty changed, remove old index and add new
  if (updates.difficulty && updates.difficulty !== existing.difficulty) {
    atomic.delete(["trivia_by_difficulty", existing.difficulty, id]);
    atomic.set(["trivia_by_difficulty", updates.difficulty, id], id);
  }

  // If tags changed, remove old indexes and add new
  if (updates.tags) {
    for (const oldTag of existing.tags) {
      atomic.delete(["trivia_by_tag", oldTag, id]);
    }
    for (const newTag of updates.tags) {
      atomic.set(["trivia_by_tag", newTag, id], id);
    }
  }

  // Update primary record
  atomic.set(["trivia", id], updated);

  const result = await atomic.commit();
  if (!result.ok) {
    throw new Error("Failed to update trivia question");
  }

  return updated;
}

// --- Mark as answered correctly ---

export function markAnswered(id: string): Promise<TriviaQuestion | null> {
  return updateTrivia(id, {
    answeredCorrectly: true,
    answeredOn: new Date().toISOString(),
  });
}

// --- Reset answer status ---

export function resetAnswered(
  id: string,
): Promise<TriviaQuestion | null> {
  return updateTrivia(id, {
    answeredCorrectly: false,
    answeredOn: null,
  });
}

// --- Toggle flag for review ---

export async function toggleFlagged(
  id: string,
): Promise<TriviaQuestion | null> {
  const existing = await getTriviaById(id);
  if (!existing) return null;
  return updateTrivia(id, { flaggedForReview: !existing.flaggedForReview });
}

// --- Soft delete ---

export function deleteTrivia(
  id: string,
): Promise<TriviaQuestion | null> {
  return updateTrivia(id, { isDeleted: true });
}

// --- Hard delete (permanently removes from KV) ---

export async function hardDeleteTrivia(id: string): Promise<boolean> {
  const kv = await getKv();
  const existing = await getTriviaById(id);
  if (!existing) return false;

  const atomic = kv.atomic();

  // Remove primary key
  atomic.delete(["trivia", id]);

  // Remove difficulty index
  atomic.delete(["trivia_by_difficulty", existing.difficulty, id]);

  // Remove tag indexes
  for (const tag of existing.tags) {
    atomic.delete(["trivia_by_tag", tag, id]);
  }

  const result = await atomic.commit();
  return result.ok;
}

// --- Reset all answers (useful between parties) ---

export async function resetAllAnswers(): Promise<number> {
  const all = await getAllTrivia();
  let count = 0;

  for (const question of all) {
    if (question.answeredCorrectly) {
      await resetAnswered(question.id);
      count++;
    }
  }

  return count;
}