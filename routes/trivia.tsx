import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import TriviaQuestionCarousel from "../islands/TriviaQuestionCarousel.tsx";

export default define.page(function TriviaQuestions(_ctx) {
  return (
    <div class="px-4 py-8 mx-auto min-h-screen" data-theme="dracula">
      <Head>
        <title>Hungry for the Best - Trivia Questions</title>
      </Head>

      <div class="mt-8">
        <TriviaQuestionCarousel
          useDynamicLoading={true}
          initialDifficulty="demo"
        />
      </div>
    </div>
  );
});