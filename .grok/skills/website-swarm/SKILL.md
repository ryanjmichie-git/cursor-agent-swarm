---
name: website-swarm
description: Orchestrates a small swarm of Grok Build agents to implement a website feature or page. Use when the user asks to build, extend, or polish the demo site with parallel agents.
when-to-use: build website, swarm, multi-agent, implement page, demo
---

# Website Swarm Skill

## When to use
User wants a website change that benefits from parallel work (multiple sections, components, or review).

## Steps
1. Confirm or create a short plan (use plan subagent or Plan mode if non-trivial).
2. Identify independent slices (e.g., header, hero, features, footer, or page + components).
3. Spawn parallel subagents:
   - One or more `frontend` agents for UI slices
   - Optionally an `explore` agent for existing patterns
4. After implementation, spawn a `reviewer` (or trigger a workflow) to check against the plan and quality bar.
5. Rely on the Stop hook (`bin/stop-verify.sh`) to block completion until verification passes.
6. Summarize what was built, which agents ran, and any open items.

## Constraints
- Stay within the stack defined in AGENTS.md.
- Prefer worktrees if agents will edit overlapping files.
- Keep the human in the loop for large architectural choices.
