import { Head } from "fresh/runtime";
import { define } from "../utils.ts";

export default define.page(function Home(_ctx) {
  return (
    <div class="px-4 py-8 mx-auto min-h-screen" data-theme="luxury">
      <Head>
        <title>Hungry for the Best | Home</title>
      </Head>
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">

        <p className="tracking-widest text-sm font-[Bebas_Neue] font-semibold text-white">
          Only the best make the list
        </p>

        <div className="divider"></div>

        <ul className="list max-w-2xl mx-auto bg-base-100 rounded-box shadow-md">
          <li>
  <a
    href="/tiki"
    className="list-row p-4 md:p-6 lg:p-8 gap-4 md:gap-6 border-primary glass items-center"
  >
    <div>
      <img
        className="size-30 md:size-40 lg:size-50 rounded-box object-cover"
        alt="tiki cocktail drink"
        src="/cocktail.webp"
      />
    </div>

    <div>
      <div className="text-lg md:text-xl lg:text-3xl xl:text-5xl 2xl:text-6xl font-[Changa_One]">
        Tiki
      </div>

      <div className="text-xs md:text-sm uppercase font-semibold opacity-60">
        6 Recommendations
      </div>
    </div>

    <span className="btn btn-square btn-ghost md:btn-lg">
      <svg
        className="size-[2em] text-warning"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <path
          d="M19.71125,18.2965 C20.10225,18.6875 20.10225,19.3205 19.71125,19.7105 C19.32025,20.1015 18.68725,20.1015 18.29725,19.7105 L15.43725,16.8505 C16.07525,16.5695 16.69125,16.2395 17.27925,15.8645 L19.71125,18.2965 Z M2.72425,15.8615 C3.31225,16.2365 3.92725,16.5665 4.56625,16.8485 L1.70725,19.7065 C1.31725,20.0975 0.68325,20.0975 0.29325,19.7065 C-0.09775,19.3165 -0.09775,18.6835 0.29325,18.2925 L2.72425,15.8615 Z M0.29725,1.7105 C-0.09375,1.3205 -0.09375,0.6875 0.29725,0.2965 C0.68725,-0.0945 1.32025,-0.0945 1.71125,0.2965 L4.87725,3.4625 C4.22725,3.7305 3.60125,4.0505 3.00125,4.4145 L0.29725,1.7105 Z M17.00225,4.4115 C16.40125,4.0485 15.77525,3.7275 15.12525,3.4605 L18.29325,0.2925 C18.68325,-0.0975 19.31725,-0.0975 19.70725,0.2925 C20.09825,0.6835 20.09825,1.3165 19.70725,1.7065 L17.00225,4.4115 Z M12.00425,10.2245 C12.00425,11.3285 11.10825,12.2245 10.00425,12.2245 C8.89925,12.2245 8.00425,11.3285 8.00425,10.2245 C8.00425,9.1195 8.89925,8.2245 10.00425,8.2245 C11.10825,8.2245 12.00425,9.1195 12.00425,10.2245 Z M10.00425,14.0035 C7.01525,14.0035 4.19925,12.5805 2.40325,10.2245 C4.19925,7.8675 7.01525,6.4445 10.00425,6.4445 C12.99325,6.4445 15.80925,7.8675 17.60525,10.2245 C15.80925,12.5805 12.99325,14.0035 10.00425,14.0035 Z M20.00425,10.2245 C18.00425,6.7725 14.28025,4.4445 10.00425,4.4445 C5.72825,4.4445 2.00325,6.7725 0.00425,10.2245 C2.00325,13.6755 5.72825,16.0035 10.00425,16.0035 C14.28025,16.0035 18.00425,13.6755 20.00425,10.2245 Z"
          fill="currentColor"
        />
      </svg>
    </span>
  </a>
</li>

        </ul>
      </div>
    </div>
  );
});
