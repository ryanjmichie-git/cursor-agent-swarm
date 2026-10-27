# Handoff

Date: 2026-10-27. Session: review of the Grok swarm demo, then the approved plan to make it
demo-ready (plan: `C:\Users\RyanMichie\.claude\plans\please-create-a-plan-glittery-cocke.md`).
Second session (same day): the interactive dry run of `docs/DEMO.md` from NEXT_SESSION.md.

## Built

- Dry-run session: `docs/DEMO.md` and `README.md` corrected from an interactive run (the
  commit after `ba35ba2`). DEMO.md now gives measured times, the real plan-approval pane,
  step 7 as optional, and what to do when `/quit` doesn't return.

- Branch `demo-ready`, from `main` at `d3a7e08`. 7 new commits:
  - `7e0b7ce` Stop hook rewritten in Node (`bin/stop-verify.mjs`), run as `node` with `args`, so no shell. Main agent: `npm run verify`; `frontend` subagents: typecheck + lint only. Skips the session-end Stop, allows the stop after 3 identical failures, and logs to `.grok/logs/stop-verify.log`. Adds 6 tests (`npm run test:hook`) and `.claude/verify`.
  - `f371e98` Launchers `bin/start-grok.cmd` and `bin/start-grok.sh` turn off Claude and Cursor compat for that process. `.gitattributes` pins `.sh` to LF and `.cmd` to CRLF.
  - `9bd9134` `lint` is now `eslint .`, replacing the deprecated `next lint`. `@eslint/eslintrc` is a direct devDependency.
  - `da20c03` AGENTS.md, `website-swarm`, `frontend` and `reviewer` describe the real layout, file ownership and gate. Unverified claims cut: `/skillify`, 128-agent workflows, Grok Bots.
  - `f135724` The footer is a real colophon, so the "Read the colophon" link lands on content.
  - `0487e9e` The launchers also set `GROK_MEMORY=0`. Stale Grok memory notes described the old hook.
  - `1edc554` README rewritten for AI enthusiasts; new `docs/DEMO.md` run-of-show.
- The earlier sessions' 6 commits (`756bdf4` through `d3a7e08`) are unchanged. `components/Hero.tsx` has no type error.

## Decisions

- Grok demo sessions use repo config only, through the launchers. Reason: the audience sees what a cloner gets, and `stop_gate.py` can't force HANDOFF rewrites on stage.
- The hook runs in Node. Reason: it works the same on every OS, and `JSON.stringify` escapes Windows paths. The bash hook failed open under PowerShell, cut errors at 400 characters, and raising that cap broke its JSON on `C:\` paths (tested).
- The Windows launcher is a `.cmd`, not a `.ps1`. Reason: `-ExecutionPolicy Bypass` was blocked by the auto-mode classifier, and a `.cmd` needs no execution policy.
- `main` is the demo's starting state. The live demo adds three sections on a throwaway `demo-run` branch.
- `verify` includes the hook tests, so a broken gate can't pass.
- T7 (live Grok) ran before T6 (docs), so the docs cite measured behavior.
- Claude Code plugins in `~/.claude/plugins` can't be unloaded per launch. `grok plugin list` doesn't show them, and a project `[plugins] disabled` list had no effect (tested, then removed). This is documented; no Grok user config was edited.
- `bin/stop-verify.sh` was kept as a wrapper, not deleted.
- Review item 9 (fresh clone fails `tsc` before `.next` exists) is not true: `tsc` passed in a clone with no `.next`.
- The dry run used a `demo-run` branch cut from `demo-ready`, not `main`, because PR #2 isn't merged. Reason: the doc fixes then ride in PR #2, so the merged `main` has them.
- Grok's TUI was driven through a Windows pseudo-terminal (pywinpty + pyte in a scratch venv). Reason: headless `grok -p` can't test `/hooks-list`, `/plan` or the `a` key.
- DEMO.md step 7 (reviewer) is now optional. Reason: the `website-swarm` skill already runs the reviewer inside step 4; repeating it took 6m48s.
- Claude merged PR #2 on Ryan's "use your best judgment", with a merge commit, and kept `demo-ready`. Reason: dry run and verify passed, no CI or branch protection, and a merge commit lets local `main` fast-forward.
- No README row for the `npm audit` result. Reason: the README would grow past its last draft.
- PostCSS is fixed with an npm `overrides` entry, not Next.js 16 (Ryan asked Claude to address it). Reason: a major upgrade would void the rehearsal; the override moves only Next's nested PostCSS, to the version Tailwind already uses, and the built CSS doesn't change.
- The `/quit` hang is treated as a Grok 1.0.70 bug on Windows. DEMO.md now says to close the terminal after `/quit`. Reason: 6 of 6 runs, including a real console window.

## Artifacts

- `C:\Users\RyanMichie\Desktop\cursor-agent-swarm\README.md`
- `C:\Users\RyanMichie\Desktop\cursor-agent-swarm\docs\DEMO.md`
- `C:\Users\RyanMichie\Desktop\cursor-agent-swarm\AGENTS.md`
- `C:\Users\RyanMichie\Desktop\cursor-agent-swarm\bin\stop-verify.mjs`
- `C:\Users\RyanMichie\Desktop\cursor-agent-swarm\bin\test-stop-verify.mjs`
- `C:\Users\RyanMichie\Desktop\cursor-agent-swarm\bin\start-grok.cmd`
- `C:\Users\RyanMichie\Desktop\cursor-agent-swarm\bin\start-grok.sh`
- `C:\Users\RyanMichie\Desktop\cursor-agent-swarm\.grok\hooks\stop-verify.json`
- `C:\Users\RyanMichie\Desktop\cursor-agent-swarm\.grok\skills\website-swarm\SKILL.md`
- `C:\Users\RyanMichie\Desktop\cursor-agent-swarm\.grok\agents\frontend.md`
- `C:\Users\RyanMichie\Desktop\cursor-agent-swarm\.grok\agents\reviewer.md`
- `C:\Users\RyanMichie\Desktop\cursor-agent-swarm\components\Footer.tsx`
- `C:\Users\RyanMichie\Desktop\cursor-agent-swarm\.claude\verify`

## Acceptance status

- `.claude/verify` (`npm run verify`, run under cmd): exit 0 in 53 s on 2026-10-27; `test:hook` 6 pass, 0 fail; build prerendered `/`.
- Fresh clone of `demo-ready`: `npm ci` and `npm run verify` exit 0 (80 s). The README setup, the DEMO.md log commands (PowerShell and bash) and the reset sequence were all run there. The dev server returned 200 with a test section, and the reset left a clean tree.
- Live Grok 1.0.70, headless, through `bin\start-grok.cmd` from PowerShell, on a throwaway branch:
  - Hook log `Stop main full block 4.2s` then `Stop main full pass 44.1s` (TS2322 caught and fixed).
  - One `frontend` subagent: `SubagentStop frontend quick pass 14.3s`.
  - Grok memory files read: 2 before `GROK_MEMORY=0`, 0 after.
- `next start`: HTTP 200; the in-page links `#top`, `#overview` and `#colophon` all resolve; one `h1`.
- Interactive dry run, 2026-10-27 08:21 to 08:57, Grok 1.0.70 TUI (Grok 4.7, high) through `bin\start-grok.cmd`, DEMO.md steps 1 to 8 plus the reset:
  - Setup: `git pull`, `npm ci`, `npm run verify` took 151 s; verify exit 0.
  - `/hooks-list`: 3 hooks, the project Stop and SubagentStop (`command: node`) plus superpowers' `session_start`.
  - `/plan`: plan in about 85 s; one file per `frontend` agent; parent keeps `app/page.tsx` and `components/Header.tsx`.
  - `a` approved it. Three subagents ran together (2m06s, 6m16s, 9m14s). Log: `SubagentStop frontend quick pass` 15.8s, 15.4s, 16.0s, then `Stop main full pass 47.1s`. Step total 20m38s, including the parent's own reviewer run (5m35s, Pass).
  - Step 6: `Stop main full block 4.3s`, then `Stop main full pass 46.7s`; turn 1m11s.
  - Step 7: reviewer verdict Pass; turn 6m48s, then `Stop main full pass 47.7s`.
  - Step 8: `npm run dev` ready in 3.8 s, HTTP 200; ids `how-it-works`, `agents`, `try-it` match the header links; one `h1`; desktop render checked in headless Edge.
  - `/quit`: `grok.exe` stayed running, idle, in 2 of 2 runs, and was ended with `taskkill`.
  - Reset: on today's `main` it leaves `?? .grok/logs/` (that ignore rule is only on `demo-ready`); on `demo-ready`, which `main` becomes after the merge, `git status` is clean.
  - Two false starts from my harness (Git Bash rewrote `/hooks-list`; the driver crashed) ended Grok before any file changed.
- `npm run verify` after the doc fixes: exit 0 in 80 s; `test:hook` 6 pass, 0 fail.
- `npm audit` on `main`: 2 vulnerabilities (1 high, 1 moderate) in PostCSS 8.4.31, which Next.js 15.5.28 (latest 15.x) pins. On branch `post-dry-run-fixes` (`acae894`, npm override to `postcss@^8.5.32`): `npm ci` then `npm audit` found 0; `npm run verify` exit 0; the built CSS is byte-identical to `main`'s (MD5 `b3c309a0451bb4252cdf8d9f334e65ed`).
- `/quit` hang, 6 of 6 runs: typed `/quit` under the pseudo-terminal (3), `/quit` as the initial prompt there (1), and in a real `conhost` window (2). Grok's debug log stops mid-shutdown and the idle process never exits. Grok 1.0.70 is the latest stable (`grok update --check`).
- Not done:
  - The `--trust` launcher argument was not run, because it writes Grok's trust store.
  - Ctrl+Q as a clean exit: control keys sent through the pseudo-terminal had no visible effect, so it's untested.
  - The new sections were not checked at phone width.
  - Plugin hooks (superpowers SessionStart) are listed by `/hooks-list` and had no visible effect, but were not proven inert.
- Published: `9fd6cce` pushed to `demo-ready` (Ryan approved). PR #2 merged into `main` at 2026-10-27 13:09 UTC as `0435489`: https://github.com/ryanjmichie-git/cursor-agent-swarm/pull/2
- Merged `main`: DEMO.md step 1 as written: `git pull` fast-forwarded `d3a7e08..0435489`; `npm ci` and `npm run verify` exit 0 (195 s; 6 hook tests pass). The reset, run after simulated demo output on `demo-run`, left `git status` clean.
- `3febb8e` (handoff, kickoff, step 1 time) pushed to `origin/main` (Ryan approved).
- `post-dry-run-fixes` (the PostCSS override and the `/quit` doc update) pushed and merged into `main` via PR #3 as `97fc742` at 2026-10-27 13:48 UTC (Ryan approved): https://github.com/ryanjmichie-git/cursor-agent-swarm/pull/3
- Merged `main` at `97fc742`: DEMO.md step 1 as written: `git pull` fast-forwarded `3febb8e..97fc742`; `npm ci` and `npm run verify` exit 0 (192 s; 6 hook tests pass); `npm audit` found 0 vulnerabilities. The reset, run after simulated demo output, left `git status` clean.
- The commit after `97fc742` (this handoff and the kickoff) is local only, not pushed.

## Progress

10 of 10 plan tasks done (T0 to T9). Dry-run kickoff: 4 of 4 done-when items met. Both
optional follow-ups done and merged (PR #3).

## What's next

1. Done: `main` is pushed (`2529901` on `origin/main`).
2. Next session: build team lessons and checks from the approved plan,
   `docs/plans/2026-10-27-team-lessons.md`, on branch `feature/team-lessons`.
   The bake-off results that motivate it are in `Desktop\grok-bakeoff\harness\HANDOFF.md`.
3. Optional: report the `/quit` hang to xAI with the evidence above.
