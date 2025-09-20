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
   - Frontend, Backend, and Coverage workflows run tools, call converters, and upload JSON artifacts (`*-report.json`).
   - Fail-safe defaults ensure that even if a converter fails, a valid JSON is uploaded.

3. **CI Diagnostics Aggregator** (`ci-diagnostics.yml`):
   - Downloads all JSON summaries.
   - Aggregates them into a single `report.md`.
   - Adds a **summary table** of errors/warnings.
   - Includes full error/warning details + suggestions.
   - Syncs to Linear with labels (`ci-error`, `ci-warning`, `ci-success`).
   - Links back to the GitHub commit + branch.

4. **Linear Integration**:
   - One issue per commit is created/updated.
   - Labeled according to results.
   - Can be extended to auto-assign issues to teams or devs.

---

## 📂 File Locations

- **Converters**: `scripts/convert-*.js` / `scripts/convert-*.py`
- **Workflows**: `.github/workflows/*checks.yml`
- **Docs**: `docs/ci-diagnostics.md`

---

## ✅ Benefits

- All failures, warnings, and notices are captured.
- Developers don’t need to parse raw logs.
- Linear becomes the single source of truth for CI health.
- Chat integration makes debugging fast and interactive.

---

## 🔮 Future Enhancements

- Auto-patch trivial fixes (Prettier, Black, ESLint autofix).
- Trend tracking across multiple runs (flaky test detection).
- Proactive chat alerts when new CI Diagnostics issues are created.
- Local CLI wrapper (`ci-diagnostics local`) for pre-push checks.

---

## 👩‍💻 Developer Notes

- Always ensure your workflow uploads `*-report.json` artifacts.
- Converters can be tested locally with:
  ```bash
  node scripts/convert-eslint.js eslint-output.json eslint-report.json
  python scripts/convert_pytest.py pytest-output.json pytest-report.json
  ```
- CI Diagnostics will fail if no summaries are uploaded.
