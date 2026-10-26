export default function Hero() {
  return (
    <section
      id="overview"
      aria-labelledby="overview-heading"
      className="bg-white text-slate-900"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <h1
          id="overview-heading"
          className="text-4xl sm:text-5xl font-semibold tracking-tight"
        >
          A swarm of agents built this page.
        </h1>
        <p className="max-w-prose text-lg text-slate-700 mt-4">
          Three agents each added one section.
        </p>
        <a
          href="#colophon"
          className="inline-block mt-8 rounded-md bg-sky-800 px-4 py-2 text-white font-medium hover:bg-sky-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-800"
        >
          Read the colophon
        </a>
      </div>
    </section>
  );
}
