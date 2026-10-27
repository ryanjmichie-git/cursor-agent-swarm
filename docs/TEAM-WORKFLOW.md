# Using this in your team's workflow

**Bottom line:** agents in this repo get better for everyone who clones it. A problem an
agent hits once becomes a one-line team lesson that a person approves. A problem that
comes back becomes an automatic check that the agent must pass before it can finish.

## Where each kind of knowledge lives

| Kind | Where | Who changes it | Who gets it |
|------|-------|----------------|-------------|
| Personal preference (your style, your tools) | Your Grok memory (`/remember ...`) or `~/.grok/rules/` | You | Only you |
| Team lesson | [.grok/rules/team-lessons.md](../.grok/rules/team-lessons.md), in git | A pull request a person approves | Everyone, on their next pull |
| Enforced rule | `bin/check-*.mjs`, run by `npm run verify` | A pull request | Everyone; an agent can't end its turn until it passes |

- Grok loads every file in `.grok/rules/` at the start of each session.
- Grok memory is off by default. Turn it on in your own `~/.grok/config.toml` with
  `[memory] enabled = true`. A repo can't turn it on for you, so personal notes stay personal.

## The loop

1. An agent hits a problem, or the gate (the check that runs when an agent tries to
   finish) blocks it.
2. The `reviewer` agent lists it under "Proposed lessons": one line, with a source you can open.
3. You say "make that a team lesson". The `propose-lesson` skill puts the line on its own
   `lesson/*` branch, runs `npm run verify`, and asks you before it opens a pull request.
4. A person reviews and merges the pull request. Everyone gets the lesson on their next pull.
5. If the problem comes back anyway, turn the lesson into a check. The lesson then says
   "Enforced by".

Agents can't slip a lesson in during feature work: `npm run lint` fails when
`.grok/rules/` changes on a branch not named `lesson/*`.

The five seed lessons come from a 2026-10-27 bake-off; each links to its evidence.

## Adopt it in your repo

1. Copy `.grok/` (agents, hooks, rules, skills) and `bin/` into your repo.
2. Set `typecheck`, `lint` and `verify` scripts in `package.json`; the hook runs them.
   Add `node bin/check-content.mjs && node bin/check-lessons.mjs` to `lint`, and set the
   folder list at the top of `bin/check-content.mjs` to your source folders.
3. Trust the folder in Grok once (`/hooks-trust`). Hooks don't run until you do.
4. Replace the lessons in `.grok/rules/team-lessons.md` with your own. Keep the header.
5. Add a CODEOWNERS entry for `/.grok/rules/` that names your team leads. Then turn on
   "Require review from Code Owners" in branch protection, so a named person approves
   every lesson.
