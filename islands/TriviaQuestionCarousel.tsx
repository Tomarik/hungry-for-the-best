import { JSX } from "preact";
import { useRef, useEffect } from "preact/hooks";
import { useSignal, useComputed } from "@preact/signals";

type Difficulty = "demo" | "easy" | "medium" | "hard";

interface TriviaImage {
  path: string;
  filename: string;
}

interface TriviaQuestionCarouselProps {
  /** Pre-defined images for each difficulty. If empty, will fetch from API */
  images?: Record<Difficulty, TriviaImage[]>;
  /** Whether to fetch images dynamically from API */
  useDynamicLoading?: boolean;
  initialDifficulty?: Difficulty;
}

export default function TriviaQuestionCarousel({
  images = { demo: [], easy: [], medium: [], hard: [] },
  useDynamicLoading = false,
  initialDifficulty = "demo",
}: TriviaQuestionCarouselProps): JSX.Element {
  const currentDifficulty = useSignal<Difficulty>(initialDifficulty);
  const currentIndex = useSignal(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isLoading = useSignal(false);
  const isFullscreen = useSignal(false);
  const showAnswer = useSignal(false);
  const dynamicImages = useSignal<Record<Difficulty, TriviaImage[]>>({
    demo: [],
    easy: [],
    medium: [],
    hard: [],
  });
  const loadedDifficulties = useSignal<Set<Difficulty>>(new Set());

  // Fetch images for a difficulty level
  const fetchImages = async (difficulty: Difficulty) => {
    if (loadedDifficulties.value.has(difficulty)) return;

    isLoading.value = true;
    try {
      const response = await fetch(`/api/trivia/${difficulty}`);
      const data = await response.json();

      if (data.images && Array.isArray(data.images)) {
        dynamicImages.value = {
          ...dynamicImages.value,
          [difficulty]: data.images,
        };
        loadedDifficulties.value = new Set([
          ...loadedDifficulties.value,
          difficulty,
        ]);
      }
    } catch (error) {
      console.error(`Failed to load ${difficulty} images:`, error);
    } finally {
      isLoading.value = false;
    }
  };

  // Get current images (from props or dynamic)
  const currentImages = useComputed(() => {
    if (useDynamicLoading) {
      return dynamicImages.value[currentDifficulty.value] || [];
    }
    return images[currentDifficulty.value] || [];
  });

  // Get current answer (filename without extension)
  const currentAnswer = useComputed(() => {
    const imgs = currentImages.value;
    if (imgs.length === 0) return "";
    const filename = imgs[currentIndex.value]?.filename || "";
    // Remove file extension
    return filename.replace(/\.(png|jpg|jpeg|webp)$/i, "");
  });

  const scrollToSlide = (index: number) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const slideWidth = carousel.offsetWidth;
    carousel.scrollTo({
      left: slideWidth * index,
      behavior: "smooth",
    });
    currentIndex.value = index;
    showAnswer.value = false; // Hide answer when changing slides
  };

  const handleDifficultyChange = async (difficulty: Difficulty) => {
    currentDifficulty.value = difficulty;
    currentIndex.value = 0;
    showAnswer.value = false; // Hide answer when changing difficulty

    // Reset scroll position
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.scrollTo({ left: 0, behavior: "instant" });
    }

    // Fetch images if using dynamic loading
    if (useDynamicLoading) {
      await fetchImages(difficulty);
    }
  };

  // Load initial images on mount if using dynamic loading
  if (useDynamicLoading && !loadedDifficulties.value.has(initialDifficulty)) {
    fetchImages(initialDifficulty);
  }

  const prevSlide = () => {
    const imgs = currentImages.value;
    if (imgs.length === 0) return;
    const newIndex =
      currentIndex.value === 0 ? imgs.length - 1 : currentIndex.value - 1;
    scrollToSlide(newIndex);
  };

  const nextSlide = () => {
    const imgs = currentImages.value;
    if (imgs.length === 0) return;
    const newIndex =
      currentIndex.value === imgs.length - 1 ? 0 : currentIndex.value + 1;
    scrollToSlide(newIndex);
  };

  // Fullscreen toggle
  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen();
        isFullscreen.value = true;
      } else {
        await document.exitFullscreen();
        isFullscreen.value = false;
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  };

  // Listen for fullscreen changes (e.g., user presses Escape)
  useEffect(() => {
    const handleFullscreenChange = () => {
      isFullscreen.value = !!document.fullscreenElement;
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === "a" || e.key === "A") {
        e.preventDefault();
        showAnswer.value = !showAnswer.value;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const difficultyConfig: Record<
    Difficulty,
    { label: string; color: string }
  > = {
    demo: { label: "Demo", color: "btn-info" },
    easy: { label: "Easy", color: "btn-success" },
    medium: { label: "Medium", color: "btn-warning" },
    hard: { label: "Hard", color: "btn-error" },
  };

  // Get image count for a difficulty
  const getImageCount = (difficulty: Difficulty): number => {
    if (useDynamicLoading) {
      return dynamicImages.value[difficulty]?.length || 0;
    }
    return images[difficulty]?.length || 0;
  };

  return (
    <div
      ref={containerRef}
      className={`w-full mx-auto bg-base-300 ${
        isFullscreen.value ? "h-screen flex flex-col p-4" : "max-w-6xl"
      }`}
    >
      {/* Top Controls Bar */}
      <div
        className={`flex flex-wrap items-center justify-between gap-2 mb-2 ${
          isFullscreen.value ? "px-4" : ""
        }`}
      >
        {/* Difficulty Selector */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(difficultyConfig) as Difficulty[]).map((difficulty) => {
            const config = difficultyConfig[difficulty];
            const isActive = currentDifficulty.value === difficulty;
            const imageCount = getImageCount(difficulty);
            const showCount =
              !useDynamicLoading ||
              loadedDifficulties.value.has(difficulty);

            return (
              <button
                key={difficulty}
                type="button"
                onClick={() => handleDifficultyChange(difficulty)}
                className={`btn btn-sm ${isActive ? config.color : "btn-ghost"} ${
                  isActive ? "" : "btn-outline"
                }`}
              >
                {config.label}
                {showCount && (
                  <span className="badge badge-xs ml-1">{imageCount}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Question Counter & Fullscreen */}
        <div className="flex items-center gap-3">
          {currentImages.value.length > 0 && (
            <span className="text-lg font-mono font-bold text-primary">
              {currentIndex.value + 1} / {currentImages.value.length}
            </span>
          )}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="btn btn-sm btn-ghost"
            aria-label={isFullscreen.value ? "Exit fullscreen" : "Enter fullscreen"}
            title={isFullscreen.value ? "Exit fullscreen (F)" : "Fullscreen (F)"}
          >
            {isFullscreen.value ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading.value && (
        <div
          className={`flex items-center justify-center bg-base-200 rounded-box ${
            isFullscreen.value ? "flex-1" : "h-64"
          }`}
        >
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )}

      {/* Carousel Container */}
      {!isLoading.value && currentImages.value.length > 0 ? (
        <div className={`relative ${isFullscreen.value ? "flex-1 min-h-0" : ""}`}>
          {/* Main Carousel */}
          <div
            ref={carouselRef}
            className={`carousel w-full rounded-box shadow-xl bg-black ![scroll-snap-type:none] overflow-x-auto ${
              isFullscreen.value ? "h-full" : "aspect-video"
            }`}
          >
            {currentImages.value.map((img, index) => (
              <div
                key={`${currentDifficulty.value}-${index}`}
                className="carousel-item relative w-full h-full ![scroll-snap-align:none] flex-shrink-0 flex items-center justify-center"
              >
                <img
                  src={img.path}
                  alt={`Trivia Question ${index + 1}`}
                  className="max-w-full max-h-full object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {currentImages.value.length > 1 && (
            <div className="absolute left-2 right-2 top-1/2 flex -translate-y-1/2 transform justify-between pointer-events-none">
              <button
                onClick={prevSlide}
                className={`btn btn-circle shadow-lg pointer-events-auto opacity-70 hover:opacity-100 ${
                  isFullscreen.value ? "btn-lg" : ""
                }`}
                type="button"
                aria-label="Previous question (←)"
              >
                ❮
              </button>
              <button
                onClick={nextSlide}
                className={`btn btn-circle shadow-lg pointer-events-auto opacity-70 hover:opacity-100 ${
                  isFullscreen.value ? "btn-lg" : ""
                }`}
                type="button"
                aria-label="Next question (→)"
              >
                ❯
              </button>
            </div>
          )}

          {/* Answer Button - positioned at bottom center */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
            <button
              onClick={() => showAnswer.value = !showAnswer.value}
              className={`btn btn-sm pointer-events-auto ${
                showAnswer.value ? "btn-warning" : "btn-primary"
              }`}
              type="button"
              aria-label="Toggle answer (A)"
            >
              {showAnswer.value ? "Hide Answer" : "Show Answer"}
            </button>
          </div>

          {/* Answer Display */}
          {showAnswer.value && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 pointer-events-none">
              <div className="bg-base-100 px-4 py-2 rounded-box shadow-xl border-2 border-warning max-w-md">
                <p className="text-sm font-mono text-center break-all">
                  {currentAnswer.value}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : !isLoading.value ? (
        <div
          className={`flex items-center justify-center bg-base-200 rounded-box ${
            isFullscreen.value ? "flex-1" : "h-64"
          }`}
        >
          <p className="text-base-content/60">
            No questions available for this difficulty level.
          </p>
        </div>
      ) : null}

      {/* Thumbnail Navigation - Quick question selection */}
      {currentImages.value.length > 1 && (
        <div
          className={`flex justify-center gap-1 mt-2 flex-wrap overflow-auto ${
            isFullscreen.value ? "max-h-20 py-2" : ""
          }`}
        >
          {currentImages.value.map((_img, index) => (
            <button
              key={`thumb-${currentDifficulty.value}-${index}`}
              type="button"
              onClick={() => scrollToSlide(index)}
              className={`w-10 h-10 rounded flex items-center justify-center font-bold transition-all ${
                currentIndex.value === index
                  ? "bg-primary text-primary-content scale-110"
                  : "bg-base-200 text-base-content/60 hover:bg-base-100"
              }`}
              aria-label={`Go to question ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

      {/* Keyboard hints - only show when not fullscreen */}
      {!isFullscreen.value && (
        <div className="text-center mt-3 text-xs text-base-content/40">
          <kbd className="kbd kbd-xs">←</kbd> <kbd className="kbd kbd-xs">→</kbd> Navigate
          <span className="mx-3">•</span>
          <kbd className="kbd kbd-xs">A</kbd> Answer
          <span className="mx-3">•</span>
          <kbd className="kbd kbd-xs">F</kbd> Fullscreen
        </div>
      )}
    </div>
  );
}