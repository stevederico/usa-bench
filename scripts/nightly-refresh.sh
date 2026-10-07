#!/bin/zsh
# Nightly USA-Bench refresh. LaunchAgent: com.stevederico.usabench-nightly
set -euo pipefail

export HOME="${HOME:-/Users/sd}"
export PATH="/Users/sd/.grok/bin:/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin"

cd /Users/sd/Projects/usa-bench
echo "===== $(date) nightly start ====="

git pull --ff-only origin master

grok \
  --cwd /Users/sd/Projects/usa-bench \
  --prompt-file /Users/sd/Projects/usa-bench/scripts/nightly-prompt.md \
  --yolo \
  --output-format plain \
  --no-auto-update

echo "===== $(date) nightly end ====="
