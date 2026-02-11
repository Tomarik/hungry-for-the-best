import { define } from "../../../../utils.ts";
import { resetAllAnswers } from "../../../../services/trivia.ts";

export const handler = define.handlers({
  // POST /api/trivia/questions/reset-all
  async POST(_ctx) {
    try {
      const count = await resetAllAnswers();

      return new Response(
        JSON.stringify({ message: `Reset ${count} questions`, count }),
        { headers: { "Content-Type": "application/json" } },
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Failed to reset answers", message: String(error) }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  },
});
