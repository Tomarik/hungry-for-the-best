import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import TikiBar_TheBluePalm from "../components/TikiBar_TheBluePalm.tsx";
import TikiBar_WusongRoad from "../components/TikiBar_WusongRoad.tsx";
import TikiBar_LakaLono from "../components/TikiBar_LakaLono.tsx";
import TikiBar_ThreeDots from "../components/TikiBar_ThreeDots.tsx";

export default define.page(function Home(_ctx) {


  return (
    <div class="px-4 py-8 mx-auto min-h-screen" data-theme="halloween">
      <Head>
        <title>Hungry for the Best - Tiki</title>
      </Head>
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">

<h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center tracking-wider font-[Permanent_Marker]">
  Best Tiki
</h1>
</div>


<div className="text-warning tracking-wider text-xl font-[Poppins] font-semibold text-center">

    <p className="text-warning tracking-wider text-xl font-[Poppins] font-semibold inline">
    Only the best make the list
  </p>

    <a href="/" className="btn btn-square btn-ghost md:btn-lg pb-1">
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-[1.2em]"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25M6 11l1.5-1.5M7.5 11l1.5-1.5M9 11l1.5-1.5M10.5 11l1.5-1.5M12 11l1.5-1.5M13.5 11l1.5-1.5M15 11l1.5-1.5M16.5 11l1.5-1.5" /></svg>
</a>
</div>


<div class="mt-12 max-w-screen-lg mx-auto">
        <TikiBar_LakaLono />
        <div className="divider divider-accent"></div>
        <TikiBar_TheBluePalm />
        <div className="divider divider-accent"></div>
        <TikiBar_WusongRoad />
        <div className="divider divider-neutral"></div>
        <TikiBar_ThreeDots />
      </div>

      </div>

  );
});