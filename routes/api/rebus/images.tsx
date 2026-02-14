import { define } from "../../../utils.ts";

export const handler = define.handlers({
  async GET(_ctx) {
    try {
      const images: string[] = [];
      const dir = `${Deno.cwd()}/static/images/rebus`;

      try {
        for await (const entry of Deno.readDir(dir)) {
          if (
            entry.isFile &&
            entry.name.toLowerCase().endsWith(".png")
          ) {
            images.push(`/images/rebus/${entry.name}`);
          }
        }
      } catch (err) {
        // Directory may not exist yet — return empty list
        if (!(err instanceof Deno.errors.NotFound)) {
          throw err;
        }
      }

      // Sort alphabetically for consistent ordering
      images.sort((a, b) => a.localeCompare(b));

      return new Response(
        JSON.stringify({ count: images.length, images }),
        { headers: { "Content-Type": "application/json" } },
      );
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: "Failed to list rebus images",
          message: String(error),
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  },
});