# A Little Aloha LLC — Marketing Site

Tier 1 static single-page marketing site for A Little Aloha LLC (DBA: Pro Services With A Little
Aloha). Plain HTML5/CSS3, minimal vanilla JS, no framework, no build step. Built with the
`alittlealoha-website-builder` skill.

- **Repo name:** `apps-alittlealohallc-www`
- **Cloudflare Pages project:** `alittlealohallc-www`
- **Domain:** `alittlealoha.pro` (canonical), `www.alittlealoha.pro` redirects to apex
- **Tier:** 1 — static HTML/CSS/minimal JS

## What's on the page

Single page (`public/index.html`), sections: Hero, Services (four core lines), About, Contact.

## Local development

```bash
./scripts/setup.sh      # npm install + create .env.local from template
npm run dev              # wrangler pages dev — local preview
```

## Deployment

**This chat cannot run `wrangler deploy` or reach the Cloudflare API.** To go live:

1. Create the GitHub repo (not yet created — run this yourself or hand to Claude Code):
   ```bash
   gh repo create alittlealohallc/apps-alittlealohallc-www --private --source=. --push
   ```
2. Set GitHub Actions secrets (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`) — see
   `docs/SECRETS.md` for scope.
3. Deploy manually or via Claude Code:
   ```bash
   ./scripts/deploy.sh
   ```
4. Attach the custom domain (`alittlealoha.pro` / `www.alittlealoha.pro`) in the Cloudflare Pages
   dashboard once the project exists.

The GitHub Actions workflow (`.github/workflows/validate.yml`) only **validates** (HTML lint,
accessibility, required headers/meta files) — it does not deploy. That's intentional per the
skill's scaffolding-only boundary.

## Contact form

Uses Formspree (shared default endpoint, form ID `xyegjpzq`) per `reference/forms.md` in the
website-builder skill — Kent confirmed reusing the default rather than creating a dedicated form
for this site. Fields: name, email, message, optional file attachment. Inline success/error
messaging via the `@formspree/ajax` library (loaded from unpkg, no bundler). Fallback contact
email if the form is ever down: **kent@alittlealoha.pro**.

Formspree is a third-party data processor — form submissions leave Cloudflare's infrastructure.
Worth a line in a privacy policy if/when one gets added to the site.

## Standards Verified On

**2026-08-14**, via web search during scaffolding:

- **WCAG:** 2.2 is the current W3C recommendation (published Oct 2023, ISO/IEC 40500:2025).
  2.1 AA remains the most common legal reference point. This build targets **WCAG 2.2 AA**.
- **Core Web Vitals:** LCP < 2.5s, INP < 200ms, CLS < 0.1 (good thresholds, 75th percentile).
- **Wrangler:** pinned to `^4.120.0` (latest on npm as of verification date).

## Assets

- Logo source: Kent-supplied SVG (`pro-with-a-little-aloha-clear-shadow.svg`, containing an
  embedded raster). Cropped to bounding box and exported as `public/assets/img/logo.png`, plus a
  full favicon set (`public/assets/favicon/`) and an Open Graph share image
  (`public/assets/img/og-image.png`), all generated from that source file.
- Colors and type: pulled from `alittlealoha-business-context/references/design-defaults.md`
  (client-supplied brand, not the website-builder's generic vibe-keyword defaults) — green
  `#008000`, gold `#F4B861`, purple `#C96AFF` (thin rules only), warm off-white background,
  Chakra Petch (body) + Charter/Georgia (headings) + Sarina (single script accent) via
  fonts.bunny.net.

## Known assumption to confirm

`_redirects` sends `www.alittlealoha.pro` → `alittlealoha.pro` (apex canonical). Flip this in
`public/_redirects` if you'd rather `www` be canonical — this wasn't specified during intake and
was picked as the more common convention.

## Not included in this scaffold

- No CMS/backend — content edits are direct HTML edits.
- No blog/multi-page routing — this is intentionally a single page per the SPA request.
- No analytics — add one later if wanted (note it in `_headers` CSP if it needs an external
  script origin).
