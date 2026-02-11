export default function LogoutButton() {
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    globalThis.location.href = "/";
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="btn btn-ghost btn-sm"
    >
      Logout
    </button>
  );
}