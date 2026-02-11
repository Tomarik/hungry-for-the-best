import { define } from "../../../../../utils.ts";
import { markAnswered } from "../../../../../services/trivia.ts";

export const handler = define.handlers({
  // POST /api/trivia/questions/:id/answer
  async POST(ctx) {
    const id = ctx.params.id;

    try {
      const question = await markAnswered(id);

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
        JSON.stringify({ error: "Failed to mark answered", message: String(error) }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  },
});
