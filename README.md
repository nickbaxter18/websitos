# WebsiteOS v2 (p..)

![Frontend CI](https://github.com/nickbaxter18/websitos/actions/workflows/frontend-ci.yml/badge.svg)
![Backend CI](https://github.com/nickbaxter18/websitos/actions/workflows/backend-ci.yml/badge.svg)
![Coverage](https://github.com/nickbaxter18/websitos/actions/workflows/coverage.yml/badge.svg)
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

- Frontend CI runs linting, build, Jest, and Playwright smoke tests.
- Backend CI runs Black, mypy, pytest, and API smoke tests.
- Coverage workflow uploads Jest + Pytest coverage to Codecov.
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