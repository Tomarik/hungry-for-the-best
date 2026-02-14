import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

export default function AttractRebus() {
  const images = useSignal<string[]>([]);
  const currentIndex = useSignal(0);
  const loading = useSignal(true);
  const isFullscreen = useSignal(false);
  const isPaused = useSignal(false);

  // Load image list from API
  const loadImages = async () => {
    loading.value = true;
    try {
      const res = await fetch("/api/rebus/images");
      const data = await res.json();
      images.value = data.images || [];
    } catch (err) {
      console.error("Failed to load rebus images:", err);
    } finally {
      loading.value = false;
    }
  };

  useEffect(() => {
    loadImages();

    const onFsChange = () => {
      isFullscreen.value = !!document.fullscreenElement;
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Auto-advance carousel every 8 seconds (paused when isPaused)
  useEffect(() => {
    if (isPaused.value || images.value.length <= 1) return;

    const interval = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % images.value.length;
    }, 8000);

    return () => clearInterval(interval);
  }, [isPaused.value, images.value.length]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (images.value.length === 0) return;

      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        currentIndex.value = (currentIndex.value + 1) % images.value.length;
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        currentIndex.value =
          (currentIndex.value - 1 + images.value.length) % images.value.length;
      } else if (e.key === "p" || e.key === "P") {
        isPaused.value = !isPaused.value;
      } else if (e.key === "Escape" && document.fullscreenElement) {
        document.exitFullscreen();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const goNext = () => {
    if (images.value.length === 0) return;
    currentIndex.value = (currentIndex.value + 1) % images.value.length;
  };

  const goPrev = () => {
    if (images.value.length === 0) return;
    currentIndex.value =
      (currentIndex.value - 1 + images.value.length) % images.value.length;
  };

  const goTo = (index: number) => {
    currentIndex.value = index;
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  if (loading.value) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
        <span className="loading loading-spinner loading-lg" />
        <p>Loading rebus images…</p>
      </div>
    );
  }

  if (images.value.length === 0) {
    return (
      <div className="card bg-base-200">
        <div className="card-body items-center text-center py-16">
          <p className="text-5xl mb-3">🖼️</p>
          <p className="text-xl font-semibold opacity-70">No rebus images found</p>
          <p className="text-sm opacity-40 mt-1">
            Add PNG files to <code className="bg-base-300 px-2 py-0.5 rounded">static/images/rebus/</code> to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <p className="text-sm opacity-50 mt-1">
            {currentIndex.value + 1} of {images.value.length} images
            {isPaused.value ? " · Paused" : " · Auto-advancing"}
          </p>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <button
            type="button"
            className={`btn btn-sm ${isPaused.value ? "btn-warning" : "btn-ghost"} gap-2`}
            onClick={() => (isPaused.value = !isPaused.value)}
            title={isPaused.value ? "Resume auto-advance" : "Pause auto-advance"}
          >
            {isPaused.value ? "▶ Resume" : "⏸ Pause"}
          </button>

          <button
            type="button"
            className="btn btn-sm btn-outline gap-2"
            onClick={toggleFullscreen}
            title={isFullscreen.value ? "Exit full screen" : "Enter full screen"}
          >
            {isFullscreen.value ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                </svg>
                Exit Full Screen
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                </svg>
                Full Screen
              </>
            )}
          </button>

          <a href="/trivia-admin" className="btn btn-sm btn-ghost gap-1">
            ← Admin
          </a>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative group">
        {/* Image container */}
        <div className="relative overflow-hidden rounded-2xl bg-black aspect-video flex items-center justify-center shadow-xl">
          <img
            src={images.value[currentIndex.value]}
            alt={`Rebus ${currentIndex.value + 1}`}
            className="max-w-full max-h-full object-contain select-none"
            draggable={false}
          />

          {/* Prev / Next overlays */}
          {images.value.length > 1 && (
            <>
              <button
                type="button"
                className="absolute left-0 top-0 bottom-0 w-20 flex items-center justify-start pl-3 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-black/30 to-transparent"
                onClick={goPrev}
                aria-label="Previous image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-white drop-shadow-lg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <button
                type="button"
                className="absolute right-0 top-0 bottom-0 w-20 flex items-center justify-end pr-3 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-l from-black/30 to-transparent"
                onClick={goNext}
                aria-label="Next image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-white drop-shadow-lg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Dot indicators */}
        {images.value.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {images.value.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`w-3 h-3 rounded-full transition-all ${
                  i === currentIndex.value
                    ? "bg-primary scale-125"
                    : "bg-base-content/30 hover:bg-base-content/50"
                }`}
                onClick={() => goTo(i)}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}