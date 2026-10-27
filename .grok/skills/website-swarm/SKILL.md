---
name: website-swarm
description: Orchestrates a small swarm of Grok Build agents to implement a website feature or page. Use when the user asks to build, extend, or polish the demo site with parallel agents.
when-to-use: build website, swarm, multi-agent, implement page, demo
---

# Website Swarm Skill

## When to use
A site change with two or more independent pieces (sections or components) that agents
can build at the same time.

## Steps
1. Plan (use Plan mode for anything non-trivial). List each slice with one owner and the
   exact files it may create, such as `components/HowItWorks.tsx`. No two slices share a file.
2. Spawn one `frontend` subagent per slice, in parallel. Give each one:
   - its file list and the section's purpose and copy;
   - the anchor `id` to use;
   - "match the container, link and focus styles in `components/Header.tsx`".
3. When all of them finish, you (the parent) wire the new components into `app/page.tsx`
   and add header links for any new anchors.
4. Spawn `reviewer` with the plan text and the list of changed files.
5. Finish the turn. The Stop hook runs `npm run verify`; fix anything it reports.
6. Summarize: what was built, which agent owned which files, and the verify result.

## Constraints
- Stay in the stack in AGENTS.md. New sections go in `components/`, one file each.
- Subagents never edit `app/page.tsx`, config files or `package.json`.
- Keep the human in the loop for structural choices.
