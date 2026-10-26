export default function Header() {
  const linkClass =
    "text-sky-800 underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-800";

  return (
    <header id="top" className="bg-white text-slate-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <a href="#top" className={linkClass}>
          Swarm
        </a>
        <nav aria-label="Primary">
          <ul className="flex flex-wrap gap-x-4 gap-y-1">
            <li>
              <a href="#overview" className={linkClass}>
                Overview
              </a>
            </li>
            <li>
              <a href="#colophon" className={linkClass}>
                Colophon
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
