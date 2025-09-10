#!/bin/bash

# Usage:
#   ./scripts/download-all-logs.sh
#
# Make sure you are authenticated first:
#   gh auth login
#
# Replace OWNER/REPO with your repo name

REPO="udigitrentals/websitos"
OUTPUT_DIR="all-logs"

mkdir -p $OUTPUT_DIR

# Get run IDs (latest 20 runs by default; remove --limit to get all)
RUN_IDS=$(gh run list --repo $REPO --limit 20 --json databaseId -q '.[].databaseId')

for run_id in $RUN_IDS; do
  echo "⬇️ Downloading logs for run $run_id..."
  gh run download $run_id --repo $REPO --dir $OUTPUT_DIR/$run_id
done

echo "✅ All logs downloaded to $OUTPUT_DIR/"