#!/usr/bin/env bash
# Kept for anyone who still calls this path. The gate lives in stop-verify.mjs,
# which Grok runs directly with node (see .grok/hooks/stop-verify.json).
exec node "$(dirname "$0")/stop-verify.mjs"
