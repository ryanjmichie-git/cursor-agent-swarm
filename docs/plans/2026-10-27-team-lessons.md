# Plan: Team lessons and checks for cursor-agent-swarm (to run in a new session)

**Goal:** Agents in this repo get better over time for everyone who clones it. Repeat problems become
checks in the gate. Other lessons go in one git-tracked file that Grok loads in every session. Personal
preferences stay in each user's own Grok memory, never in git. A one-page guide answers attendees'
question: "how can I use this in my team's workflow?"
**Effort:** medium, about 1 to 1.5 hours. No new dependencies.
**Done when:**
- [ ] `npm run verify` exits 0, including a new `test:checks` step.
- [ ] `bin/test-checks.mjs` passes. It proves `check-content` catches a placeholder file and an empty file,
      and passes clean code. It also proves `check-lessons` catches a lesson with no source, catches a
      lessons edit on a non-`lesson/*` branch, and allows one on `lesson/x`.
- [ ] `grok inspect`, run with the demo launcher's environment, lists `.grok/rules/team-lessons.md`.
- [ ] `.grok/rules/team-lessons.md` holds 5 seed lessons, each with a source you can open.
- [ ] `docs/TEAM-WORKFLOW.md` exists, under 450 words; README and AGENTS.md link to it.
- [ ] The demo is unchanged: no diff to `bin/stop-verify.mjs`, `bin/start-grok.*` or `.grok/hooks/`;
      the docs/DEMO.md steps still hold.
- [ ] Committed on branch `feature/team-lessons`, with the verify result in the commit body. Not pushed.
**Don't touch:** `~/.grok` (config, memory, rules), `~/.claude`, the behavior of `bin/stop-verify.mjs` and
the `bin/start-grok.*` launchers, Ryan's Grok session 49072, the grok-bakeoff repos.

## Context
Today's bake-off showed what goes wrong without shared learning:
- grok.com chat committed a file as one placeholder line;
- a chart rendered empty;
- a reviewer caught a low-contrast border;
- a swarm left dev servers running.

Today nothing carries a lesson from one run to the next. `bin/start-grok.cmd` turns Grok memory off
(`GROK_MEMORY=0`) so demos start clean.

Facts from Grok 1.0.70's own docs (`~/.grok/docs/user-guide/`):
- **Project rules** (12-project-rules.md): every `*.md` in `<repo>/.grok/rules/` is always loaded at session
  start, after trust. The demo launcher only turns off Claude and Cursor compatibility, so these still load.
- **Memory** (13-memory.md): experimental, off by default, and stored per user in `~/.grok/memory-v2/`.
  There are two scopes: global, and workspace (clones of one repo share a workspace scope on that machine).
  `/remember` saves a note to global memory after you confirm it. Users turn memory on in their own
  `~/.grok/config.toml` (`[memory] enabled = true`).
- **The repo can't switch memory on:** a project `.grok/config.toml` loads only MCP servers, plugins and
  permission rules. Personal memory therefore stays personal by design.
- **Permissions** (22-permissions-and-safety.md): under always-approve (the demo's mode), `ask` rules on file
  edits do not prompt. Git review is therefore the control for team lessons, backed by a gate check.

## Step 0 (this session, after approval)
Save this plan as `docs/plans/2026-10-27-team-lessons.md`, and point `NEXT_SESSION.md` at it. Commit
locally on `main`, and don't push.

## Part 1: repeat problems become checks
1. `bin/check-content.mjs` (new, Node built-ins only). It scans `app/`, `components/` and `lib/` for:
   - placeholder markers (`PLACEHOLDER`, `lorem ipsum`, `TODO: implement`, `... rest of (the) code/file`,
     `// ...existing code`), case-insensitive;
   - source files with no real content (under 20 non-space characters).

   It prints `file:line: reason` and exits 1 on any hit. It follows the style of `bin/stop-verify.mjs`:
   a header comment, `node:` imports, no dependencies.
2. Wire it into the quick gate. Set `"lint": "eslint . && node bin/check-content.mjs && node bin/check-lessons.mjs"`
   in `package.json`. The SubagentStop quick check (typecheck + lint) and the full verify then both run it,
   with no change to `stop-verify.mjs`.
3. `bin/test-checks.mjs` (new). Use `node:test` plus temp fixture folders, the same pattern as
   `bin/test-stop-verify.mjs`. Both scripts must accept a root folder, through an argument or an env
   variable, so the tests can point them at fixtures. Add `"test:checks": "node bin/test-checks.mjs"`, and
   add it to `verify` after `test:hook`.
4. The rule, stated at the top of team-lessons.md and in the guide: **a lesson that recurs becomes a check.**
   A lesson enforced by a check says so ("Enforced by bin/check-content.mjs").

## Part 2: team lessons in git, personal preferences in Grok memory
1. **`.grok/rules/team-lessons.md`** (new; auto-loaded). It starts with a 4-line header: what belongs here,
   the format, the 40-lesson cap, and "change only through the propose-lesson skill and a pull request".
   Each lesson is one line: `- <rule in the imperative>. Source: <where it was seen, date, link>.`

   Seed lessons. Re-check each source before writing it:
   - Never commit a placeholder or empty file in place of real code. Enforced by `bin/check-content.mjs`.
     Source: Grok sweep, 2026-10-27, grok-bakeoff-sweep `run/web-1` @ `9669ea8` (Spending.vue).
   - Chart bars sized in % need a parent with a set height; check the rendered chart, not only the build.
     Source: Grok bake-off pilot, 2026-10-27, grok-bakeoff-arena `run/web-1`, `components/Dashboard.tsx:229-237`.
   - Control borders need 3:1 contrast with their background (WCAG 1.4.11). Source: reviewer finding in
     the pilot swarm run, 2026-10-27, grok-bakeoff-arena `run/swarm-1`. Verify the slate-400 and
     slate-500 ratios with a contrast calculation first.
   - Stop any dev server you start before ending the turn. Source: Grok sweep, 2026-10-27: the swarm left
     Vite on port 3000 and the API on 8001 running.
   - Report only what the diff and `npm run verify` show; never claim an uncommitted fix. Source: Grok
     sweep, 2026-10-27: chat claimed a Dashboard fix, but Dashboard.vue was unchanged on `run/web-1`.
2. **`bin/check-lessons.mjs`** (new; runs in `lint`). It fails when:
   - a lesson line has no `Source:`;
   - there are more than 40 lessons;
   - `.grok/rules/` has uncommitted changes and the current branch isn't `lesson/*`.

   The last rule stops an agent editing lessons in the middle of feature work. Under always-approve,
   the Stop hook then sends it back to undo the edit.
3. **`.grok/skills/propose-lesson/SKILL.md`** (new). It triggers on "make that a team lesson", "propose a
   lesson", or a reviewer's proposed lesson. Steps:
   - draft one line in the format, with a real source;
   - check team-lessons.md for duplicates and conflicts;
   - create `lesson/<slug>` from the current `main`;
   - add the line, run `npm run verify`, commit;
   - **ask the user before pushing or opening a PR.**

   If a lesson has recurred, it suggests turning it into a check instead.
4. **Agents propose; they never edit.** This involves three files:
   - `.grok/agents/reviewer.md`: add a "Proposed lessons" item to its return list, for problems seen twice
     or that the gate blocked. One line each, with a source.
   - `.grok/agents/frontend.md`: report a repeat problem as a proposed lesson. Never edit `.grok/rules/`.
   - `.grok/skills/website-swarm/SKILL.md`, step 6: the summary lists proposed lessons.
5. **AGENTS.md** gets a short "Team lessons vs personal preferences" section:
   - **Team:** `.grok/rules/team-lessons.md`, changed through the propose-lesson skill and a PR, so
     everyone gets it on pull. Cursor and Claude Code users read the same file via this link.
   - **Personal:** your own Grok memory (`/remember ...`; turn it on in your own `~/.grok/config.toml`) or
     `~/.grok/rules/`. Never commit personal preferences.
   - **Promotion:** if your memory holds a rule your teammates need, ask Grok to propose it as a team lesson.
   - **Note:** `bin/start-grok.cmd` turns memory off for clean demos; for daily work run plain `grok`.
   - Also add `test:checks` to the Commands block.
6. **`docs/TEAM-WORKFLOW.md`** (new, under 450 words; for attendees and project leads):
   - a table showing where each kind of knowledge lives (personal: Grok memory or `~/.grok/rules`;
     team: team-lessons.md; enforced: `bin/check-*.mjs` in verify);
   - the loop: an agent hits a problem, the reviewer proposes a lesson, a person approves the PR, everyone
     pulls, and a repeat becomes a check;
   - 5 steps to adopt it in your repo: copy `.grok/` and `bin/`, set a `verify` script, trust the folder,
     add team-lessons.md, and add a CODEOWNERS entry for `.grok/rules/` with "Require review from Code
     Owners" turned on in branch protection.
7. **README.md:** one line in the repo map and a link to the guide. Add `test:checks` to the gate table.

## Verification (run in the new session)
- `npm run verify`: exit 0; show the tail.
- `npm run test:checks`: every case passes; show the counts.
- Negative test by hand: add `PLACEHOLDER` to a component, and `npm run lint` fails with `file:line`;
  revert it. Edit `.grok/rules/team-lessons.md` on `feature/team-lessons`, and lint fails; revert it.
- `grok inspect` with `GROK_MEMORY=0` and the compatibility variables set as in `bin/start-grok.cmd`:
  `team-lessons.md` is listed.
- Optional, a few cents: run headless `bin\start-grok.cmd -p "List the team lessons you must follow here."
  --output-format json` and confirm it quotes the 5 lessons.
- `git diff main --stat` shows no change to `bin/stop-verify.mjs`, `bin/start-grok.*` or `.grok/hooks/`.
