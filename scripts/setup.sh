#!/usr/bin/env bash
# One-time local setup for apps-alittlealohallc-www.
set -euo pipefail

echo "==> Installing dependencies"
npm install

if [ ! -f .env.local ]; then
  echo "==> Creating .env.local from template"
  cp .env.local.template .env.local
  echo "    Fill in CF_ACCOUNT_ID and CF_API_TOKEN in .env.local before deploying."
else
  echo "==> .env.local already exists, leaving it alone"
fi

echo "==> Done. Run 'npm run dev' to preview locally, or 'npm run deploy' to publish."
