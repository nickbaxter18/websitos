# 🧩 CI Diagnostics System

## 📌 Overview

The CI Diagnostics system aggregates results from all CI jobs into a single structured report. This report is:

- Published back to **GitHub Checks**.
- Synced into **Linear** as an issue (with commit + branch links).
- Designed to be consumed directly in **chat** for debugging.

---

## 🛠 How It Works

1. **Converters**: Each tool (ESLint, Prettier, Jest, Pytest, Mypy, Flake8, Black, Coverage) has a converter script in `scripts/`.
   - Converts raw output (JSON, text, XML) into a standardized JSON schema.
   - Schema includes workflow, job, status, errors, warnings, notices.
   - Errors include file, line, rule, message, and suggestions.

2. **Workflows**:
   - Frontend, Backend, and Coverage workflows run tools, call converters, and collect JSON artifacts into a `summaries/` folder.
   - Each workflow uploads its packaged summaries as uniquely named artifacts:
     - `frontend-summaries`
     - `backend-summaries`
     - `coverage-summaries-frontend`, `coverage-summaries-backend`, `coverage-summaries-backend-node`, `coverage-summaries-e2e`
   - Artifacts are retained for **2 days**.

3. **CI Diagnostics Aggregator** (`ci-diagnostics.yml`):
   - Downloads all packaged artifacts.
   - Aggregates all JSON reports into a single `report.md`.
   - Adds a **summary table** of errors/warnings.
   - Includes full error/warning details + suggestions.
   - Syncs to Linear with labels:
     - `ci-error` → errors present
     - `ci-warning` → only warnings
     - `ci-success` → clean run
     - `ci-incomplete` → one or more artifacts missing (due to job cancellation or skip)
   - Links back to the GitHub commit + branch.

4. **Linear Integration**:
   - One issue per commit is created/updated.
   - Labeled according to results.
   - Can be extended to auto-assign issues to teams or devs.

---

## 📂 File Locations

- **Converters** (Python, snake_case):
  - `scripts/convert_pytest.py`
  - `scripts/convert_mypy.py`
  - `scripts/convert_flake8.py`
  - `scripts/convert_black.py`
  - `scripts/convert_pytest_coverage.py`
  - `scripts/convert_cobertura.py`
- **Converters (JS)**: `scripts/convert-eslint.js`, `scripts/convert-prettier.js`, `scripts/convert-jest.js`, `scripts/convert-jest-coverage.js`, `scripts/convert-tsc.js`
- **Workflows**: `.github/workflows/*checks.yml`
- **Docs**: `docs/ci-diagnostics.md`

---

## ✅ Benefits

- All failures, warnings, and notices are captured.
- Developers don’t need to parse raw logs.
- Linear becomes the single source of truth for CI health.
- Chat integration makes debugging fast and interactive.
- Packaged artifacts keep GitHub Actions UI clean.
- 2-day artifact retention keeps storage lean.
- `ci-incomplete` label provides visibility when jobs are cancelled or skipped.

---

## 🔮 Future Enhancements

- Auto-patch trivial fixes (Prettier, Black, ESLint autofix).
- Trend tracking across multiple runs (flaky test detection).
- Proactive chat alerts when new CI Diagnostics issues are created.
- Local CLI wrapper (`ci-diagnostics local`) for pre-push checks.

---

## 👩‍💻 Developer Notes

- Each workflow must place its reports in `summaries/` and upload as packaged artifacts.
- Converters can be tested locally with:
  ```bash
  node scripts/convert-eslint.js eslint-output.json eslint-report.json
  python scripts/convert_pytest.py pytest-output.json pytest-report.json
  ```
- CI Diagnostics will mark a run as `ci-incomplete` if artifacts are missing.
