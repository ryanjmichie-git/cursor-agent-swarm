// Tests for bin/stop-verify.mjs. Fixture commands stand in for npm, so these
// run in about a second and never touch .next. Run: npm run test:hook
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { after, test } from "node:test";
import { fileURLToPath } from "node:url";

const binDir = dirname(fileURLToPath(import.meta.url));
const hook = join(binDir, "stop-verify.mjs");
const work = mkdtempSync(join(tmpdir(), "stop-verify-test-"));
after(() => rmSync(work, { recursive: true, force: true }));

// fixture.cjs <marker> <exitCode>: records that it ran; on failure prints a
// tsc error, a Windows path with quotes, and a timing that changes every run.
const fixture = join(work, "fixture.cjs");
writeFileSync(
  fixture,
  `const fs = require("fs");
const [marker, code] = process.argv.slice(2);
fs.writeFileSync(require("path").join(__dirname, "ran-" + marker), "");
if (code !== "0") {
  console.log("components/Hero.tsx(2,9): error TS2322: Type 'string' is not assignable to type 'number'.");
  console.log('npm error path C:\\\\Users\\\\demo\\\\app "quoted"');
  console.log("Compiled in " + (Math.random() * 5).toFixed(1) + "s");
}
process.exit(Number(code));
`,
);

let caseNumber = 0;
function runHook(input, { full = 0, quick = 0 } = {}) {
  caseNumber += 1;
  const dir = mkdtempSync(join(work, `case${caseNumber}-`));
  return runHookIn(dir, input, { full, quick });
}

function runHookIn(dir, input, { full = 0, quick = 0 } = {}) {
  for (const name of ["ran-full", "ran-quick"]) rmSync(join(work, name), { force: true });
  const result = spawnSync(process.execPath, [hook], {
    input: typeof input === "string" ? input : JSON.stringify(input),
    encoding: "utf8",
    env: {
      ...process.env,
      CLAUDE_PROJECT_DIR: resolve(binDir, ".."),
      STOP_VERIFY_CMD_FULL: `node "${fixture}" full ${full}`,
      STOP_VERIFY_CMD_QUICK: `node "${fixture}" quick ${quick}`,
      STOP_VERIFY_STATE_DIR: join(dir, "state"),
      STOP_VERIFY_LOG: join(dir, "stop-verify.log"),
    },
  });
  const log = existsSync(join(dir, "stop-verify.log"))
    ? readFileSync(join(dir, "stop-verify.log"), "utf8")
    : "";
  return {
    ...result,
    log,
    ranFull: existsSync(join(work, "ran-full")),
    ranQuick: existsSync(join(work, "ran-quick")),
  };
}

const stop = { hook_event_name: "Stop", reason: "end_turn", sessionId: "s1" };

test("a failure prints valid block JSON that keeps the error, path and quotes", () => {
  const r = runHook(stop, { full: 1 });
  assert.equal(r.status, 0);
  const reply = JSON.parse(r.stdout);
  assert.equal(reply.decision, "block");
  assert.match(reply.reason, /TS2322/);
  assert.match(reply.reason, /C:\\Users\\demo\\app "quoted"/);
  assert.match(r.log, / Stop main full block /);
});

test("a pass prints nothing and logs the pass", () => {
  const r = runHook(stop);
  assert.equal(r.status, 0);
  assert.equal(r.stdout, "");
  assert.ok(r.ranFull);
  assert.match(r.log, / Stop main full pass /);
});

test("the session-end Stop is skipped without running verify", () => {
  const r = runHook({ ...stop, reason: "shutdown" }, { full: 1 });
  assert.equal(r.stdout, "");
  assert.equal(r.ranFull, false);
  assert.match(r.log, /skip\(shutdown\)/);
});

test("a subagent runs the quick check, not the full build", () => {
  const r = runHook({ hook_event_name: "SubagentStop", subagentType: "frontend" });
  assert.equal(r.stdout, "");
  assert.ok(r.ranQuick);
  assert.equal(r.ranFull, false);
  assert.match(r.log, / SubagentStop frontend quick pass /);
});

test("empty input is treated as a main-agent Stop", () => {
  const r = runHook("");
  assert.equal(r.stdout, "");
  assert.ok(r.ranFull);
});

test("the third identical failure in a row lets the turn end", () => {
  caseNumber += 1;
  const dir = mkdtempSync(join(work, `case${caseNumber}-`));
  const first = runHookIn(dir, { ...stop, stop_hook_active: false }, { full: 1 });
  const second = runHookIn(dir, { ...stop, stop_hook_active: true }, { full: 1 });
  const third = runHookIn(dir, { ...stop, stop_hook_active: true }, { full: 1 });
  assert.equal(JSON.parse(first.stdout).decision, "block");
  assert.equal(JSON.parse(second.stdout).decision, "block");
  const reply = JSON.parse(third.stdout);
  assert.equal(reply.decision, undefined);
  assert.match(reply.systemMessage, /3 identical attempts/);
  assert.match(third.log, / gave-up /);
});
