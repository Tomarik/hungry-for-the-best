import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import RebusPuzzleCarousel from "../islands/RebusPuzzleCarousel.tsx";

export default define.page(function DemoRebus(_ctx) {
  return (
    <div class="px-4 py-8 mx-auto min-h-screen" data-theme="dracula">
      <Head>
        <title>Hungry for the Best - Rebus Puzzles</title>
      </Head>


      <div class="mt-8">
        <RebusPuzzleCarousel
          useDynamicLoading={true}
          initialDifficulty="demo"
        />
      </div>

      
    </div>
  );
});