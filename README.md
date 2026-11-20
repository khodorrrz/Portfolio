# Khodor El Hajj Moussa — portfolio

Static HTML, CSS, and JavaScript. No build step.

## Run locally

```powershell
python -m http.server 8080 --bind 127.0.0.1
```

Open <http://localhost:8080/index.html>.

## Deploy

Deploy the tracked files only:

- `*.html`, `*.css`, `*.js`
- `assets/`, `vendor/`
- `cv.pdf`
- `robots.txt`, `sitemap.xml`, `404.html`
- `DESIGN.md`, `PRODUCT.md`, `README.md`, `tests/` are excluded by `.vercelignore`.

Do **not** publish `argus-reports/`, `.serena/`, `.playwright-mcp/`, or `.git/`. They are local tooling and audit artifacts. Unused source recordings and the older audit report were moved to `../newPortfolio-archive`, outside this repository.

### Vercel

This site is static and has no build step. The included `vercel.json` sets:

- Framework Preset: Other (`framework: null`)
- Build Command: empty
- Install Command: empty
- Output Directory: `.` (repository root)
- Security headers and one-day asset caching

In the Vercel project, keep the same project and domain. On the first deployment after replacing the old Vite app, confirm these Build & Development Settings:

- Framework Preset: **Other**
- Build Command: override enabled, field empty
- Output Directory: `.` (or override to `.`)
- Root Directory: repository root

The old `Portfolio` repo was a Vite/React app. Replace it on a branch first, use the Vercel Preview deployment, then merge. Do not delete the Vercel project — the public domain and every canonical/OG/CV link depend on it.

Canonical, Open Graph, and sitemap URLs currently use the existing public portfolio URL:

`https://portfolio-omega-gules-27.vercel.app`

If the site moves to a different domain, update:
- the canonical/OG URLs in every HTML head;
- `sitemap.xml` and `robots.txt`;
- the absolute links inside `cv.pdf` (regenerate the PDF with the new `<base>` URL).

## Share cards

The homepage uses `assets/og-card.jpg`. Each case study uses a project-specific 1200×630 card in `assets/og/`.


## CV

`cv.pdf` is generated from `resume.html` using the browser's print stylesheet. Regenerate it after changing the CV:

1. Open `resume.html` in Chromium.
2. Print to PDF (A4, background graphics on).
3. Replace `cv.pdf`.

The print stylesheet hides the header, footer, navigation, and download button, and adds the print-only phone number.
