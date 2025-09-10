#!/usr/bin/env bash
set -e

echo "🔧 Installing GitHub CLI + jq for workflows..."

# Install jq
sudo apt-get update -y
sudo apt-get install -y jq

# Install GitHub CLI
curl -sSL https://github.com/cli/cli/releases/download/v2.56.0/gh_2.56.0_linux_amd64.tar.gz | tar -xz
sudo mv gh_2.56.0_linux_amd64/bin/gh /usr/local/bin/gh

# Verify
gh --version
jq --version