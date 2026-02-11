import { useSignal } from "@preact/signals";

export default function LoginForm() {
  const password = useSignal("");
  const error = useSignal("");
  const loading = useSignal(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    error.value = "";
    loading.value = true;

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.value }),
      });

      if (response.ok) {
        // Redirect to admin page
        globalThis.location.href = "/trivia-admin";
      } else {
        const data = await response.json();
        error.value = data.error || "Invalid password";
      }
    } catch (err) {
      console.error("Login error:", err);
      error.value = "Login failed. Please try again.";
    } finally {
      loading.value = false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card w-96 bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Admin Login</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter admin password"
                className="input input-bordered"
                value={password.value}
                onInput={(e) => password.value = (e.currentTarget as HTMLInputElement).value}
                disabled={loading.value}
                required
              />
            </div>

            {error.value && (
              <div className="alert alert-error">
                <span>{error.value}</span>
              </div>
            )}

            <div className="card-actions">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading.value}
              >
                {loading.value ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
