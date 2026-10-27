# Grok Swarm Website Demo

A small, real repo for showing a swarm of Grok Build agents extend a Next.js site in
parallel, with a quality gate that hands every failure back to the agent that caused it.

- **Parallel agents:** the parent agent plans, then one `frontend` subagent per section
  builds its own file at the same time.
- **A Stop hook as the gate:** when an agent tries to end its turn, a hook type-checks,
  lints and builds the site. If anything fails, the error goes back to the agent and it
  keeps working.
- **A reviewer:** a read-only `reviewer` agent checks the result against the plan.

The page in `main` (header, hero, colophon) is the starting point. The live demo adds
three more sections. [docs/DEMO.md](docs/DEMO.md) is the run-of-show with exact prompts.

## Requirements

| Tool | Version |
|------|---------|
| Grok Build | tested on 1.0.70 |
| Node.js | 18.18 or later (Next.js 15's minimum); tested on 24.21.0 |
| Git | any recent version |

Works on Windows, macOS and Linux. The hook runs with plain `node`, so Windows does not
need Git Bash or WSL.

## Set up

```bash
git clone https://github.com/ryanjmichie-git/cursor-agent-swarm.git
cd cursor-agent-swarm
npm ci
npm run verify
```

`npm run verify` should end with the build's route table, in about 1.5 minutes.

Then start Grok with the launcher for your system:

| System | Command |
|--------|---------|
| Windows (PowerShell or cmd) | `bin\start-grok.cmd` |
| macOS, Linux, Git Bash | `bin/start-grok.sh` |

The first time, trust the folder: type `/hooks-trust` in Grok, or start with
`bin\start-grok.cmd --trust` (`bin/start-grok.sh --trust`). Project hooks are skipped
until the folder is trusted. Type `/hooks-list` to see the Stop and SubagentStop hooks.

**Why a launcher?** Grok also loads your personal Claude Code and Cursor setup
(instructions, skills, hooks, MCP servers), plus its own memory of earlier sessions. The
launcher turns those off for that one process, so you see only what's in this repo.
Plain `grok` is unaffected. Claude Code plugins are only partly covered; see
Troubleshooting.

## How the gate works

| When | What runs | Typical time on the test machine |
|------|-----------|-----------------------------------|
| The main agent ends a turn | `npm run verify`: typecheck, lint, hook tests, build | 44 to 72 s when passing; 4 s when typecheck fails |
| A `frontend` subagent ends | typecheck + lint only | 12 to 16 s |
| The session closes | nothing (skipped) | |

- A failure prints `{"decision":"block","reason":...}` with the error text, and the agent
  keeps working in the same turn.
- Subagents skip the build so parallel agents never write to the same `.next` folder
  (two builds at once failed with `ENOENT` in testing).
- After 3 identical failures in a row the hook lets the turn end, so an agent that can't
  fix the error doesn't loop. Grok's own limit is 8 continuations per turn.
- Every run adds one line to `.grok/logs/stop-verify.log`, for example
  `Stop main full block 4.2s`. An allowed stop prints nothing in Grok, so this log is
  how you show the gate ran.

The hook is [bin/stop-verify.mjs](bin/stop-verify.mjs), registered in
[.grok/hooks/stop-verify.json](.grok/hooks/stop-verify.json). Its tests are in
[bin/test-stop-verify.mjs](bin/test-stop-verify.mjs) (`npm run test:hook`).

## Repo map

| Path | What it is |
|------|------------|
| [AGENTS.md](AGENTS.md) | Rules every Grok agent reads: stack, commands, file ownership |
| [.grok/agents/](.grok/agents/) | `frontend` and `reviewer` agent definitions |
| [.grok/skills/website-swarm/](.grok/skills/website-swarm/SKILL.md) | The plan, build, wire and review flow |
| [.grok/hooks/](.grok/hooks/stop-verify.json) | Stop and SubagentStop hook config |
| [bin/](bin/) | The hook, its tests, and the launchers |
| [app/](app/), [components/](components/) | The Next.js site: one component per section |
| [docs/DEMO.md](docs/DEMO.md) | Run-of-show for a live demo |

## Troubleshooting

| What you see | Why | Fix |
|--------------|-----|-----|
| `'grok' is not recognized` in a terminal opened before you installed Grok | That terminal has the old PATH | Open a new terminal, or restart VS Code. The launchers also add `~/.grok/bin` to PATH. |
| Hooks never run; the log file isn't created | Folder not trusted | Type `/hooks-trust` in Grok, then start a new session. |
| `command not found: bin/stop-verify.sh` or `PowerShell would open stop-verify.sh with its file type's app` | An old copy of the hook config | Pull the latest `.grok/hooks/stop-verify.json`. The hook now runs as `node`, so no shell is involved. |
| The Stop hook blocks again and again | The agent can't or won't fix the error, for example because you told it not to edit files | Let it fix the error. The hook gives up after 3 identical failures; Grok stops after 8. |
| Your Claude Code plugins still show in `grok inspect`, `/hooks-list` or the `/` menu | Grok 1.0.70 loads plugins from `~/.claude/plugins`. The launcher turns their skills off, but no per-launch switch unloads the plugins themselves. | Usually harmless: in the rehearsal runs they had no visible effect. If one gets in the way, present from an account without it. |
| `npm warn install-scripts unrs-resolver` during `npm ci` | npm 11 holds back that package's install script | Safe to ignore here: `npm run verify` passes without it. |
| The prompt doesn't come back after `/quit` | `grok.exe` kept running after `/quit` in 2 of 2 rehearsal runs (Windows) | Close that terminal and open a new one. |
| `grok --resume <id>` says the session wasn't found | Cause unknown (seen once) | Start a new session. |

## Reset after a demo

Run the demo on a throwaway branch, then go back to `main`:

```bash
git switch --discard-changes main
git branch -D demo-run
git clean -fd components
```

`git clean -fd components` removes only untracked files in `components/`, which are the
sections the demo created.
