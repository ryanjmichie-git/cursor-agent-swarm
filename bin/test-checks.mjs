// Tests for bin/check-content.mjs and bin/check-lessons.mjs. Each case builds a
// small fixture folder (a git repo for the lesson checks) and points the check
// at it, so the real repo is never touched. Run: npm run test:checks
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { after, test } from "node:test";
import { fileURLToPath } from "node:url";

const binDir = dirname(fileURLToPath(import.meta.url));
const work = mkdtempSync(join(tmpdir(), "check-test-"));
after(() => rmSync(work, { recursive: true, force: true }));

let caseNumber = 0;
function fixture(files) {
  caseNumber += 1;
  const root = mkdtempSync(join(work, `case${caseNumber}-`));
  for (const [name, text] of Object.entries(files)) {
    mkdirSync(dirname(join(root, name)), { recursive: true });
    writeFileSync(join(root, name), text);
  }
  return root;
}

function check(script, root) {
  return spawnSync(process.execPath, [join(binDir, script), root], { encoding: "utf8" });
}

function git(root, ...args) {
  const result = spawnSync("git", args, { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
}

// A git repo on `branch` with the lessons file uncommitted (no commit needed).
function lessonsRepo(branch, lessons) {
  const root = fixture({ ".grok/rules/team-lessons.md": lessons });
  git(root, "init", "-q");
  git(root, "checkout", "-q", "-b", branch);
  return root;
}

const realComponent = `export default function Search() {
  return (
    <input
      type="search"
      placeholder="Search parts"
      className="rounded border border-slate-500 placeholder:text-slate-600"
    />
  );
}
`;

const goodLessons = `# Team lessons

Header text that is not a lesson.

- Stop any dev server you start before ending the turn. Source: sweep run, 2026-10-27.
`;

test("check-content catches a placeholder file", () => {
  const root = fixture({ "components/Spending.tsx": "PLACEHOLDER_FOR_SPENDING_CONTENT" });
  const r = check("check-content.mjs", root);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /components\/Spending\.tsx:1: placeholder marker/);
});

test("check-content catches an empty file", () => {
  const root = fixture({ "app/page.tsx": realComponent, "components/Empty.tsx": "\n  \n" });
  const r = check("check-content.mjs", root);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /components\/Empty\.tsx:1: no real content/);
  assert.doesNotMatch(r.stdout, /page\.tsx/);
});

test("check-content reports each elided-code marker with its line", () => {
  const root = fixture({
    "lib/data.ts": [
      "export const a = 1;",
      "// ...existing code",
      "// TODO: implement totals",
      "/* ... rest of the file */",
      'export const copy = "Lorem ipsum dolor";',
    ].join("\n"),
  });
  const r = check("check-content.mjs", root);
  assert.equal(r.status, 1);
  for (const line of [2, 3, 4, 5]) assert.match(r.stdout, new RegExp(`lib/data\\.ts:${line}: `));
  assert.doesNotMatch(r.stdout, /lib\/data\.ts:1: /);
});

test("check-content passes real code, including placeholder attributes", () => {
  const root = fixture({ "components/Search.tsx": realComponent, "app/page.tsx": realComponent });
  const r = check("check-content.mjs", root);
  assert.equal(r.status, 0, r.stdout);
  assert.match(r.stdout, /2 files/);
});

test("check-lessons catches a lesson with no source", () => {
  const root = lessonsRepo("lesson/x", goodLessons + "- Always run the build.\n");
  const r = check("check-lessons.mjs", root);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /team-lessons\.md:6: lesson has no "Source:"/);
});

test("check-lessons catches more than 40 lessons", () => {
  const many = Array.from({ length: 41 }, (_, i) => `- Rule ${i}. Source: test.\n`).join("");
  const r = check("check-lessons.mjs", lessonsRepo("lesson/x", many));
  assert.equal(r.status, 1);
  assert.match(r.stdout, /41 lessons; the cap is 40/);
});

test("check-lessons catches a lessons edit on a non-lesson branch", () => {
  const r = check("check-lessons.mjs", lessonsRepo("feature/x", goodLessons));
  assert.equal(r.status, 1);
  assert.match(r.stdout, /uncommitted changes on branch feature\/x/);
  assert.match(r.stdout, /team-lessons\.md/);
});

test("check-lessons allows a lessons edit on lesson/x", () => {
  const r = check("check-lessons.mjs", lessonsRepo("lesson/x", goodLessons));
  assert.equal(r.status, 0, r.stdout);
  assert.match(r.stdout, /1 lesson/);
});
