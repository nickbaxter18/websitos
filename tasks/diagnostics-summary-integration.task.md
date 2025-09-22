# Diagnostics Summary Integration Contract

This task defines the canonical requirements for Codex-compatible diagnostics summaries across the CI matrices. Every update to the diagnostics system must continue to satisfy these expectations.

## Matrix Coverage

The following jobs MUST emit diagnostics summaries:

- **frontend-checks**: `lint`, `prettier`, `type-check`, `test-unit`, `playwright-e2e`
- **backend-checks**: `black`, `flake8`, `mypy`, `pytest`
- **coverage-checks**: `frontend`, `backend`, `backend-node`, `e2e`

## Summary File Specification

For each matrix entry, the workflow must:

1. Create `summaries/<scope>` where `<scope>` is `frontend`, `backend`, or `coverage`.
2. Write a JSON summary at `summaries/<scope>/<job-key>.json` where `<job-key>` matches the aggregator key (for example `frontend-checks_lint`).
3. The JSON content must match the schema:

```json
{
  "job": "<job-key>",
  "status": "success",
  "exit_code": 0,
  "metadata": {
    "tool": "<task>",
    "version": "1.0.0"
  },
  "environment": {
    "runner": "Hosted Agent",
    "os": "ubuntu-latest"
  },
  "dependencies": {
    "npm": []
  }
}
```

4. Write the file via `tee` (for example `cat <<'EOF' | tee summaries/<scope>/<job-key>.json`).
5. Display the directory listing (`ls -lah summaries/<scope>`) and the file contents (`cat summaries/<scope>/<job-key>.json`).
6. Upload the entire `summaries/` directory as an artifact named `diagnostics-summary-<job-key>` with a two-day retention window.

## Aggregator Expectations

- The diagnostics aggregator loads each JSON file, validates it against `diagnostics.schema.json`, and renders the CI Diagnostics Report.
- Missing or invalid summaries surface as explicit warnings; no implicit fallbacks should be relied upon.
- Artifact download patterns in `.github/workflows/diagnostics.yml` must continue to capture every `diagnostics-summary-*` artifact.

## Extensibility Guidance

- Adding a new matrix entry requires updating the workflow summary emission and the aggregator's expected job list.
- Schema changes must remain backward compatible or include appropriate migration logic in the aggregator.
- Keep the summary writer logic modular so that additional metadata fields can be added in the future without breaking the base schema above.

