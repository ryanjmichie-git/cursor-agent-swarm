export default function Footer() {
  const linkClass =
    "text-sky-800 underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-800";

  return (
    <footer
      id="colophon"
      aria-labelledby="colophon-heading"
      className="bg-white text-slate-700 border-t border-slate-200"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 text-sm">
        <h2 id="colophon-heading" className="text-base font-semibold text-slate-900">
          Colophon
        </h2>
        <p className="max-w-prose mt-2">
          Three Grok Build frontend agents built the first header, hero, and footer in
          parallel. A Stop hook type-checks, lints, and builds the site at the end of each
          turn and hands any failure back to the agent to fix.
        </p>
        <p className="max-w-prose mt-2">
          Built with Next.js 15, React 19, TypeScript, and Tailwind CSS 4.
        </p>
        <p className="mt-2">
          <a href="https://github.com/ryanjmichie-git/cursor-agent-swarm" className={linkClass}>
            Source and demo script on GitHub
          </a>
        </p>
        <p className="mt-6">© 2026 Swarm</p>
      </div>
    </footer>
  );
}
