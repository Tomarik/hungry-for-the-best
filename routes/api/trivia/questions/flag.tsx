import { define } from "../../../../../utils.ts";
import { toggleFlagged } from "../../../../../services/trivia.ts";

export const handler = define.handlers({
  // POST /api/trivia/questions/:id/flag
  async POST(ctx) {
    const id = ctx.params.id;

    try {
      const question = await toggleFlagged(id);

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
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Failed to toggle flag", message: String(error) }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  },
});
