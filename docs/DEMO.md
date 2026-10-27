# Demo run-of-show

The full run hasn't been timed end to end. Each main-agent turn ends with about a minute
of checks, and each subagent with about 15 s. You need two terminals in the repo folder
and a browser.
Commands are shown for PowerShell, with the macOS, Linux or Git Bash version after "or".

**What was rehearsed.** Steps 6 and 7 were checked with headless Grok 1.0.70 on Windows
(`grok --prompt-file ...`) on 2026-10-27, with the hook log shown below. Steps 3 to 5
follow the flow that built the current header, hero and footer, but the three new
sections themselves have not been rehearsed. Do one dry run before presenting.

## Before the audience arrives

1. **Terminal 1.** Start clean and green:
   ```
   git switch main
   git pull
   npm ci
   npm run verify
   ```
   `verify` ends with the build's route table in about a minute.
2. **Terminal 1.** Work on a throwaway branch: `git switch -c demo-run`
3. **Terminal 2.** Start an empty hook log and watch it:
   ```
   New-Item -ItemType File -Force .grok\logs\stop-verify.log
   Get-Content .grok\logs\stop-verify.log -Wait
   ```
   or `mkdir -p .grok/logs && : > .grok/logs/stop-verify.log && tail -f .grok/logs/stop-verify.log`
4. **Terminal 1.** Start Grok with only this repo's setup: `bin\start-grok.cmd`
   (or `bin/start-grok.sh`). If this folder has never been trusted, type `/hooks-trust`
   and restart the launcher.

## Live

1. **Grok.** Type `/hooks-list`.
   Expect a Stop hook and a SubagentStop hook (matcher `frontend`), both running `node`.

2. **Say:** "Every time an agent tries to finish, that hook type-checks, lints and builds
   the site. If something fails, the agent gets the error back and has to keep going."

3. **Grok.** Type this exactly:
   ```
   /plan Use the website-swarm skill. Plan three new sections for the page, one frontend agent each, built in parallel: (1) "How it works": how the Stop hook checks every turn, in components/HowItWorks.tsx with id how-it-works; (2) "The agents": the frontend and reviewer roles, in components/Agents.tsx with id agents; (3) "Try it": the clone and run steps from README.md, in components/TryIt.tsx with id try-it. Take every fact from AGENTS.md and README.md.
   ```
   Expect a plan that gives each agent exactly one file and leaves `app/page.tsx` to the
   parent.

4. **Grok.** Press `a` to approve the plan. If the cursor is in the prompt box, press `Esc`
   first.
   Expect three `frontend` subagents working at the same time. Then the parent wires the
   sections into `app/page.tsx`, adds header links, and finishes its turn.
   **Terminal 2** shows one `SubagentStop frontend quick pass` line per subagent, then
   `Stop main full pass` (each subagent check takes about 15 s; the full check about a
   minute).

5. **Say:** "Each agent owned one file, so no two agents could collide. Only the parent
   touches the page itself."

6. **Grok.** Show the gate catching a mistake. Type this exactly:
   ```
   Add this line as the first line inside the Hero function in components/Hero.tsx, then end your turn: const ready: number = "no";
   ```
   Expect Grok to add the line and try to stop. **Terminal 2** shows
   `Stop main full block`. Grok reports the hook caught a type error (TS2322), removes the
   line, and finishes. Terminal 2 then shows `Stop main full pass`.
   Rehearsed log: `Stop main full block 4.2s`, then `Stop main full pass 44.1s`.

7. **Grok.** Type:
   ```
   Run the reviewer agent on this change. Give it the plan and the list of changed files.
   ```
   Expect `Pass` or `needs-work`, with findings by file and line.

8. **Terminal 2.** Press `Ctrl+C` to stop watching the log, then run `npm run dev`.
   **Browser:** open http://localhost:3000. Use the header links to jump to each new
   section.

## Afterward

1. **Terminal 2.** Press `Ctrl+C` to stop the dev server.
2. **Terminal 1.** Quit Grok, then reset:
   ```
   git switch --discard-changes main
   git branch -D demo-run
   git clean -fd components
   ```

If anything goes wrong, see Troubleshooting in [README.md](../README.md).
