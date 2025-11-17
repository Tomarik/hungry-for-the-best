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
  name = "The Golden Tiki",
  description =
    "Its off the strip. But so worth the trip if you love tiki drinks.",
  location = "Las Vegas, NV",
  favoriteDrinks = [
    { name: "Saturn", color: "accent" },
    { name: "Cobra Fang", color: "error" },
  ],
  images = [
    "/images/three_dots/threedots_000.webp",
    "/images/three_dots/threedots_001.webp",
    "/images/three_dots/threedots_002.webp",
    "/images/three_dots/threedots_003.webp",
  ],
  lastVisit = "2024-06-01",
  googleMapsUrl = "https://maps.app.goo.gl/1Dsvz2kZemGqWzRq7",
  websiteUrl = "https://www.thegoldentiki.com/",
  bestServedBy = "",
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
            <h2 className="card-title text-3xl text-default flex-1">{name}</h2>
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
          Our Review: {name}
        </h3>
        
        <div className="space-y-4">
          <div className="text-base-content/80 mb-4">
            <p>
              This Tiki bar is our number #1 spot because it's a great spot for everyone. 
              We have visited 4 times and were impressed each visit. Whether it was a crazy 
              Saturday night and it's standing room only, or when it's a chill relaxing 
              Sunday afternoon with room to wander and explore the space.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-2">📘 Drinks & Menu</h4>
            <p className="text-base-content/80">
              We love a good menu. Well designed with pictures of the cocktails. The menu 
              itself is often a small detail places miss, so we appreciate the effort Laka 
              Lono puts into theirs. The drinks themselves are all well made, and the garnish 
              was not an afterthought. They put a lot of effort in making their drinks pop. 
              If you love Tiki then you know the garnish is a major component! As for our 
              favorite drinks, the Puka Punch was my favorite, and Painkiller is a flavor 
              profile we absolutely love. But we tried so many. Cat's Pajamas Clarified Punch 
              is an absolute treat! We didn't try any food ourselves, but everything coming 
              out of the kitchen was well plated. And if it's any indication, there were 
              actually quite a few people picking up take out there. And last, the drinks 
              are super affordable. For such excellent cocktails that taste great and look 
              fantastic, their prices are super competitive.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-2">🏝️ Ambiance & Decor</h4>
            <p className="text-base-content/80">
              The bar is beautifully designed. Palm roof, bamboo accents. Bubbly water 
              features in the background. Swinging chairs, smooth curved plank tables. 
              And an assortment of fun Tiki cups! The vibe is wonderful and transformative. 
              You'll be completely disconnected from the fact that you are in downtown 
              Omaha Nebraska.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-2">👥 Service & Staff</h4>
            <p className="text-base-content/80">
              The staff really know their craft cocktails. After sampling the menu, we asked 
              the bartenders to go off menu and try to make some other classic Tiki drinks 
              like Cobras Fang. Their confidence, consistency, and friendly demeanor really 
              stood out. And they're so fast! If you go on a busy night, don't be put off. 
              They can make cocktails fast without sacrificing quality. Seriously we can't 
              stress enough how friendly and knowledgeable their staff is.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-2">⭐ Overall Impression</h4>
            <p className="text-base-content/80">
              Laka Lono doesn't deserve the #1 spot. They earned it. They do everything right 
              and create an experience that I know, whether this is your first Tiki or you're 
              a Tiki traveler like us, you will have a good experience here.
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