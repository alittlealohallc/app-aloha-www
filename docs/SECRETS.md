# Secrets — apps-alittlealohallc-www

This file documents secret **names only**. No values live here or anywhere else in the repo.

## GitHub Actions secrets

Set at: repo Settings → Secrets and variables → Actions

| Secret | Purpose |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Deploy authentication (only needed if/when you wire up an automated deploy step — the current `validate.yml` workflow doesn't deploy) |
| `CLOUDFLARE_ACCOUNT_ID` | Account scoping for the token above |

## Cloudflare API token scope

When you create the token in the Cloudflare dashboard, scope it to:
- Account → Cloudflare Pages → Edit
- Scoped to this specific account, not "All accounts"

## Formspree

No secret or API key needed. The form ID in the endpoint URL (`xyegjpzq`, the shared default —
see `reference/forms.md` in the website-builder skill) is not sensitive and is already visible
in `public/index.html` and `public/main.js`.

## Local development

Copy `.env.local.template` to `.env.local` and fill in your own values. `.env.local` is
git-ignored — never commit it.
