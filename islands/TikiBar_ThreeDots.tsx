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
  rank = 0,
  name = "Three Dots and a Dash",
  description =
    "A tropical escape with classic tiki cocktails and a laid-back vibe. The staff are so cool and know their craft cocktails.",
  location = "Chicago, IL",
  favoriteDrinks = [
    { name: "Three Dots & a Dash", color: "info" },
    { name: "Jet Pilot", color: "error" },
  ],
  images = [
    "/images/three_dots/threedots_000.webp",
    "/images/three_dots/threedots_001.webp",
    "/images/three_dots/threedots_002.webp",
    "/images/three_dots/threedots_003.webp",
    "/images/three_dots/threedots_004.webp",
    "/images/three_dots/threedots_005.webp",
    "/images/three_dots/threedots_006.webp",
  ],
  lastVisit = "2025-08-01",
  googleMapsUrl = "https://maps.app.goo.gl/Af5E5hUnudrep7gB8",
  websiteUrl = "https://www.threedotschicago.com",
  bestServedBy = "Tattoo Guy",
}: Partial<TikiBarProps>): JSX.Element {
  const modalId = `modal_${rank}_${name.replace(/\s+/g, "_")}`;
  const carouselImages = images && images.length > 0
    ? images
    : ["/images/three_dots/threedots_000.webp"];

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
            <h2 className="card-title text-3xl text-default flex-1 font-[League_Spartan]">{name}</h2>
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
        <div className="modal-box max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8">
          <h3 className="font-bold text-2xl text-primary mb-6">
            {name}
          </h3>

          <div className="space-y-6">
            <div>
              <div className="text-base-content/80 space-y-4">
                <p>
                  We only to to visit once but it made a big impression on us.
                </p>

                <p>
                  Staff matters! The tattooed dude who was our bartender made the experience.
                  He was friendly, knowledgeable about Tiki. And just nailed every damn cocktail he made us.
                </p>

                <p>
                  The bar has a decent theme. But it's so fucking dark in there. If you are not sitting at the bar. You'll be using your phone to read the menu.
                </p>

                <p>
                  Three Dots and a Dash made our list because this bartender. We've had a lot of great Tiki drinks.
                  But dude put this place on our map. And we hope if you visit you get to experience his craft.
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
                    <li>Well-designed menu</li>
                    <li>Excellent drinks and garnishes</li>
                    <li>Tattooed bartender is King 👑</li>
                    <li>Drinks are strong</li>
                  </ul>
                </div>
              </div>

              {/* Cons */}
              <div className="card bg-error/10 border border-error/20">
                <div className="card-body">
                  <h4 className="card-title text-error">❌ Cons</h4>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Dark as hell</li>
                    <li>Drinks are spendy but its Chicago</li>
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
