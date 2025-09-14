#!/bin/bash
# Simple script to trigger CI without changing actual source code
# It appends a timestamped comment to ci-trigger.txt so workflows re-run.

set -e

TRIGGER_FILE="ci-trigger.txt"
DATE=$(date)

# Ensure file exists
if [ ! -f "$TRIGGER_FILE" ]; then
  echo "# CI trigger file" > "$TRIGGER_FILE"
fi

# Append timestamped trigger
echo "# trigger $DATE" >> "$TRIGGER_FILE"

git add "$TRIGGER_FILE"
git commit -m "chore(ci): trigger workflows ($(date +%Y-%m-%d_%H-%M-%S))"
git push origin main