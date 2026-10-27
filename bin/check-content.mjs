#!/usr/bin/env node
// Content check for the gate. Fails when a source file holds a placeholder or
// elided code instead of real code, or has no real content at all. It runs
// inside `npm run lint`, so both the main agent's full verify and each
// subagent's quick check run it. See .grok/rules/team-lessons.md for the lesson
// it enforces.
//
// Usage: node bin/check-content.mjs [root]   (root defaults to this repo)
// Prints `file:line: reason` for each problem and exits 1; exits 0 when clean.

import { readdirSync, readFileSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SOURCE_DIRS = ["app", "components", "lib"];
const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".css"]);
const MIN_CONTENT_CHARS = 20; // non-space characters; fewer means no real content

// Text that agents and chat tools leave where code should be. PLACEHOLDER is
// matched in capitals only, so the HTML placeholder attribute and Tailwind's
// placeholder: variant still pass.
const MARKERS = [
  [/\bPLACEHOLDER/, "placeholder marker"],
  [/lorem ipsum/i, "filler text"],
  [/TODO:?\s*implement/i, "unimplemented TODO"],
  [/(\.\.\.|…)\s*rest of (the )?(code|file)/i, "elided code"],
  [/(\.\.\.|…)\s*existing code/i, "elided code"],
];

const root = resolve(process.argv[2] || join(dirname(fileURLToPath(import.meta.url)), ".."));

function* sourceFiles(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return; // a missing folder (for example lib/) has nothing to check
  }
  for (const entry of entries) {
    if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* sourceFiles(path);
    else if (SOURCE_EXTENSIONS.has(extname(entry.name))) yield path;
  }
}

const problems = [];
let files = 0;
for (const dir of SOURCE_DIRS) {
  for (const file of sourceFiles(join(root, dir))) {
    files += 1;
    const name = relative(root, file).replaceAll("\\", "/");
    const text = readFileSync(file, "utf8");
    const chars = text.replace(/\s/g, "").length;
    if (chars < MIN_CONTENT_CHARS) {
      problems.push(`${name}:1: no real content (${chars} non-space characters)`);
    }
    text.split(/\r?\n/).forEach((line, index) => {
      const marker = MARKERS.find(([pattern]) => pattern.test(line));
      if (marker) problems.push(`${name}:${index + 1}: ${marker[1]}: ${line.trim().slice(0, 80)}`);
    });
  }
}

if (problems.length) {
  console.log(problems.join("\n"));
  console.log("check-content: write the real code in these places, then finish again.");
  process.exitCode = 1;
} else {
  console.log(`check-content: ${files} files, no placeholders or empty files.`);
}
