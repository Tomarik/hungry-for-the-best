import { define } from "../../../../../utils.ts";
import {
  getTriviaById,
  updateTrivia,
  deleteTrivia,
  hardDeleteTrivia,
} from "../../../../../services/trivia.ts";
import { DIFFICULTIES, TAGS } from "../../../../../types/trivia.ts";

export const handler = define.handlers({
  // GET /api/trivia/questions/:id
  async GET(ctx) {
    const id = ctx.params.id;
    const question = await getTriviaById(id);

    if (!question || question.isDeleted) {
      return new Response(
        JSON.stringify({ error: "Question not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify(question),
      { headers: { "Content-Type": "application/json" } },
    );
  },

  // PUT /api/trivia/questions/:id
  async PUT(ctx) {
    const id = ctx.params.id;

    try {
      const body = await ctx.req.json();

      if (body.difficulty && !DIFFICULTIES.includes(body.difficulty)) {
        return new Response(
          JSON.stringify({ error: "Invalid difficulty", validOptions: DIFFICULTIES }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      if (body.tags) {
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
      }

      if (body.answers && (!Array.isArray(body.answers) || body.answers.length === 0)) {
        return new Response(
          JSON.stringify({ error: "answers must be a non-empty array" }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      const updated = await updateTrivia(id, body);

      if (!updated) {
        return new Response(
          JSON.stringify({ error: "Question not found" }),
          { status: 404, headers: { "Content-Type": "application/json" } },
        );
      }

      return new Response(
        JSON.stringify(updated),
        { headers: { "Content-Type": "application/json" } },
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Failed to update question", message: String(error) }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  },

  // DELETE /api/trivia/questions/:id
  // Query param: hard=true for permanent delete
  async DELETE(ctx) {
    const id = ctx.params.id;
    const url = new URL(ctx.req.url);
    const hard = url.searchParams.get("hard") === "true";

    try {
      if (hard) {
        const success = await hardDeleteTrivia(id);
        if (!success) {
          return new Response(
            JSON.stringify({ error: "Question not found" }),
            { status: 404, headers: { "Content-Type": "application/json" } },
          );
        }
        return new Response(
          JSON.stringify({ message: "Question permanently deleted" }),
          { headers: { "Content-Type": "application/json" } },
        );
      }

      const deleted = await deleteTrivia(id);
      if (!deleted) {
        return new Response(
          JSON.stringify({ error: "Question not found" }),
          { status: 404, headers: { "Content-Type": "application/json" } },
        );
      }

      return new Response(
        JSON.stringify({ message: "Question soft deleted", question: deleted }),
        { headers: { "Content-Type": "application/json" } },
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Failed to delete question", message: String(error) }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  },
});