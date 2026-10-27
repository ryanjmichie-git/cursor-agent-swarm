---
name: propose-lesson
description: Drafts a one-line team lesson for .grok/rules/team-lessons.md on its own lesson/* branch, for a person to approve by pull request. Use when the user says "make that a team lesson" or "propose a lesson", or a reviewer report lists proposed lessons.
when-to-use: team lesson, propose a lesson, make that a lesson, reviewer proposed lessons
---

# Propose Lesson Skill

`.grok/rules/team-lessons.md` loads into every Grok session for everyone who clones this
repo. A person approves each lesson through a pull request. You draft it; you never push,
open a pull request or merge without the user's yes.

## When to use
- The user says "make that a team lesson", "propose a lesson", or similar.
- A `reviewer` report lists "Proposed lessons".

Personal preferences (one person's style or tools) don't belong here. Point the user to
their own Grok memory (`/remember ...`) or `~/.grok/rules/` instead.

## Steps
1. Draft one line in the file's format:
   `- <rule in the imperative>. Source: <where it was seen, date, link>.`
   The source must be something a teammate can open: a commit, a pull request, a file and
   line, or a hook log line. No source, no lesson.
2. Read `.grok/rules/team-lessons.md`. If the lesson repeats or conflicts with one already
   there, show both lines and stop. If the problem has already recurred, say a check in
   `bin/check-*.mjs` fits better (a lesson that recurs becomes a check) and ask which the
   user wants. If the file already holds 40 lessons, propose a merge first.
3. Run `git status`. If there are uncommitted changes, ask the user to commit or stash them
   first; don't move their work between branches.
4. Create the branch from the current `main`: `git switch -c lesson/<short-slug> main`.
5. Add the line at the end of the lesson list. Change nothing else in `.grok/rules/`.
6. Run `npm run verify` and fix anything it reports.
7. Commit with the message `Add team lesson: <rule>`, and the source in the body.
8. Show the user the line and the verify result. **Ask before pushing or opening a pull
   request.** With a yes: `git push -u origin lesson/<short-slug>`, then open a pull
   request titled `Team lesson: <rule>`.
9. Switch back to the branch the user was on.

## Constraints
- One lesson per branch and pull request, so each gets its own review.
- `npm run lint` fails when `.grok/rules/` changes on a branch not named `lesson/*`.
  Never work around that check.
