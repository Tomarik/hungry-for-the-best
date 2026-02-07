import { define } from "../../../utils.ts";

type Difficulty = "demo" | "easy" | "medium" | "hard";

const VALID_DIFFICULTIES: Difficulty[] = ["demo", "easy", "medium", "hard"];

export const handler = define.handlers({
  async GET(ctx) {
    const difficulty = ctx.params.difficulty as Difficulty;

    // Validate difficulty parameter
    if (!VALID_DIFFICULTIES.includes(difficulty)) {
      return new Response(
        JSON.stringify({
          error: "Invalid difficulty",
          validOptions: VALID_DIFFICULTIES,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const basePath = `./static/images/trivia_questions/${difficulty}`;

    try {
      const images: Array<{ path: string; filename: string }> = [];

      for await (const entry of Deno.readDir(basePath)) {
        if (
          entry.isFile &&
          (entry.name.endsWith(".png") ||
            entry.name.endsWith(".jpg") ||
            entry.name.endsWith(".jpeg") ||
            entry.name.endsWith(".webp"))
        ) {
          images.push({
            path: `/images/trivia_questions/${difficulty}/${entry.name}`,
            filename: entry.name,
          });
        }
      }

      // Sort images naturally (handles numeric filenames)
      images.sort((a, b) =>
        a.filename.localeCompare(b.filename, undefined, {
          numeric: true,
          sensitivity: "base",
        })
      );

      return new Response(
        JSON.stringify({
          difficulty,
          count: images.length,
          images,
        }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        return new Response(
          JSON.stringify({
            difficulty,
            count: 0,
            images: [],
            message: `No images found for difficulty: ${difficulty}`,
          }),
          {
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      return new Response(
        JSON.stringify({
          error: "Failed to read images",
          message: String(error),
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  },
});