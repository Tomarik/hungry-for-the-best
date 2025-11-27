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
  bestServedBy?: string;
}

export default function TikiBarInfo({
  rank = 2,
  name = "The Blue Palm",
  description =
    "Escape Kansas City at Blue Palm. Seriously this place is what people mean when they 'Hidden Gem'.",
  location = "Kansas City, KS",
  favoriteDrinks = [
    { name: "Saturn", color: "accent" },
    { name: "Cobra Fang", color: "error" },
  ],
  images = [
    "/images/blue_palm/bluepalm_000.webp",
    "/images/blue_palm/bluepalm_001.webp",
    "/images/blue_palm/bluepalm_002.webp",
    "/images/blue_palm/bluepalm_004.webp",
    "/images/blue_palm/bluepalm_005.webp",
    "/images/blue_palm/bluepalm_006.webp",
    "/images/blue_palm/bluepalm_007.webp",
    "/images/blue_palm/bluepalm_008.webp",
  ],
  lastVisit = "2025-08-22",
  googleMapsUrl = "https://maps.app.goo.gl/F2A8SkjPQJfZY4gEA",
  websiteUrl = "https://bluepalmtiki.com/",
  bestServedBy = "Roxie",
}: Partial<TikiBarProps>): JSX.Element {
  const modalId = `modal_${rank}_${name.replace(/\s+/g, "_")}`;
  const carouselImages = images && images.length > 0
    ? images
    : ["/images/blue_palm/bluepalm_000.webp"];

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

            {bestServedBy && (
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌟</span>
                <div className="flex-1">
                  <h3 className="font-semibold">Best Served By</h3>
                  <p className="text-sm font-medium text-primary">
                    {bestServedBy}
                  </p>
                </div>
              </div>
            )}

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
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-2xl text-primary mb-4">
            {name}
          </h3>

          <div className="space-y-6">
            {/* Overall Impression */}
            <div>
              <div className="text-base-content/80 space-y-4">
                <p>
                  Escapism is how I'd describe The Blue Palm.
                </p>

                <p>
                  It's in a neighborhood surrounded by homes. It's a plain brick
                  building with a small outdoor area.
                </p>

                <p>
                  But once you open that door it's like "Whoa". We didn't find
                  anywhere in Kansas City that matches the vibe here.
                </p>

                <p>
                  We loved the staff, especially Roxie! Everyone was so friendly
                  and every 2 visits they knew us. Each time visiting was a
                  wonderful and welcoming experience.
                </p>

                <p>
                  The Blue Palm is where we fell in love with Tiki. It's a safe
                  place to explore and learn from one of the best. And get a
                  little tipsy while doing it.
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
                    <li>Incredible escapist atmosphere</li>
                    <li>Friendly staff, especially Roxie</li>
                    <li>Perfect for Tiki beginners and experts</li>
                  </ul>
                </div>
              </div>

              {/* Cons */}
              <div className="card bg-error/10 border border-error/20">
                <div className="card-body">
                  <h4 className="card-title text-error">❌ Cons</h4>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Drink consistency</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>{" "}
          <div className="modal-action">
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
