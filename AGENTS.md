# AGENTS.md: Grok swarm website demo

A one-page Next.js site that Grok Build agents extend in parallel. A Stop hook keeps
any turn from ending until `npm run verify` passes.

## Stack and layout

- Next.js 15 (App Router), React 19, TypeScript (strict), Tailwind CSS 4.
- `app/page.tsx` assembles the page. `components/` holds one file per section.
- `bin/` holds the Stop hook and the Grok launchers. `.grok/` holds the agents, hook config and skill.
- Quality bar: verify passes; semantic, keyboard-accessible markup; responsive; meaning
  never shown by color alone.

## Commands

```bash
npm ci              # install exactly what package-lock.json pins
npm run dev         # http://localhost:3000
npm run typecheck   # tsc --noEmit
npm run lint        # eslint . + content and lesson checks (bin/check-*.mjs)
npm run test:hook   # tests for bin/stop-verify.mjs
npm run test:checks # tests for bin/check-content.mjs and bin/check-lessons.mjs
npm run build       # next build
npm run verify      # typecheck + lint + test:hook + test:checks + build (the gate)
```

## Agents

| Agent | Source | Job |
|-------|--------|-----|
| Parent session | you | Plan, assign files, wire `app/page.tsx`, final summary |
| `frontend` | `.grok/agents/frontend.md` | Build one assigned section; parallel-safe |
| `reviewer` | `.grok/agents/reviewer.md` | Read-only check against the plan |
| `explore`, `plan` | built in | Map the code; draft a plan |

The `website-swarm` skill (`.grok/skills/website-swarm/SKILL.md`) runs this flow. The
`propose-lesson` skill drafts a team lesson on a `lesson/*` branch.

## Working rules

1. Plan first for anything beyond one file. Wait for human approval on structure.
2. One owner per file. Each `frontend` agent creates or edits only its assigned files.
   The parent alone edits `app/page.tsx`, `app/layout.tsx`, config and `package.json`.
3. Don't use worktrees here. File ownership already prevents conflicts, and a fresh git
   worktree has no `node_modules`, so verify can't run in it.
4. After implementation, run `reviewer` with the plan text and the list of changed files.
5. If the Stop hook blocks, fix the cause in the same turn. Never end a turn red on purpose.
6. Small commits. Say which agents did the work.

## Team lessons vs personal preferences

- **Team:** [.grok/rules/team-lessons.md](.grok/rules/team-lessons.md). Grok loads it in
  every session. It changes only through the `propose-lesson` skill and a pull request, so
  everyone gets a lesson on their next pull. Cursor and Claude Code users: read it there.
- **Personal:** your own Grok memory (`/remember ...`; turn it on with
  `[memory] enabled = true` in your own `~/.grok/config.toml`) or `~/.grok/rules/`.
  Never commit personal preferences.
- **Promotion:** if your memory holds a rule your teammates need, ask Grok to propose it
  as a team lesson.
- **Enforced:** a lesson that recurs becomes a check in `bin/check-*.mjs`, run by `lint`.
- `bin/start-grok.cmd` turns memory off for clean demos. For daily work, run plain `grok`.
- Guide for teams: [docs/TEAM-WORKFLOW.md](docs/TEAM-WORKFLOW.md).

## The gate

- `.grok/hooks/stop-verify.json` runs `node bin/stop-verify.mjs` directly, with no shell.
- Main agent Stop: full `npm run verify`. `frontend` SubagentStop: typecheck + lint only,
  so parallel agents never build into the same `.next` folder.
- `lint` also fails on placeholder or empty source files, a lesson with no source, or a
  `.grok/rules/` edit on a branch not named `lesson/*`.
- A failure blocks with the error text and the agent keeps working. After 3 identical
  failures in a row the turn may end red; Grok's own limit is 8 continuations per turn.
- Each run adds a line to `.grok/logs/stop-verify.log`.
- Check what Grok loaded with `grok inspect` or `/hooks-list`.

Last updated: 2026-10-27
