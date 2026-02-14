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
            <div className="flex gap-4 items-center">
              <a 
                href="/play-trivia" 
                className="btn btn-primary btn-outline"
              >
                Play Trivia
              </a>
              <a 
                href="/attract-rebus" 
                className="btn btn-secondary btn-outline"
              >
                Attract Rebus
              </a>
              <LogoutButton />
            </div>
          </div>
        </div>
        <TriviaAdminPanel />
      </div>
    </div>
  );
});