# Smoke tests

The tests are excluded from the Vercel deployment by `.vercelignore`.

Install Playwright locally and run against the local server:

```powershell
npm init -y
npm install -D @playwright/test
npx playwright install chromium
python -m http.server 8080 --bind 127.0.0.1
npx playwright test tests/smoke.spec.mjs --reporter=line
```

Use `BASE_URL=https://your-deployment.example` to test a deployed preview.
