# Continuous Confidence Framework (CCF) Manifest

This document defines the required components for CCF compliance.

## ✅ Components Present
- CI Preflight Workflow
- PR Narrator Workflow
- Post-Deploy Smoke Test Workflow
- Render Deploy Workflow
- Branch Protection Workflow
- Secrets Schema
- Secrets Validation Script

## 🔄 Mapping to Implementation
- `.github/workflows/ci-preflight.yml` → Ensures preflight checks run before deploys.
- `.github/workflows/pr-narrator.yml` → Summarizes logs and surfaces diagnostics.
- `.github/workflows/post-deploy-smoke.yml` → Runs smoke tests after deploy.
- `.github/workflows/render-deploy.yml` → Handles deploy to Render.
- `.github/workflows/branch-protection.yml` + `.github/branch-protection-rules.yml` → Enforces branch protection rules.
- `config/secrets.schema.json` → Defines required secrets and their schema.
- `scripts/validate-secrets.js` → Ensures secrets align with schema.

---

This manifest is **auto-maintained** by U-DIG IT WebsiteOS Meta-Intelligence.