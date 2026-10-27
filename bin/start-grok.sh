#!/usr/bin/env bash
# Start Grok Build for the demo with this repo's config only (macOS, Linux,
# Git Bash). Turns off Grok's Claude Code and Cursor compatibility and Grok's
# memory for this process, so personal ~/.claude and ~/.cursor setup and notes
# from earlier sessions don't load.
# Usage: bin/start-grok.sh [grok arguments]
set -euo pipefail

for vendor in CLAUDE CURSOR; do
  for surface in HOOKS SKILLS AGENTS RULES MCPS; do
    export "GROK_${vendor}_${surface}_ENABLED=false"
  done
done
export GROK_MEMORY=0

command -v grok >/dev/null 2>&1 || export PATH="$HOME/.grok/bin:$PATH"

cd "$(dirname "$0")/.."
exec grok "$@"
