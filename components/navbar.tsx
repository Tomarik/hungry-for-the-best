export default function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="flex-none">
        <div className="drawer drawer-start z-50">
          <input id="main-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label htmlFor="main-drawer" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-5 h-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                >
                </path>
              </svg>
            </label>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="main-drawer"
              aria-label="close sidebar"
              className="drawer-overlay"
            >
            </label>
            <ul className="menu p-4 w-80 min-h-full bg-base-200 pt-20">
              <li className="absolute top-4 left-4">
                <label
                  htmlFor="main-drawer"
                  className="btn btn-square btn-ghost"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block w-6 h-6 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    >
                    </path>
                  </svg>
                </label>
              </li>
              <li className="bg-transparent">
                <a
                  className="text-xl hover:text-primary hover:bg-transparent font-[Poppins]"
                  href="/"
                >
                  Home
                </a>
              </li>

              <li className="bg-transparent">
                <a
                  className="text-xl hover:text-primary hover:bg-transparent font-[Poppins]"
                  href="/trivia-admin"
                >
                  Trivia Admin
                </a>
              </li>

              {/* Version text at bottom */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <span className="text-xs text-base-content/50">
                  Version 2.11.2026
                </span>
              </div>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <a
          href="/"
          className="text-xl md:text-2xl lg:text-3xl font-[Permanent_Marker] tracking-widest no-underline">
          Hungry for the Best
        </a>
      </div>
    </div>
  );
}