import { Head } from "fresh/runtime";
import { define } from "../utils.ts";

export default define.page(function Home(ctx) {

  console.log("Shared value " + ctx.state.shared);

  return (
    <div class="px-4 py-8 mx-auto min-h-screen" data-theme="Halloween">
      <Head>
        <title>Hungry for the Best - Tiki</title>
      </Head>
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">

<h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center tracking-wider font-[Permanent_Marker]">
  Best Tiki
</h1>


<div className="text-warning tracking-wider text-xl font-[Poppins] font-semibold">Only the best make the list</div>



      </div>
    </div>
  );
});