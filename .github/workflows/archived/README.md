# Archived CI Workflows

This folder contains **legacy GitHub Actions CI workflows** that are no longer in use but are preserved for historical reference.

## Archived Files
- `ci.yml` → Original combined CI pipeline (frontend + backend)
- `e2e.yml` → Early Playwright E2E pipeline
- `websiteos-ci.yml` → Previous WebsiteOS-specific CI pipeline

## Notes
- These workflows will **not run** because GitHub only executes workflows in the root `.github/workflows/` folder.
- All active CI has been replaced by the following modern workflows:
  - `frontend-ci.yml`
  - `backend-ci.yml`
  - `pr-summary.yml`
  - `coverage.yml`

---
✅ These files are kept only for reference. Safe to delete in the future once no longer needed.