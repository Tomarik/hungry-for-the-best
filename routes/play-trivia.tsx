import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import PlayTrivia from "../islands/PlayTrivia.tsx";

export default define.page(function PlayTriviaPage() {
  return (
    <div
      className="px-4 py-8 mx-auto min-h-screen bg-base-100"
      data-theme="dracula"
    >
      <Head>
        <title>Hungry for the Best | Play Trivia</title>
      </Head>
      <div className="max-w-screen-xl mx-auto">
        <PlayTrivia />
      </div>
    </div>
  );
});