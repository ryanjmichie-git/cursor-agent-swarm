cursor-agent-swarm, 2026-10-27, branch main (in step with origin/main); approved plan in docs/plans/2026-10-27-team-lessons.md
---
Goal: Execute the approved plan: repeat problems become gate checks; team lessons live in git (`.grok/rules/team-lessons.md`); personal preferences stay in each user's Grok memory; add `docs/TEAM-WORKFLOW.md` for attendees.
Effort: medium, about 1 to 1.5 hours. Plan mode first: no; the plan is already approved, so work task by task on branch `feature/team-lessons`.
Done when: every "Done when" item in the plan is checked, including `npm run verify` exit 0 with the new `test:checks`, `grok inspect` listing team-lessons.md, and a local commit with the verify result in its body (not pushed).
Don't touch: ~/.grok (config, memory, rules) and ~/.claude; the behavior of bin/stop-verify.mjs and bin/start-grok.*; .grok/hooks/; the grok-bakeoff repos.
Read first: docs/plans/2026-10-27-team-lessons.md, then AGENTS.md, bin/test-stop-verify.mjs (test pattern), ~/.grok/docs/user-guide/12-project-rules.md and 13-memory.md
