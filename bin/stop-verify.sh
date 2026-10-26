#!/usr/bin/env bash
# Simple Stop / SubagentStop gate for the website demo.
# Exits 0 and prints nothing → allow stop.
# Prints {"decision":"block","reason":"..."} → keep the agent working.

set -euo pipefail

# Optional: only gate real end-of-turn (uncomment if needed)
# reason=$(echo "$INPUT" | jq -r '.reason // empty' 2>/dev/null || true)
# if [[ "$reason" != "end_turn" && -n "$reason" ]]; then
#   exit 0
# fi

if ! npm run verify >/tmp/grok-verify.log 2>&1; then
  # Feed a short reason back to the model
  reason=$(tail -n 20 /tmp/grok-verify.log | sed 's/"/\\"/g' | tr '\n' ' ' | cut -c1-400)
  echo "{\"decision\":\"block\",\"reason\":\"Verification failed. Fix the errors and try again. Last output: ${reason}\"}"
  exit 0
fi

# Success — allow the stop
exit 0
