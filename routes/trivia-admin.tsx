import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import TriviaAdminPanel from "../islands/TriviaAdminPanel.tsx";

export default define.page(function TriviaAdmin(_ctx) {
  return (
    <div class="px-4 py-8 mx-auto min-h-screen" data-theme="luxury">
      <Head>
        <title>Hungry for the Best | Trivia Admin</title>
      </Head>
      <div class="max-w-screen-xl mx-auto">
        <div class="mb-8">
          <h1 className="text-4xl font-bold text-center mb-2">Trivia Admin Portal</h1>
          <p className="text-center text-base-content/60">
            Manage trivia questions for your game nights
          </p>
        </div>
        <TriviaAdminPanel />
      </div>
    </div>
  );
});
