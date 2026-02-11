import { define } from "../../../utils.ts";
import { deleteSession } from "../../../services/auth.ts";

export const handler = define.handlers({
  async POST(ctx) {
    try {
      const cookies = ctx.req.headers.get("cookie");
      const sessionId = cookies
        ?.split(";")
        .find((c) => c.trim().startsWith("session="))
        ?.split("=")[1];

      if (sessionId) {
        await deleteSession(sessionId);
      }

      // Clear session cookie
      const headers = new Headers({
        "Content-Type": "application/json",
        "Set-Cookie": "session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0",
      });

      return new Response(
        JSON.stringify({ success: true }),
        { headers },
      );
    } catch (error) {
      console.error("Logout error:", error);
      return new Response(
        JSON.stringify({ error: "Logout failed" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  },
});
