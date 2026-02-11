import { define } from "../utils.ts";
import { verifyAdminPassword, createSession } from "../services/auth.ts";

export const handler = define.handlers({
  async POST(ctx) {
    try {
      const body = await ctx.req.json();
      const { password } = body;

      if (!password) {
        return new Response(
          JSON.stringify({ error: "Password required" }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      const isValid = await verifyAdminPassword(password);

      if (!isValid) {
        return new Response(
          JSON.stringify({ error: "Invalid password" }),
          { status: 401, headers: { "Content-Type": "application/json" } },
        );
      }

      // Create session
      const session = await createSession();

      // Set session cookie
      const headers = new Headers({
        "Content-Type": "application/json",
        "Set-Cookie": `session=${session.id}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24}`,
      });

      return new Response(
        JSON.stringify({ success: true }),
        { headers },
      );
    } catch (error) {
      console.error("Login error:", error);
      return new Response(
        JSON.stringify({ error: "Login failed" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  },
});
