#!/bin/bash
# bulk-rebase.sh
# Rebases all local + remote branches onto main and force pushes them
# ⚠️ WARNING: This rewrites history of all branches. Everyone must re-sync.

set -euo pipefail

# Ensure we’re on latest clean main
git checkout main
git pull origin main

# Get all branches except main
branches=$(git for-each-ref --format='%(refname:short)' refs/heads/ | grep -v '^main$')

for branch in $branches; do
  echo "➡️ Rebasing $branch onto main..."
  git checkout "$branch"

  # Rebase onto latest clean main
  if git rebase main; then
    echo "✅ Rebase successful for $branch"
    git push origin "$branch" --force
  else
    echo "❌ Rebase failed for $branch, skipping..."
    git rebase --abort || true
  fi
done

# Return to main at end
git checkout main

echo "🎉 Bulk rebase complete. All branches now based on clean main."