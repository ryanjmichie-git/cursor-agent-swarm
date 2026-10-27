cursor-agent-swarm, 2026-10-27, branch post-dry-run-fixes (2 local commits on top of origin/main 3febb8e)
---
Goal: Get the PostCSS override and the `/quit` doc fix into `main`, then keep `main` demo-ready.
Effort: low. Plan mode first: no.
Done when:
- Ryan has approved the push, and `post-dry-run-fixes` is merged into `main` (a PR with a merge commit, or a fast-forward).
- On the merged `main`, DEMO.md setup step 1 passes as written and `npm audit` reports 0 vulnerabilities.
- The DEMO.md reset leaves `git status` clean.
Don't touch: ~/.claude and ~/.grok config; the behavior of bin/stop-verify.mjs.
Read first: HANDOFF.md (Acceptance status, What's next), docs/DEMO.md
