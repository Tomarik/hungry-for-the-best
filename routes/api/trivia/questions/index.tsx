import { define } from "../../../../utils.ts";
import {
  createTrivia,
  getAllTrivia,
  getTriviaByDifficulty,
  getTriviaByTag,
  getUnansweredByDifficulty,
  getFlaggedTrivia,
} from "../../../../services/trivia.ts";
import { DIFFICULTIES, TAGS } from "../../../../types/trivia.ts";
import type { Difficulty, Tag } from "../../../../types/trivia.ts";

export const handler = define.handlers({
  // GET /api/trivia/questions
  // Query params: difficulty, tag, unanswered, flagged
  async GET(ctx) {
    const url = new URL(ctx.req.url);
    const difficulty = url.searchParams.get("difficulty") as Difficulty | null;
    const tag = url.searchParams.get("tag") as Tag | null;
    const unanswered = url.searchParams.get("unanswered") === "true";
    const flagged = url.searchParams.get("flagged") === "true";

    try {
      let questions;

      if (flagged) {
        questions = await getFlaggedTrivia();
      } else if (unanswered && difficulty) {
        if (!DIFFICULTIES.includes(difficulty)) {
          return new Response(
            JSON.stringify({ error: "Invalid difficulty", validOptions: DIFFICULTIES }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }
        questions = await getUnansweredByDifficulty(difficulty);
      } else if (difficulty) {
        if (!DIFFICULTIES.includes(difficulty)) {
          return new Response(
            JSON.stringify({ error: "Invalid difficulty", validOptions: DIFFICULTIES }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }
        questions = await getTriviaByDifficulty(difficulty);
      } else if (tag) {
        if (!TAGS.includes(tag)) {
          return new Response(
            JSON.stringify({ error: "Invalid tag", validOptions: TAGS }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }
        questions = await getTriviaByTag(tag);
      } else {
        questions = await getAllTrivia();
      }

      return new Response(
        JSON.stringify({ count: questions.length, questions }),
        { headers: { "Content-Type": "application/json" } },
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch questions", message: String(error) }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  },

  // POST /api/trivia/questions
  async POST(ctx) {
    try {
      const body = await ctx.req.json();

      // Validate required fields
      if (!body.question || typeof body.question !== "string") {
        return new Response(
          JSON.stringify({ error: "question is required and must be a string" }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      if (!Array.isArray(body.answers) || body.answers.length === 0) {
        return new Response(
          JSON.stringify({ error: "answers must be a non-empty array of strings" }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      if (!DIFFICULTIES.includes(body.difficulty)) {
        return new Response(
          JSON.stringify({ error: "Invalid difficulty", validOptions: DIFFICULTIES }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      if (!Array.isArray(body.tags) || body.tags.length === 0) {
        return new Response(
          JSON.stringify({ error: "tags must be a non-empty array" }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      for (const tag of body.tags) {
        if (!TAGS.includes(tag)) {
          return new Response(
            JSON.stringify({ error: `Invalid tag: ${tag}`, validOptions: TAGS }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }
      }

      const question = await createTrivia({
        question: body.question,
        answers: body.answers,
        difficulty: body.difficulty,
        tags: body.tags,
      });

      return new Response(
        JSON.stringify(question),
        { status: 201, headers: { "Content-Type": "application/json" } },
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Failed to create question", message: String(error) }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  },
});
