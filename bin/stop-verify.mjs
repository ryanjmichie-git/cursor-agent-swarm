#!/usr/bin/env node
// Stop / SubagentStop gate for the website demo. Grok runs it with no shell
// (see .grok/hooks/stop-verify.json), so it behaves the same on every OS.
//
// Allow: exit 0 and print nothing.
// Block: print {"decision":"block","reason":"..."} so the agent keeps working.
//
// The main agent runs the full `npm run verify`. Subagents run typecheck + lint
// only, so parallel agents never run `next build` into the same .next folder.

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const GIVE_UP_AFTER = 3; // identical failures in a row before the turn may end red
const REASON_CHARS = 3000;
const COMMAND_TIMEOUT_MS = 540_000; // under Grok's 600 s default for Stop hooks

const root =
  process.env.CLAUDE_PROJECT_DIR ||
  resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Test-only overrides; Grok never sets these.
const fullCommand = process.env.STOP_VERIFY_CMD_FULL || "npm run verify";
const quickCommand =
  process.env.STOP_VERIFY_CMD_QUICK ||
  "npm run typecheck -- --incremental false && npm run lint";
const stateDir =
  process.env.STOP_VERIFY_STATE_DIR || join(tmpdir(), "grok-swarm-stop-verify");
const logFile =
  process.env.STOP_VERIFY_LOG || join(root, ".grok", "logs", "stop-verify.log");

function readPayload() {
  if (process.stdin.isTTY) return {};
  try {
    const text = readFileSync(0, "utf8").trim();
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}

function log(event, agent, mode, result, seconds) {
  try {
    mkdirSync(dirname(logFile), { recursive: true });
    const line = [new Date().toISOString(), event, agent, mode, result];
    if (seconds !== undefined) line.push(`${seconds.toFixed(1)}s`);
    appendFileSync(logFile, line.join(" ") + "\n");
  } catch {
    // Logging is a convenience; never let it change the decision.
  }
}

function run(command) {
  const started = Date.now();
  const result = spawnSync(`${command} 2>&1`, {
    cwd: root,
    shell: true,
    encoding: "utf8",
    timeout: COMMAND_TIMEOUT_MS,
    maxBuffer: 64 * 1024 * 1024,
  });
  const output = `${result.stdout || ""}${result.stderr || ""}`
    .replace(/\x1b\[[0-9;?]*[A-Za-z]/g, "")
    .replace(/\r\n/g, "\n");
  const timedOut = result.error?.code === "ETIMEDOUT";
  return {
    ok: result.status === 0 && !result.error,
    status: timedOut ? "timeout" : result.status,
    output,
    seconds: (Date.now() - started) / 1000,
  };
}

// Counts identical failures per session and agent, so an agent that cannot act
// on the feedback (for example, one told not to edit) stops looping early.
function repeatCount(key, failure, continuing) {
  const file = join(stateDir, createHash("sha1").update(key).digest("hex").slice(0, 16) + ".json");
  // Timings such as "Compiled in 2.3s" change between runs; ignore them.
  const hash = createHash("sha1")
    .update(failure.replace(/\b\d+(\.\d+)?\s?m?s\b/g, "#"))
    .digest("hex");
  let previous = {};
  try {
    previous = JSON.parse(readFileSync(file, "utf8"));
  } catch {
    previous = {};
  }
  const count = continuing && previous.hash === hash ? previous.count + 1 : 1;
  mkdirSync(stateDir, { recursive: true });
  writeFileSync(file, JSON.stringify(failure ? { hash, count } : {}));
  return count;
}

function main() {
  const payload = readPayload();
  const agentType =
    payload.subagentType || payload.subagent_type || payload.agent_type || "";
  const event =
    payload.hook_event_name || (agentType ? "SubagentStop" : "Stop");
  const isSubagent = Boolean(agentType) || /subagent/i.test(event);
  const agent = agentType || "main";
  const mode = isSubagent ? "quick" : "full";

  // Grok also fires Stop at session end (reason "channel_closed" or "shutdown")
  // and kills it after 1.5 s. Only gate genuine turn ends.
  if (payload.reason && payload.reason !== "end_turn") {
    log(event, agent, mode, `skip(${payload.reason})`);
    return 0;
  }

  const command = isSubagent ? quickCommand : fullCommand;
  const result = run(command);
  const key = `${root}|${payload.sessionId || payload.session_id || ""}|${agent}`;
  const continuing = Boolean(payload.stopHookActive ?? payload.stop_hook_active);

  if (result.ok) {
    repeatCount(key, "", false);
    log(event, agent, mode, "pass", result.seconds);
    return 0;
  }

  const tail =
    result.output.length > REASON_CHARS
      ? "...\n" + result.output.slice(-REASON_CHARS)
      : result.output;
  const count = repeatCount(key, `${mode}\n${result.output}`, continuing);

  if (count >= GIVE_UP_AFTER) {
    log(event, agent, mode, "gave-up", result.seconds);
    process.stdout.write(
      JSON.stringify({
        systemMessage: `\`${command}\` still fails after ${count} identical attempts. Ending the turn with the tree red.`,
      }),
    );
    return 0;
  }

  log(event, agent, mode, "block", result.seconds);
  process.stdout.write(
    JSON.stringify({
      decision: "block",
      reason:
        `\`${command}\` failed (exit ${result.status}). ` +
        "Fix the errors below, then finish your turn again.\n" +
        tail.trim(),
    }),
  );
  return 0;
}

try {
  process.exitCode = main();
} catch (error) {
  // Exit 1 so Grok shows "hook failed" instead of silently allowing the stop.
  process.stderr.write(`stop-verify.mjs error: ${error?.stack || error}\n`);
  process.exitCode = 1;
}
