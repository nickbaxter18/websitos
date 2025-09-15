# WebsiteOS v2 (p..)

![Frontend CI](https://github.com/nickbaxter18/websitos/actions/workflows/frontend-checks.yml/badge.svg)
![Backend CI](https://github.com/nickbaxter18/websitos/actions/workflows/backend-checks.yml/badge.svg)
![Coverage Checks](https://github.com/nickbaxter18/websitos/actions/workflows/coverage-checks.yml/badge.svg)
![Sync](https://github.com/nickbaxter18/websitos/actions/workflows/udigit-sync.yaml/badge.svg)
![PR Summary](https://github.com/nickbaxter18/websitos/actions/workflows/pr-summary.yml/badge.svg)
![Render Deploy](https://github.com/nickbaxter18/websitos/actions/workflows/render-deploy.yml/badge.svg)
[![Deploy Now](https://img.shields.io/badge/Deploy-Now-brightgreen)](https://github.com/nickbaxter18/websitos/actions/workflows/render-deploy.yml)
[![codecov](https://codecov.io/gh/nickbaxter18/websitos/branch/main/graph/badge.svg)](https://codecov.io/gh/nickbaxter18/websitos)

---

WebsiteOS v2 – Unified frontend, backend, and editor stack.

## Getting Started

```bash
npm install
npm run dev
```

## Tests

- Frontend unit tests: `npm test`
- Frontend E2E: `npm run test:e2e`
- Backend tests: `pytest`

## CI/CD

- Frontend CI runs linting, build, Jest, Playwright smoke tests, and **TypeScript type-checks**.
  - Uses `tsconfig.ci.json` for CI-only strict rules.
  - Always produces `tsc-report.txt` artifact for debugging.
  - Shims for missing types are in `global.d.ts`.
- Backend CI runs Black, mypy, pytest, and flake8.
- Coverage workflow enforces **80% minimum coverage** for both frontend and backend.
- Sync workflow uploads repo snapshot to U-DIG IT ingest API.
  - Retries API probes up to 3 times.
  - Skips cleanly with `::notice` if API is unreachable.
- PR Summary workflow posts CI diagnostics to pull requests.
- **Render Deploy workflow** uses `RENDER_DEPLOY_HOOK` to trigger a deploy of the service on Render.
- After deploy, **smoke tests** validate:
  - `/api/health` – API health
  - `/health` – root health
  - `/api/status` – extended status
  - `/` – frontend homepage

## Deployment

- Main branch pushes automatically trigger a deploy to Render via the webhook stored in the GitHub secret `RENDER_DEPLOY_HOOK`.
- You can also run it manually from GitHub Actions → **Render Deploy with Smoke Test**.
- Service URL: [https://websitos2.onrender.com](https://websitos2.onrender.com)

## Health Endpoints

- `/api/health` – API health
- `/health` – root health
- `/api/status` – extended status

---

<!-- trigger Frontend CI -->
