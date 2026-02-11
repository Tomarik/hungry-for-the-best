import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import { verifySession } from "../services/auth.ts";
import LoginForm from "../islands/LoginForm.tsx";

export const handler = define.handlers({
  async GET(ctx) {
    // If already logged in, redirect straight to admin
    const cookies = ctx.req.headers.get("cookie");
    const sessionId = cookies
      ?.split(";")
      .find((c) => c.trim().startsWith("session="))
      ?.split("=")[1];

    if (sessionId && (await verifySession(sessionId))) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/trivia-admin" },
      });
    }

    return ctx.render(null);
  },
});

export default define.page(function Home() {
  return (
    <div data-theme="dracula" class="min-h-screen">
      <Head>
        <title>Hungry for the Best | Login</title>
      </Head>
      <LoginForm />
    </div>
  );
});