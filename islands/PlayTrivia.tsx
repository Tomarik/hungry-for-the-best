import { useComputed, useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import type { Difficulty, Tag, TriviaQuestion } from "../types/trivia.ts";

const DIFFICULTIES = ["easy", "medium", "hard"] as const;
const TAGS = [
  "animal",
  "art",
  "brand",
  "general",
  "geography",
  "history",
  "movie",
  "music",
  "pop_culture",
  "science",
  "space",
  "sport",
  "tech",
  "tv",
] as const;

const DIFFICULTY_BADGE: Record<Difficulty, string> = {
  easy: "badge-success",
  medium: "badge-warning",
  hard: "badge-error",
};

const DIFFICULTY_BORDER: Record<Difficulty, string> = {
  easy: "border-l-success",
  medium: "border-l-warning",
  hard: "border-l-error",
};

export default function PlayTrivia() {
  const questions = useSignal<TriviaQuestion[]>([]);
  const loading = useSignal(false);
  const filterDifficulty = useSignal<Difficulty | "all">("all");
  const filterTag = useSignal<Tag | "all">("all");
  const filterCustomTag = useSignal<string>("all");
  const revealedIds = useSignal<string[]>([]);
  const isFullscreen = useSignal(false);

  // Derived: all unique custom tags across questions
  const availableCustomTags = useComputed(() => {
    const tagSet = new Set<string>();
    for (const q of questions.value) {
      for (const t of q.customTags ?? []) {
        tagSet.add(t);
      }
    }
    return Array.from(tagSet).sort();
  });

  // Derived: active questions (not answered, not flagged), with filters applied
  const filteredQuestions = useComputed(() => {
    let filtered = questions.value.filter(
      (q) => !q.answeredCorrectly && !q.flaggedForReview,
    );

    if (filterDifficulty.value !== "all") {
      filtered = filtered.filter(
        (q) => q.difficulty === filterDifficulty.value,
      );
    }

    if (filterTag.value !== "all") {
      filtered = filtered.filter((q) =>
        q.tags.includes(filterTag.value as Tag)
      );
    }

    if (filterCustomTag.value !== "all") {
      filtered = filtered.filter((q) =>
        (q.customTags ?? []).includes(filterCustomTag.value)
      );
    }

    return filtered;
  });

  const totalActive = useComputed(
    () =>
      questions.value.filter((q) => !q.answeredCorrectly && !q.flaggedForReview)
        .length,
  );

  const loadQuestions = async () => {
    loading.value = true;
    try {
      const res = await fetch("/api/trivia/questions");
      const data = await res.json();
      questions.value = data.questions || [];
    } catch (err) {
      console.error("Failed to load questions:", err);
    } finally {
      loading.value = false;
    }
  };

  useEffect(() => {
    loadQuestions();

    const onFsChange = () => {
      isFullscreen.value = !!document.fullscreenElement;
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const markAnswered = async (id: string) => {
    try {
      const res = await fetch(`/api/trivia/questions/${id}/answer`, {
        method: "POST",
      });
      if (res.ok) {
        questions.value = questions.value.map((q) =>
          q.id === id
            ? {
              ...q,
              answeredCorrectly: true,
              answeredOn: new Date().toISOString(),
            }
            : q
        );
        revealedIds.value = revealedIds.value.filter((rid) => rid !== id);
      }
    } catch (err) {
      console.error("Failed to mark answered:", err);
    }
  };

  const flagQuestion = async (id: string) => {
    try {
      const res = await fetch(`/api/trivia/questions/${id}/flag`, {
        method: "POST",
      });
      if (res.ok) {
        questions.value = questions.value.map((q) =>
          q.id === id ? { ...q, flaggedForReview: true } : q
        );
        revealedIds.value = revealedIds.value.filter((rid) => rid !== id);
      }
    } catch (err) {
      console.error("Failed to flag question:", err);
    }
  };

  const toggleReveal = (id: string) => {
    if (revealedIds.value.includes(id)) {
      revealedIds.value = revealedIds.value.filter((rid) => rid !== id);
    } else {
      revealedIds.value = [...revealedIds.value, id];
    }
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

  const clearFilters = () => {
    filterDifficulty.value = "all";
    filterTag.value = "all";
    filterCustomTag.value = "all";
  };

  const hasActiveFilters = useComputed(
    () =>
      filterDifficulty.value !== "all" ||
      filterTag.value !== "all" ||
      filterCustomTag.value !== "all",
  );

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-4xl font-bold text-base-content tracking-tight">
            🎯 Play Trivia
          </h1>
          <p className="text-sm opacity-50 mt-1">
            {loading.value
              ? "Loading questions…"
              : `${filteredQuestions.value.length} of ${totalActive.value} active questions shown`}
          </p>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <button
            type="button"
            className="btn btn-sm btn-ghost gap-2"
            onClick={loadQuestions}
            disabled={loading.value}
            title="Refresh questions"
          >
            {loading.value
              ? <span className="loading loading-spinner loading-xs" />
              : "↻ "}
            Refresh
          </button>

          <button
            type="button"
            className="btn btn-sm btn-outline gap-2"
            onClick={toggleFullscreen}
            title={isFullscreen.value ? "Exit full screen" : "Enter full screen"}
          >
            {isFullscreen.value
              ? (
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
              )
              : (
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

      {/* ── Filters ────────────────────────────────────────────── */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body py-4">
          <div className="flex flex-wrap gap-4 items-end">
            {/* Difficulty */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs uppercase tracking-wider opacity-60 font-semibold">
                  Difficulty
                </span>
              </label>
              <select
                className="select select-bordered select-sm min-w-36"
                value={filterDifficulty.value}
                onChange={(e) =>
                  filterDifficulty.value =
                    (e.currentTarget as HTMLSelectElement).value as
                      | Difficulty
                      | "all"}
              >
                <option value="all">All Difficulties</option>
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Category (predefined tags) */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs uppercase tracking-wider opacity-60 font-semibold">
                  Category
                </span>
              </label>
              <select
                className="select select-bordered select-sm min-w-44"
                value={filterTag.value}
                onChange={(e) =>
                  filterTag.value = (e.currentTarget as HTMLSelectElement)
                    .value as Tag | "all"}
              >
                <option value="all">All Categories</option>
                {TAGS.map((t) => (
                  <option key={t} value={t}>
                    {t.replace(/_/g, " ").replace(/\b\w/g, (l) =>
                      l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom tags (only shown if any exist) */}
            {availableCustomTags.value.length > 0 && (
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs uppercase tracking-wider opacity-60 font-semibold">
                    Custom Tag
                  </span>
                </label>
                <select
                  className="select select-bordered select-sm min-w-40"
                  value={filterCustomTag.value}
                  onChange={(e) =>
                    filterCustomTag.value =
                      (e.currentTarget as HTMLSelectElement).value}
                >
                  <option value="all">All Custom Tags</option>
                  {availableCustomTags.value.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Clear filters */}
            {hasActiveFilters.value && (
              <button
                type="button"
                className="btn btn-ghost btn-sm mt-auto opacity-70 hover:opacity-100"
                onClick={clearFilters}
              >
                ✕ Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Questions list ─────────────────────────────────────── */}
      {loading.value
        ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
            <span className="loading loading-spinner loading-lg" />
            <p>Loading questions…</p>
          </div>
        )
        : filteredQuestions.value.length === 0
        ? (
          <div className="card bg-base-200">
            <div className="card-body items-center text-center py-16">
              <p className="text-5xl mb-3">🎉</p>
              <p className="text-xl font-semibold opacity-70">
                No questions remaining
              </p>
              <p className="text-sm opacity-40 mt-1">
                {hasActiveFilters.value
                  ? "Try clearing your filters to see more questions."
                  : "All questions have been answered or flagged."}
              </p>
              {hasActiveFilters.value && (
                <button
                  type="button"
                  className="btn btn-outline btn-sm mt-4"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )
        : (
          <div className="space-y-4">
            {filteredQuestions.value.map((q) => {
              const isRevealed = revealedIds.value.includes(q.id);
              return (
                <div
                  key={q.id}
                  className={`card bg-base-200 shadow-md border-l-4 ${
                    DIFFICULTY_BORDER[q.difficulty]
                  } transition-all`}
                >
                  <div className="card-body gap-3">
                    {/* Badges row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`badge badge-sm font-semibold ${
                          DIFFICULTY_BADGE[q.difficulty]
                        }`}
                      >
                        {q.difficulty}
                      </span>
                      {q.tags.map((tag) => (
                        <span key={tag} className="badge badge-ghost badge-sm">
                          {tag.replace(/_/g, " ")}
                        </span>
                      ))}
                      {(q.customTags ?? []).map((tag) => (
                        <span
                          key={tag}
                          className="badge badge-outline badge-accent badge-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Question text */}
                    <h3 className="text-xl font-semibold leading-snug text-base-content">
                      {q.question}
                    </h3>

                    {/* Answer panel (shown when revealed) */}
                    {isRevealed && (
                      <div className="bg-base-300 rounded-xl px-4 py-3 mt-1">
                        <p className="text-xs uppercase tracking-widest opacity-50 mb-1 font-semibold">
                          Answer
                        </p>
                        <p className="text-lg font-bold text-success">
                          {q.answers.join(" · ")}
                        </p>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        className={`btn btn-sm ${
                          isRevealed ? "btn-neutral" : "btn-primary"
                        }`}
                        onClick={() => toggleReveal(q.id)}
                      >
                        {isRevealed ? "Hide Answer" : "Show Answer"}
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-success gap-1"
                        onClick={() => markAnswered(q.id)}
                      >
                        ✓ Mark Correct
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-ghost opacity-50 hover:opacity-100 gap-1"
                        onClick={() => flagQuestion(q.id)}
                        title="Flag for review — removes from play"
                      >
                        🚩 Flag
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
}