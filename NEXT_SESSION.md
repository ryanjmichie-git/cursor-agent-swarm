cursor-agent-swarm, 2026-10-27, branch demo-ready at the dry-run docs commit (local, not pushed); PR #2 open into main
---
Goal: Present the Grok swarm demo from a merged `main`. The interactive dry run is done and docs/DEMO.md is corrected from it.
Effort: low. Plan mode first: no.
Done when:
- Ryan has approved the push, and the dry-run commit is on `origin/demo-ready` (PR #2 shows it).
- PR #2 is merged into `main` with a merge commit, and `git switch main; git pull` fast-forwards.
- `npm run verify` exits 0 on the merged `main`, and the DEMO.md reset leaves `git status` clean there.
Don't touch: ~/.claude and ~/.grok config; the behavior of bin/stop-verify.mjs.
Read first: HANDOFF.md (Acceptance status, What's next), docs/DEMO.md
