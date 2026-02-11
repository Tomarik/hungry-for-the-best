import { useSignal, useComputed } from "@preact/signals";
import { useEffect } from "preact/hooks";
import type { TriviaQuestion, Difficulty, Tag } from "../types/trivia.ts";

const DIFFICULTIES = ["easy", "medium", "hard"] as const;
const TAGS = ["geography", "history", "science", "pop_culture"] as const;

export default function TriviaAdminPanel() {
  const questions = useSignal<TriviaQuestion[]>([]);
  const loading = useSignal(false);
  const filterDifficulty = useSignal<Difficulty | "all">("all");
  const filterTag = useSignal<Tag | "all">("all");
  const filterFlagged = useSignal(false);
  const showModal = useSignal(false);
  const editingQuestion = useSignal<TriviaQuestion | null>(null);
  
  // Form state
  const formQuestion = useSignal("");
  const formAnswers = useSignal("");
  const formDifficulty = useSignal<Difficulty>("easy");
  const formTags = useSignal<Tag[]>(["geography"]);

  // Filtered questions
  const filteredQuestions = useComputed(() => {
    let filtered = questions.value;
    
    if (filterDifficulty.value !== "all") {
      filtered = filtered.filter(q => q.difficulty === filterDifficulty.value);
    }
    
    if (filterTag.value !== "all") {
      filtered = filtered.filter(q => q.tags.includes(filterTag.value as Tag));
    }
    
    if (filterFlagged.value) {
      filtered = filtered.filter(q => q.flaggedForReview);
    }
    
    return filtered;
  });

  // Load questions
  const loadQuestions = async () => {
    loading.value = true;
    try {
      const response = await fetch("/api/trivia/questions");
      const data = await response.json();
      questions.value = data.questions || [];
    } catch (error) {
      console.error("Failed to load questions:", error);
      alert("Failed to load questions");
    } finally {
      loading.value = false;
    }
  };

  // Load on mount
  useEffect(() => {
    loadQuestions();
  }, []);

  // Open modal for creating new question
  const openCreateModal = () => {
    editingQuestion.value = null;
    formQuestion.value = "";
    formAnswers.value = "";
    formDifficulty.value = "easy";
    formTags.value = ["geography"];
    showModal.value = true;
  };

  // Open modal for editing
  const openEditModal = (question: TriviaQuestion) => {
    editingQuestion.value = question;
    formQuestion.value = question.question;
    formAnswers.value = question.answers.join(", ");
    formDifficulty.value = question.difficulty;
    formTags.value = question.tags;
    showModal.value = true;
  };

  // Save question (create or update)
  const saveQuestion = async (e: Event) => {
    e.preventDefault();
    
    const answers = formAnswers.value
      .split(",")
      .map(a => a.trim())
      .filter(a => a.length > 0);

    if (!formQuestion.value || answers.length === 0 || formTags.value.length === 0) {
      alert("Please fill in all required fields");
      return;
    }

    const payload = {
      question: formQuestion.value,
      answers,
      difficulty: formDifficulty.value,
      tags: formTags.value,
    };

    try {
      loading.value = true;
      
      if (editingQuestion.value) {
        // Update existing
        const response = await fetch(`/api/trivia/questions/${editingQuestion.value.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        
        if (!response.ok) throw new Error("Failed to update");
      } else {
        // Create new
        const response = await fetch("/api/trivia/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        
        if (!response.ok) throw new Error("Failed to create");
      }

      showModal.value = false;
      await loadQuestions();
    } catch (error) {
      console.error("Failed to save question:", error);
      alert("Failed to save question");
    } finally {
      loading.value = false;
    }
  };

  // Delete question
  const deleteQuestion = async (id: string, hard = false) => {
    const confirmMsg = hard 
      ? "Permanently delete this question? This cannot be undone!"
      : "Soft delete this question?";
    
    if (!confirm(confirmMsg)) return;

    try {
      loading.value = true;
      const url = hard ? `/api/trivia/questions/${id}?hard=true` : `/api/trivia/questions/${id}`;
      const response = await fetch(url, { method: "DELETE" });
      
      if (!response.ok) throw new Error("Failed to delete");
      
      await loadQuestions();
    } catch (error) {
      console.error("Failed to delete question:", error);
      alert("Failed to delete question");
    } finally {
      loading.value = false;
    }
  };

  // Toggle flag
  const toggleFlag = async (id: string) => {
    try {
      const response = await fetch(`/api/trivia/questions/${id}/flag`, {
        method: "POST",
      });
      
      if (!response.ok) throw new Error("Failed to toggle flag");
      
      await loadQuestions();
    } catch (error) {
      console.error("Failed to toggle flag:", error);
      alert("Failed to toggle flag");
    }
  };

  // Reset all answers
  const resetAllAnswers = async () => {
    if (!confirm("Reset all answered questions? This will mark all questions as unanswered.")) {
      return;
    }

    try {
      loading.value = true;
      const response = await fetch("/api/trivia/questions/reset-all", {
        method: "POST",
      });
      
      if (!response.ok) throw new Error("Failed to reset");
      
      const data = await response.json();
      alert(`Reset ${data.count} questions`);
      await loadQuestions();
    } catch (error) {
      console.error("Failed to reset answers:", error);
      alert("Failed to reset answers");
    } finally {
      loading.value = false;
    }
  };

  // Toggle tag selection
  const toggleTag = (tag: Tag) => {
    if (formTags.value.includes(tag)) {
      formTags.value = formTags.value.filter(t => t !== tag);
    } else {
      formTags.value = [...formTags.value, tag];
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="card bg-base-200">
        <div className="card-body">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              {/* Difficulty filter */}
              <select 
                className="select select-bordered"
                value={filterDifficulty.value}
                onChange={(e) => filterDifficulty.value = (e.currentTarget as HTMLSelectElement).value as Difficulty | "all"}
              >
                <option value="all">All Difficulties</option>
                {DIFFICULTIES.map(d => (
                  <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                ))}
              </select>

              {/* Tag filter */}
              <select 
                className="select select-bordered"
                value={filterTag.value}
                onChange={(e) => filterTag.value = (e.currentTarget as HTMLSelectElement).value as Tag | "all"}
              >
                <option value="all">All Tags</option>
                {TAGS.map(t => (
                  <option key={t} value={t}>{t.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</option>
                ))}
              </select>

              {/* Flagged filter */}
              <label className="label cursor-pointer gap-2">
                <input 
                  type="checkbox" 
                  className="checkbox checkbox-primary"
                  checked={filterFlagged.value}
                  onChange={(e) => filterFlagged.value = (e.currentTarget as HTMLInputElement).checked}
                />
                <span className="label-text">Flagged Only</span>
              </label>
            </div>

            <div className="flex gap-2">
              <button 
              type="button"
                className="btn btn-warning btn-sm"
                onClick={resetAllAnswers}
                disabled={loading.value}
              >
                Reset All Answers
              </button>
              <button 
              type="button"
                className="btn btn-primary btn-sm"
                onClick={openCreateModal}
                disabled={loading.value}
              >
                + New Question
              </button>
            </div>
          </div>

          <div className="text-sm opacity-60">
            Showing {filteredQuestions.value.length} of {questions.value.length} questions
          </div>
        </div>
      </div>

      {/* Questions list */}
      {loading.value ? (
        <div className="flex justify-center p-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : filteredQuestions.value.length === 0 ? (
        <div className="card bg-base-200">
          <div className="card-body text-center">
            <p className="text-lg opacity-60">No questions found</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.value.map(q => (
            <div key={q.id} className="card bg-base-200">
              <div className="card-body">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`badge ${
                        q.difficulty === "easy" ? "badge-success" :
                        q.difficulty === "medium" ? "badge-warning" :
                        "badge-error"
                      }`}>
                        {q.difficulty}
                      </span>
                      {q.tags.map(tag => (
                        <span key={tag} className="badge badge-ghost">
                          {tag.replace(/_/g, " ")}
                        </span>
                      ))}
                      {q.answeredCorrectly && (
                        <span className="badge badge-info">Answered</span>
                      )}
                      {q.flaggedForReview && (
                        <span className="badge badge-warning">🚩 Flagged</span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2">{q.question}</h3>
                    
                    <div className="text-sm opacity-80">
                      <strong>Answers:</strong> {q.answers.join(", ")}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                    type="button"
                      className="btn btn-sm btn-ghost"
                      onClick={() => toggleFlag(q.id)}
                      title={q.flaggedForReview ? "Unflag" : "Flag for review"}
                    >
                      🚩
                    </button>
                    <button 
                    type="button"
                      className="btn btn-sm btn-primary"
                      onClick={() => openEditModal(q)}
                    >
                      Edit
                    </button>
                    <button 
                    type="button"
                      className="btn btn-sm btn-error"
                      onClick={() => deleteQuestion(q.id, false)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal.value && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">
              {editingQuestion.value ? "Edit Question" : "Create Question"}
            </h3>
            
            <form onSubmit={saveQuestion} className="space-y-4">
              {/* Question */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Question *</span>
                </label>
                <textarea 
                  className="textarea textarea-bordered h-24"
                  placeholder="Enter the question"
                  value={formQuestion.value}
                  onInput={(e) => formQuestion.value = (e.currentTarget as HTMLTextAreaElement).value}
                  required
                />
              </div>

              {/* Answers */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Answers * (comma-separated)</span>
                </label>
                <input 
                  type="text"
                  className="input input-bordered"
                  placeholder="Answer 1, Answer 2, Answer 3"
                  value={formAnswers.value}
                  onInput={(e) => formAnswers.value = (e.currentTarget as HTMLInputElement).value}
                  required
                />
              </div>

              {/* Difficulty */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Difficulty *</span>
                </label>
                <select 
                  className="select select-bordered"
                  value={formDifficulty.value}
                  onChange={(e) => formDifficulty.value = (e.currentTarget as HTMLSelectElement).value as Difficulty}
                  required
                >
                  {DIFFICULTIES.map(d => (
                    <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Tags * (select at least one)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {TAGS.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      className={`btn btn-sm ${formTags.value.includes(tag) ? "btn-primary" : "btn-outline"}`}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="modal-action">
                <button 
                  type="button"
                  className="btn"
                  onClick={() => showModal.value = false}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading.value}
                >
                  {loading.value ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
          <div 
            className="modal-backdrop"
            onClick={() => showModal.value = false}
          />
        </dialog>
      )}
    </div>
  );
}
