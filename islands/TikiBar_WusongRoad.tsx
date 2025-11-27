import { JSX } from "preact";
import { useRef } from "preact/hooks";

interface DrinkBadge {
  name: string;
  color?:
    | "primary"
    | "secondary"
    | "accent"
    | "neutral"
    | "info"
    | "success"
    | "warning"
    | "error";
}

interface TikiBarProps {
  rank: number;
  name: string;
  description: string;
  location: string;
  favoriteDrinks: DrinkBadge[];
  images: string[];
  lastVisit: string;
  googleMapsUrl: string;
  websiteUrl: string;
}

export default function TikiBarInfo({
  rank = 3,
  name = "Wusong Tiki Bar",
  description =
    "Boston's Best Tiki Bar. Incredible vibes, Incredible decor. This spot is a must for Tiki lovers",
  location = "Cambridge, MA",
  favoriteDrinks = [
    { name: "Mai Tai", color: "warning" },
    { name: "Mango Sticky Rice Colada", color: "info" },
  ],
  images = [
    "/images/wusong_road/wusongroad_000.webp",
    "/images/wusong_road/wusongroad_001.webp",
    "/images/wusong_road/wusongroad_002.webp",
    "/images/wusong_road/wusongroad_003.webp",
    "/images/wusong_road/wusongroad_004.webp",
    "/images/wusong_road/wusongroad_005.webp",
    "/images/wusong_road/wusongroad_006.webp",
  ],
  lastVisit = "2025-09-20",
  googleMapsUrl = "https://maps.app.goo.gl/EmzjRDfhpjuAK98a7",
  websiteUrl = "https://www.wusongroad.com/",
}: Partial<TikiBarProps>): JSX.Element {
  const modalId = `modal_${rank}_${name.replace(/\s+/g, "_")}`;
  const carouselImages = images && images.length > 0
    ? images
    : ["/images/wusong_road/wusongroad_000.webp"];

  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollToSlide = (index: number) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const slideWidth = carousel.offsetWidth;
    carousel.scrollTo({
      left: slideWidth * index,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="card lg:card-side bg-base-100 shadow-xl max-w-4xl mx-auto">
        <figure className="lg:w-1/2 relative aspect-square">
          {/* Carousel */}
          <div
            ref={carouselRef}
            className="carousel w-full h-full ![scroll-snap-type:none] overflow-x-auto"
          >
            {carouselImages.map((img, index) => {
              const slideId = `slide_${rank}_${index}`;
              const prevIndex = index === 0
                ? carouselImages.length - 1
                : index - 1;
              const nextIndex = index === carouselImages.length - 1
                ? 0
                : index + 1;

              return (
                <div
                  key={index}
                  id={slideId}
                  className="carousel-item relative w-full h-full ![scroll-snap-align:none] flex-shrink-0"
                >
                  <img
                    src={img}
                    alt={`${name} - Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  {carouselImages.length > 1 && (
                    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                      <button
                        onClick={() => scrollToSlide(prevIndex)}
                        className="btn btn-circle"
                        type="button"
                        aria-label="Previous image"
                      >
                        ❮
                      </button>
                      <button
                        onClick={() => scrollToSlide(nextIndex)}
                        className="btn btn-circle"
                        type="button"
                        aria-label="Next image"
                      >
                        ❯
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </figure>

        <div className="card-body lg:w-1/2">
          <div className="flex items-start justify-between gap-4">
            <h2 className="card-title text-3xl text-primary flex-1 font-[Changa_One] tracking-wide">
              {name}
            </h2>
            <div className="flex-shrink-0 bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold text-xl md:text-3xl w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg">
              {rank}
            </div>
          </div>

          <div>
            <p className="text-base-content/80">{description}</p>
            <button
              type="button"
              className="btn btn-link btn-xs p-0 h-auto min-h-0 text-primary mt-1"
              onClick={() =>
                (document.getElementById(modalId) as HTMLDialogElement)
                  ?.showModal()}
            >
              Read our review
            </button>
          </div>

          <div className="divider"></div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 transition-opacity flex-shrink-0"
                aria-label="Open in Google Maps"
                title="Open in Google Maps"
              >
                <img
                  src="/google_maps_icon.webp"
                  alt=""
                  className="w-8 h-8"
                  loading="lazy"
                  decoding="async"
                />
              </a>
              <div className="flex-1">
                <h3 className="font-semibold">Location</h3>
                <p className="text-sm">{location}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-2xl">🌐</span>
              <div className="flex-1">
                <h3 className="font-semibold">Website</h3>
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-primary text-sm break-all"
                >
                  {websiteUrl}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-2xl">📅</span>
              <div>
                <h3 className="font-semibold">Last Visit</h3>
                <p className="text-sm">
                  {new Date(lastVisit || "").toString() !== "Invalid Date"
                    ? new Date(lastVisit!).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                    })
                    : "—"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-2xl">🍹</span>
              <div>
                <h3 className="font-semibold">Our Favorite Drinks</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(favoriteDrinks || []).map((drink, i) => {
                    const colorClasses = {
                      primary: "badge badge-primary badge-outline",
                      secondary: "badge badge-secondary badge-outline",
                      accent: "badge badge-accent badge-outline",
                      neutral: "badge badge-neutral badge-outline",
                      info: "badge badge-info badge-outline",
                      success: "badge badge-success badge-outline",
                      warning: "badge badge-warning badge-outline",
                      error: "badge badge-error badge-outline",
                    };
                    const badgeClass = colorClasses[drink.color || "accent"];

                    return (
                      <span key={i} className={badgeClass}>
                        {drink.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal with review */}
      <dialog id={modalId} className="modal">
        <div className="modal-box max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8">
          <h3 className="font-bold text-2xl text-primary mb-6">
            {name}
          </h3>

          <div className="space-y-6">
            {/* Overall Impression */}
            <div>
              <div className="text-base-content/80 space-y-4">
                <p>
                  Wusong Road is one of the best bars in Boston.
                </p>

                <p>
                  The place looks incredible. It's a wonderful mix of popular
                  Asian culture within a Tiki bar.
                </p>

                <p>
                  They have a HUGE selection of Tiki mugs, giant screens playing
                  anime classics, a well designed menu, and food that looks
                  great and tastes great!
                </p>

                <p>
                  They are doing so many things right.
                </p>

                <p>
                  Wusong is really a perfect Tiki bar for casual Tiki fans. And
                  the only thing holding this place back is consistency.
                </p>

                <p>
                  The bartenders know how to make the menu drinks, but don't
                  have a strong knowledge of Tiki in general. So asking to go
                  off-menu isn't an option. And at times ordering the same drink
                  can taste drastically different.
                </p>
              </div>
            </div>

            {/* Pros and Cons */}
            <div className="space-y-3">
              {/* Pros */}
              <div className="card bg-success/10 border border-success/20">
                <div className="card-body">
                  <h4 className="card-title text-success">✅ Pros</h4>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Wonderful mix of Asian culture and Tiki</li>
                    <li>Huge selection of Tiki mugs</li>
                    <li>Well designed menu</li>
                    <li>Good bar food</li>
                  </ul>
                </div>
              </div>

              {/* Cons */}
              <div className="card bg-error/10 border border-error/20">
                <div className="card-body">
                  <h4 className="card-title text-error">❌ Cons</h4>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Inconsistent drinks</li>
                    <li>Bartenders lack general Tiki knowledge</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-action mt-6">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                (document.getElementById(modalId) as HTMLDialogElement)
                  ?.close()}
            >
              Close
            </button>
          </div>
        </div>
        <div
          className="modal-backdrop"
          onClick={() =>
            (document.getElementById(modalId) as HTMLDialogElement)?.close()}
        >
        </div>
      </dialog>
    </>
  );
}
