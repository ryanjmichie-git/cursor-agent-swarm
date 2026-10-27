# Handoff

Date: 2026-10-27. Session: review of the Grok swarm demo, then the approved plan to make it
demo-ready (plan: `C:\Users\RyanMichie\.claude\plans\please-create-a-plan-glittery-cocke.md`).

## Built

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
- Not done:
  - The interactive Grok steps in DEMO.md (`/hooks-list`, `/plan`, approving with `a`, the 3-agent parallel build, the reviewer) were not rehearsed.
  - The `--trust` launcher argument was not run, because it writes Grok's trust store.
  - `npm audit` was not run (npm reported 2 vulnerabilities at install on 2026-10-26).
  - Plugin hooks (superpowers SessionStart) had no visible effect but were not proven inert.
- Sign-off: Ryan reviews and merges the PR into `main`.

## Progress

9 of 10 plan tasks done (T0 to T8). T9, the push and PR, is next. No time estimate recorded.

## What's next

Push `demo-ready` and open a PR into `main` (T9). Then Ryan does one interactive dry run of
`docs/DEMO.md` before presenting.
