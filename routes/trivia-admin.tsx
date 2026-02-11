import { define } from "../utils.ts";
import { verifySession } from "../services/auth.ts";


export const handler = define.handlers({
  async GET(ctx) {
    const cookies = ctx.req.headers.get("cookie");
    const sessionId = cookies
      ?.split(";")
      .find((c) => c.trim().startsWith("session="))
      ?.split("=")[1];

    if (!sessionId || !(await verifySession(sessionId))) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/" },
      });
    }

    return ctx.render(null);
  },
});

export default define.page(function TriviaAdmin() {
  return (
    <div data-theme="dracula">
      <h1>Admin Page Works</h1>
    </div>
  );
});