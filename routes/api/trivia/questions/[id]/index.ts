import { define } from "../../../../../utils.ts";
import {
  getTriviaById,
  updateTrivia,
  deleteTrivia,
} from "../../../../../services/trivia.ts";
import { DIFFICULTIES, TAGS } from "../../../../../types/trivia.ts";

export const handler = define.handlers({
  // GET /api/trivia/questions/:id
  async GET(ctx) {
    const id = ctx.params.id;
    const question = await getTriviaById(id);

    if (!question) {
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

      if (body.customTags !== undefined && !Array.isArray(body.customTags)) {
        return new Response(
          JSON.stringify({ error: "customTags must be an array" }),
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
  async DELETE(ctx) {
    const id = ctx.params.id;

    try {
      const success = await deleteTrivia(id);

      if (!success) {
        return new Response(
          JSON.stringify({ error: "Question not found" }),
          { status: 404, headers: { "Content-Type": "application/json" } },
        );
      }

      return new Response(
        JSON.stringify({ message: "Question deleted" }),
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