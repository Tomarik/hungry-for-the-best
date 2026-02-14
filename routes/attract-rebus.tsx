import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import AttractRebus from "../islands/AttractRebus.tsx";

export default define.page(function AttractRebusPage() {
  return (
    <div
      className="px-4 py-8 mx-auto min-h-screen bg-base-100"
      data-theme="dracula"
    >
      <Head>
        <title>Hungry for the Best | Attract Rebus</title>
      </Head>
      <div className="max-w-screen-xl mx-auto">
        <AttractRebus />
      </div>
    </div>
  );
});