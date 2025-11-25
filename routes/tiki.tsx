import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import TikiBar_TheBluePalm from "../islands/TikiBar_TheBluePalm.tsx";
import TikiBar_WusongRoad from "../islands/TikiBar_WusongRoad.tsx";
import TikiBar_LakaLono from "../islands/TikiBar_LakaLono.tsx";
import TikiBar_ThreeDots from "../islands/TikiBar_ThreeDots.tsx";
import TikiBar_TheGoldenTiki from "../islands/TikiBar_TheGoldenTiki.tsx";

export default define.page(function Home(_ctx) {
  return (
    <div class="px-4 py-8 mx-auto min-h-screen" data-theme="halloween">
      <Head>
        <title>Hungry for the Best - Tiki</title>
      </Head>
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">


        <p className="tracking-normal text-xl font-[Poppins] font-semibold text-white">
          Only the best make the list
        </p>
      </div>


      <div class="mt-12 max-w-screen-lg mx-auto">
        <TikiBar_LakaLono />
        <div className="divider divider-accent"></div>
        <TikiBar_TheBluePalm />
        <div className="divider divider-accent"></div>
        <TikiBar_WusongRoad />
        <div className="divider divider-accent"></div>
        <TikiBar_TheGoldenTiki />
        <div className="divider divider-accent"></div>
        <TikiBar_ThreeDots />
      </div>
    </div>
  );
});
