import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import { verifySession } from "../services/auth.ts";
import TriviaAdminPanel from "../islands/TriviaAdminPanel.tsx";


export const handler = define.handlers({
  async GET(ctx) {
    // Check for session cookie
    const cookies = ctx.req.headers.get("cookie");
    const sessionId = cookies
      ?.split(";")
      .find((c) => c.trim().startsWith("session="))
      ?.split("=")[1];

    // Verify session
    if (!sessionId || !(await verifySession(sessionId))) {
      // Redirect to login
      return new Response(null, {
        status: 302,
        headers: { Location: "/login" },
      });
    }

    // Continue to render page
    return ctx.render(null);
  },
});

export default define.page(function TriviaAdmin(_ctx) {
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    globalThis.location.href = "/login";
  };

  return (
    <div class="px-4 py-8 mx-auto min-h-screen" data-theme="luxury">
      <Head>
        <title>Hungry for the Best | Trivia Admin</title>
      </Head>
      <div class="max-w-screen-xl mx-auto">
        <div class="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-4xl font-bold">Trivia Admin Portal</h1>
            <button type="submit"
              onClick={() => handleLogout()}
              className="btn btn-ghost btn-sm"
            >
              Logout
            </button>
          </div>
          <p className="text-center text-base-content/60">
            Manage trivia questions for your game nights
          </p>
        </div>
        <TriviaAdminPanel />
      </div>
    </div>
  );
});