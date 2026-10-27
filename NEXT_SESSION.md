cursor-agent-swarm, 2026-10-27, branch demo-ready at 3853c7e plus this note; PR #2 open into main
---
Goal: Present the Grok swarm demo to AI enthusiasts from a merged `main`, after one interactive dry run proves every step in docs/DEMO.md.
Effort: high. Plan mode first: no, the dry run comes first and fixes should be small.
Done when:
- The `demo-ready` PR is merged into `main`.
- One interactive run of docs/DEMO.md steps 1 to 8 on a `demo-run` branch: the hook log shows one `SubagentStop frontend quick pass` per new section, and step 6 shows `Stop main full block` then `Stop main full pass`. The reviewer returns a verdict.
- Every step that behaved differently is corrected in docs/DEMO.md, and `npm run verify` exits 0.
- The reset sequence in docs/DEMO.md leaves `git status` clean.
Don't touch: ~/.claude and ~/.grok config; the behavior of bin/stop-verify.mjs unless the dry run shows a bug (add a failing test first).
Read first: HANDOFF.md (Acceptance status), docs/DEMO.md, README.md (Troubleshooting)
