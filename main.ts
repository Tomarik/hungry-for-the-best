import { App, staticFiles } from "fresh";
import { define, type State } from "./utils.ts";

export const app = new App<State>();

app.use(staticFiles());

// Helper to extract session ID from cookies
function getSessionId(req: Request): string | undefined {
  return req.headers
    .get("cookie")
    ?.split(";")
    .find((c) => c.trim().startsWith("session="))
    ?.split("=")[1];
}

// Auth middleware
app.use(async (ctx) => {
  const url = new URL(ctx.req.url);

  // Protect admin and play routes — redirect to login if not authenticated
  if (url.pathname.startsWith("/trivia-admin") || url.pathname.startsWith("/play-trivia")) {
    const { verifySession } = await import("./services/auth.ts");
    const sessionId = getSessionId(ctx.req);

    if (!sessionId || !(await verifySession(sessionId))) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/" },
      });
    }
  }

  // Redirect logged-in users away from login page
  if (url.pathname === "/") {
    const { verifySession } = await import("./services/auth.ts");
    const sessionId = getSessionId(ctx.req);

    if (sessionId && (await verifySession(sessionId))) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/trivia-admin" },
      });
    }
  }

  return await ctx.next();
});

// Logger middleware
const loggerMiddleware = define.middleware((ctx) => {
  console.log(`${ctx.req.method} ${ctx.req.url}`);
  return ctx.next();
});
app.use(loggerMiddleware);

app.fsRoutes();