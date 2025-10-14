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
    "Boston's best tiki bar blending New England Chinese flavors with tropical escapism. Hidden in Harvard Square's historic Conductor's Building, this minority and LGBTQ+ owned two-story paradise features Asian American tapas.",
  location = "Cambridge, MA",
  favoriteDrinks = [
    { name: "Mai Tai", color: "success" },
    { name: "Piña Colada", color: "info" },
  ],
  images = [
    "/images/wusong_road/wusongroad_000.webp",
    "/images/wusong_road/wusongroad_001.webp",
    "/images/wusong_road/wusongroad_002.webp",
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
      behavior: 'smooth'
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
            <h2 className="card-title text-3xl text-primary flex-1">{name}</h2>
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
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-2xl text-primary mb-4">
            Our Review: {name}
          </h3>

          <div className="space-y-4">
            {/* Review content */}
            <div>
              <h4 className="font-semibold text-lg mb-2">🍜 Food & Drinks</h4>
              <p className="text-base-content/80">
                Chef Jason Doo's Asian American tapas menu is outstanding. The
                handmade baos are pillowy perfection, and the crab rangoons are
                crispy, creamy, and absolutely addictive. Pair them with what we
                consider the best Mai Tai in Boston - perfectly balanced with
                quality rums and fresh ingredients. The Saturn is another
                standout, and if you're with a group, the Scorpion Bowl is a
                must-try experience served in a custom mug.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-2">
                🏝️ Ambiance & Design
              </h4>
              <p className="text-base-content/80">
                Hidden in Harvard Square's historic Conductor's Building, Wusong
                Road is a true tropical escape across two immersive floors. The
                attention to detail is incredible - basket lamps cast warm
                glows, sculpted clouds float overhead, and grass ceilings
                transport you far from New England. Every corner offers
                Instagram-worthy moments while maintaining an authentic tiki
                vibe that never feels kitschy.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-2">
                💙 Community & Values
              </h4>
              <p className="text-base-content/80">
                As a minority and LGBTQ+ owned establishment, Wusong Road
                creates an inclusive, welcoming atmosphere where everyone feels
                at home. The staff embodies this warmth, treating regulars and
                first-timers alike with genuine hospitality. It's refreshing to
                support a business that represents and celebrates diversity in
                the Boston bar scene.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-2">
                ⭐ Overall Impression
              </h4>
              <p className="text-base-content/80">
                Wusong Road isn't just Boston's best tiki bar - it's one of the
                best bars, period. The fusion of New England Chinese cuisine
                with tropical escapism creates something truly unique. Whether
                you're a tiki enthusiast or just looking for an unforgettable
                night out, this two-story paradise in Cambridge delivers on
                every level. Reservations recommended, especially on weekends!
              </p>
            </div>
          </div>

          <div className="modal-action">
            <button 
              type="button"
              className="btn btn-primary"
              onClick={() => (document.getElementById(modalId) as HTMLDialogElement)?.close()}
            >
              Close
            </button>
          </div>
        </div>
        <div 
          className="modal-backdrop"
          onClick={() => (document.getElementById(modalId) as HTMLDialogElement)?.close()}
        >
        </div>
      </dialog>
    </>
  );
}