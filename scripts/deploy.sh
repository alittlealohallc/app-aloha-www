#!/usr/bin/env bash
# Deploy apps-alittlealohallc-www to Cloudflare Pages.
# Run this locally or from Claude Code — this chat environment cannot reach the
# Cloudflare API, so this script is never executed automatically as part of scaffolding.
set -euo pipefail

PROJECT_NAME="alittlealohallc-www"

echo "==> Deploying public/ to Cloudflare Pages project: ${PROJECT_NAME}"
npx wrangler pages deploy public --project-name="${PROJECT_NAME}"

echo "==> Deploy complete. Verify at https://${PROJECT_NAME}.pages.dev or your custom domain."
