import { App, staticFiles } from "fresh";
import { define, type State } from "./utils.ts";

export const app = new App<State>();

app.use(staticFiles());

// Pass a shared value from a middleware
app.use(async (ctx) => {
  ctx.state.shared = "hello";
  return await ctx.next();
});

// this is the same as the /api/:name route defined via a file. feel free to delete this!
app.get("/api2/:name", (ctx) => {
  const name = ctx.params.name;
  return new Response(
    `Hello, ${name.charAt(0).toUpperCase() + name.slice(1)}!`,
  );
});

// this can also be defined via a file. feel free to delete this!
const exampleLoggerMiddleware = define.middleware((ctx) => {
  console.log(`${ctx.req.method} ${ctx.req.url}`);
  return ctx.next();
});

app.use(exampleLoggerMiddleware);

// Auth guard for admin routes
app.use(async (ctx) => {
  const url = new URL(ctx.req.url);
  
  if (url.pathname.startsWith("/trivia-admin")) {
    const { verifySession } = await import("./services/auth.ts");
    
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
  }

  return await ctx.next();
});

// Include file-system based routes here
app.fsRoutes();
