# AGENTS.md — Grok Swarm Website Demo

This repository is the foundation for a live demo: using a swarm of Grok Build agents (with optional Grok Bots) to plan, build, test, and evaluate a production-quality website.

Grok Build is deliberately Claude Code compatible. It reads `AGENTS.md`, `CLAUDE.md`, `.claude/`, `.cursor/`, skills, hooks, agents, and MCP with zero extra setup.

## Core Principles

- Prefer short, specific instructions. Long files are followed less reliably.
- Plan first for anything non-trivial. Use Plan mode or the built-in `plan` subagent.
- Use parallel subagents (and worktrees when needed) for independent work.
- Never finish a turn that changes code without running verification.
- Keep the human in the loop for architecture decisions and final review.
- Prefer official Grok Build behavior over community workarounds.

## Website Stack (demo default)

- Next.js (App Router) + TypeScript + Tailwind CSS
- Simple content site or marketing page that can be extended live
- Quality bar: builds cleanly, passes typecheck, basic a11y, responsive

Change the stack in this file if the demo needs something else. Agents must follow the commands listed below.

## Commands

```bash
# Install
npm install

# Dev
npm run dev

# Typecheck
npx tsc --noEmit

# Lint
npm run lint

# Build (must succeed)
npm run build

# Quick verify used by Stop hooks
npm run verify   # defined in package.json as typecheck + lint + build
```

## Agent Team Roles (recommended for the demo)

| Role              | Type / Location              | Responsibility                              | Notes |
|-------------------|------------------------------|---------------------------------------------|-------|
| Orchestrator      | Parent session               | Plan, delegate, synthesize, final review    | Stay on the main thread |
| Explore / Research| `explore` (built-in)         | Map codebase, find patterns, research docs  | Read-only |
| Planner           | `plan` (built-in) or custom  | Draft implementation plan                   | No edits |
| Frontend          | Custom in `.grok/agents/`    | Components, styling, pages, a11y            | Parallel-friendly |
| Tester / QA       | Custom or general-purpose    | Write/run tests, visual/a11y checks         | Use Stop hook |
| Reviewer / Skeptic| Custom or workflow           | Independent review against plan + quality bar | Prefer workflow for larger jobs |

Custom agents live in `.grok/agents/*.md`. Personas (tone/focus overlays) can live in `.grok/personas/`.

## Subagents & Parallelism

- Default: spawn up to ~4–8 parallel subagents for independent tasks.
- Use worktrees (`--worktree` or subagent worktree support) when agents edit overlapping areas.
- For complex multi-phase work (full site audit, multi-page implementation + review), prefer a Grok Build workflow (up to 128 agents, skeptic agents supported).
- Grok Bots (persistent, shared cloud computer) are complementary for orchestration, routines, or long-running coordination — not a replacement for in-repo Grok Build coding agents.

## Quality Gates & Evals

- A Stop hook must run before the agent is allowed to finish any turn that changed code.
- Minimum gate: typecheck + lint + build succeed.
- Optional: basic a11y (axe or similar), visual snapshot, or unit tests.
- The hook returns `{"decision":"block","reason":"..."}` on failure so the agent continues in the same turn.
- Cap: Grok Build stops after 8 continuations per turn (fail-open on hook timeout/crash).
- Also use SubagentStop for child agents when useful.

See `.grok/hooks/stop-verify.json` and the companion script.

## Skills

- Put repeatable procedures in `.grok/skills/<name>/SKILL.md`.
- Good candidates for this demo: “implement-page”, “review-diff”, “a11y-check”, “deploy-preview”.
- Capture a good session with `/skillify`.
- Skills are auto-invoked when relevant or called by name.

## Workflow Rules

1. Start complex work in Plan mode or with a plan subagent. Wait for human approval on architecture.
2. Decompose into independent slices so subagents can run in parallel.
3. After implementation, spawn a reviewer (or use a workflow with skeptic agents).
4. Never claim done until the Stop-hook verification passes.
5. Prefer small, focused commits. Describe subagent usage in commit messages when relevant.

## File Layout Conventions

```
AGENTS.md                 # this file
.grok/
  hooks/                  # Stop / other lifecycle hooks
  agents/                 # custom agent definitions (*.md)
  skills/                 # SKILL.md packages
  workflows/              # saved workflows (optional)
src/                      # application code
```

## Verification

Run `grok inspect` to confirm which rules, skills, hooks, and agents Grok Build loaded.

## Demo Success Criteria

- One parent session can plan a small site change.
- Parallel subagents implement independent pieces (e.g., header + hero + footer).
- Stop hook blocks completion until `npm run verify` passes.
- Final output is a clean, buildable site with clear agent traces.

Last updated: 2026-10-26
