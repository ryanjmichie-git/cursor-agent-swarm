cursor-agent-swarm, 2026-10-27, branch main; last pushed commit 2d96625 (PR #4 merge), plus this handoff commit (local, not pushed)
---
Goal: Confirm the live demo in docs/DEMO.md still runs as written on merged main, now that lint runs the content and lesson checks and Grok loads team-lessons.md, so Ryan can present it without surprises.
Effort: high. Plan mode first: no; this is a rehearsal on a throwaway demo-run branch, with doc fixes only if a measured result differs.
Done when:
- DEMO.md steps 1 to 8 run through bin\start-grok.cmd on a demo-run branch cut from main, and the hook log shows a `SubagentStop frontend quick pass` per subagent and a final `Stop main full pass`.
- The agent-written sections pass check-content with no false positives (verify output shows the `check-content:` and `check-lessons:` pass lines).
- The reset in README leaves `git status` clean on main.
- DEMO.md or README changes only where a measured time or behavior falls outside what they state; HANDOFF.md records the times and log lines.
Don't touch: ~/.grok (config, memory, rules) and ~/.claude; bin/stop-verify.mjs, bin/start-grok.*, .grok/hooks/; .grok/rules/team-lessons.md except through the propose-lesson flow; the grok-bakeoff repos. Ask Ryan before the paid headless lesson check or any push.
Read first: HANDOFF.md (What's next; Acceptance status, the dry-run bullets), docs/DEMO.md, docs/TEAM-WORKFLOW.md
