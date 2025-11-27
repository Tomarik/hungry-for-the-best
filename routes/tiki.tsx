import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import TikiBar_TheBluePalm from "../islands/TikiBar_TheBluePalm.tsx";
import TikiBar_WusongRoad from "../islands/TikiBar_WusongRoad.tsx";
import TikiBar_LakaLono from "../islands/TikiBar_LakaLono.tsx";
import TikiBar_ThreeDots from "../islands/TikiBar_ThreeDots.tsx";
import TikiBar_TheGoldenTiki from "../islands/TikiBar_TheGoldenTiki.tsx";
import TikiBar_RumClub from "../islands/TikiBar_RumClub.tsx";

export default define.page(function Home(_ctx) {
  return (
    <div class="px-4 py-8 mx-auto min-h-screen" data-theme="halloween">
      <Head>
        <title>Hungry for the Best - Tiki</title>
      </Head>
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <p className="tracking-widest text-sm font-[Bebas_Neue] font-semibold text-white">
          Only the best{" "}
          <span className="text-3xl font-[Changa_One] tracking-widest leading-none align-baseline mx-4">
            Tiki
          </span>
          make the list
        </p>
      </div>

      <div class="mt-12 max-w-screen-lg mx-auto">
        <TikiBar_LakaLono />
        <div className="divider"></div>
        <TikiBar_TheBluePalm />
        <div className="divider"></div>
        <TikiBar_WusongRoad />
        <div className="divider"></div>
        <div className="divider divider-primary"></div>
        <div className="divider"></div>
        <TikiBar_TheGoldenTiki />
        <div className="divider"></div>
        <TikiBar_ThreeDots />
        <div className="divider"></div>
        <TikiBar_RumClub />
      </div>
    </div>
  );
});
