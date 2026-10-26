# Grok Swarm Website Demo — Handoff

This folder is a starter foundation for demonstrating a swarm of Grok Build agents building a website.

## What's included
- `AGENTS.md` — project rules (read by Grok Build and Cursor)
- `.grok/hooks/stop-verify.json` + `bin/stop-verify.sh` — Stop / SubagentStop quality gate
- `.grok/agents/frontend.md` and `reviewer.md` — custom agent definitions
- `.grok/skills/website-swarm/SKILL.md` — orchestration skill
- `package.json` — Next.js + TypeScript + Tailwind starter scripts (including `verify`)

## How to use in Cursor
1. Create a new project or open this folder.
2. Attach or paste the contents of these files into the first chat.
3. Use the handoff prompt below (or the one provided separately).

## Quick start after scaffolding
```bash
npm install
chmod +x bin/stop-verify.sh
npm run verify   # should eventually pass once the app is scaffolded
grok inspect     # confirm Grok Build sees the rules, hooks, agents, skills
```

Project hooks require trust the first time: `/hooks-trust` or `grok --trust`.

## Demo flow suggestion
1. Ask the agent (in Plan mode) to scaffold a simple marketing site.
2. Then ask it to implement 2–3 independent sections in parallel using the frontend agent.
3. Show the Stop hook blocking until `npm run verify` passes.
4. Optionally spawn a reviewer agent or a workflow.

Last updated: 2026-10-26
