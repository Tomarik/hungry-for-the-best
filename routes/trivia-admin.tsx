import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import TriviaAdminPanel from "../islands/TriviaAdminPanel.tsx";
import LogoutButton from "../islands/LogoutButton.tsx";

export default define.page(function TriviaAdmin() {
  return (
    <div className="px-4 py-8 mx-auto min-h-screen bg-base-100" data-theme="dracula">
      <Head>
        <title>Hungry for the Best | Trivia Admin</title>
      </Head>
      <div className="max-w-screen-xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-4xl font-bold text-base-content">Trivia Admin Portal</h1>
            <LogoutButton />
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