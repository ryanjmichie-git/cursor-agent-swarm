# Team lessons

Rules every agent in this repo follows, learned from real runs. A lesson that recurs becomes a check in `npm run verify`, and then says "Enforced by".
Format: one line per lesson, `- <rule in the imperative>. Source: <where it was seen, date, link>.`
Cap: 40 lessons. When the file is full, merge lessons or turn ones that recur into checks.
Change this file only through the `propose-lesson` skill and a pull request. Personal preferences go in your own Grok memory, never here.

- Never commit a placeholder or empty file in place of real code. Enforced by `bin/check-content.mjs`. Source: grok.com chat in the Grok sweep, 2026-10-27, committed Spending.vue as the one line `PLACEHOLDER_FOR_SPENDING_CONTENT`: https://github.com/ryanjmichie-git/grok-bakeoff-sweep/commit/9669ea8.
- Give chart bars sized in % a parent with a set height, and check the rendered chart, not only the build. Source: grok.com chat in the Grok bake-off pilot, 2026-10-27; every bar rendered at zero height: https://github.com/ryanjmichie-git/grok-bakeoff-arena/blob/20689e1/components/Dashboard.tsx#L229-L237.
- Give control borders at least 3:1 contrast with their background (WCAG 2.2, 1.4.11: https://www.w3.org/TR/WCAG22/#non-text-contrast); on white, `slate-400` is 2.63:1 and fails, `slate-500` is 4.77:1 and passes. Source: reviewer finding in the pilot swarm run, 2026-10-27, on `components/FilterBar.tsx:17` (Grok session 01a17e18), fixed on https://github.com/ryanjmichie-git/grok-bakeoff-arena/tree/run/swarm-1.
- Stop any dev server you start before ending the turn. Source: Grok sweep swarm run, 2026-10-27; its last message said "The app is running at http://localhost:3000 with the API on port 8001", and the scorer then scored that server by mistake (Grok session 01a17e59, branch https://github.com/ryanjmichie-git/grok-bakeoff-sweep/tree/run/swarm-1).
- Report only what the diff and `npm run verify` show; never claim a fix you didn't commit. Source: grok.com chat in the Grok sweep, 2026-10-27; its pull request claimed a Dashboard fix, but no Dashboard file is in its diff: https://github.com/ryanjmichie-git/grok-bakeoff-sweep/pull/1.
