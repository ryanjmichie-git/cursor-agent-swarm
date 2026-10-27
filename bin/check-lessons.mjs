#!/usr/bin/env node
// Lessons check for the gate, run inside `npm run lint`. Fails when:
// - a lesson in .grok/rules/team-lessons.md has no "Source:";
// - the file holds more than 40 lessons;
// - .grok/rules/ has uncommitted changes and the branch isn't lesson/*.
//   Team lessons change only through the propose-lesson skill and a pull
//   request, so an agent can't edit them in the middle of feature work.
//
// Usage: node bin/check-lessons.mjs [root]   (root defaults to this repo)

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_LESSONS = 40;
const RULES_DIR = ".grok/rules";
const LESSONS_FILE = `${RULES_DIR}/team-lessons.md`;

const root = resolve(process.argv[2] || join(dirname(fileURLToPath(import.meta.url)), ".."));
const problems = [];

// Every bullet line is a lesson; the header above them is plain text.
let lessons = 0;
const lessonsPath = join(root, LESSONS_FILE);
if (existsSync(lessonsPath)) {
  readFileSync(lessonsPath, "utf8")
    .split(/\r?\n/)
    .forEach((line, index) => {
      if (!/^\s*[-*] /.test(line)) return;
      lessons += 1;
      if (!/Source:\s*\S/.test(line)) {
        problems.push(`${LESSONS_FILE}:${index + 1}: lesson has no "Source:"`);
      }
    });
}
if (lessons > MAX_LESSONS) {
  problems.push(
    `${LESSONS_FILE}: ${lessons} lessons; the cap is ${MAX_LESSONS}. ` +
      "Merge lessons, or turn ones that recur into checks.",
  );
}

// Returns git's output, or null when git fails (for example, not a repo).
function git(...args) {
  const result = spawnSync("git", args, { cwd: root, encoding: "utf8" });
  return result.status === 0 ? result.stdout.trimEnd() : null;
}

const changes = git("status", "--porcelain", "--untracked-files=all", "--", RULES_DIR);
if (changes) {
  const branch = git("branch", "--show-current") || "(detached HEAD)";
  if (!branch.startsWith("lesson/")) {
    problems.push(
      `${RULES_DIR}/ has uncommitted changes on branch ${branch}:\n${changes}\n` +
        "Team lessons change only on a lesson/* branch, through the propose-lesson skill. " +
        'Undo this edit, and list the lesson under "Proposed lessons" in your report instead.',
    );
  }
}

if (problems.length) {
  console.log(problems.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`check-lessons: ${lessons} lesson${lessons === 1 ? "" : "s"}, each with a source.`);
}
