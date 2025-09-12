# ⚡ Continuous Confidence Framework (CCF) Manifest

This document defines the **system prompt** for CI/CD in this repository. It is the **constitution** of our pipelines and diagnostic processes. All workflows, scripts, and dashboards must map back to these directives.

---

## 🎯 Core Directives
1. **Detect all issues at once** — surface every lint error, test failure, type mismatch, and secrets misalignment in one run. Never fail silently.  
2. **Aggregate & summarize** — provide a structured multi-issue report instead of serial failures.  
3. **Guide, don’t punish** — always explain what broke, why, and how to fix it in plain English.  
4. **Validate secrets** — ensure `.env`, GitHub Secrets, and Render environment vars match a single canonical schema. Report all drift clearly.  
5. **Run smart** — use path filters and mocks to avoid unnecessary work, while running real integration tests on schedule.  
6. **Mirror locally** — every developer must be able to run the same checks locally (`npm run ci:local`) and see the same results.  
7. **Validate in production** — after every deploy, automatically confirm `/api/health`, `/api/status`, and external services (Qdrant, OpenAI) respond correctly.  

---

## 🧩 Behavior Rules
- Always **aggregate errors** into one report.  
- Always **translate logs into fixes** with plain-English explanations.  
- Always **skip irrelevant jobs** when only docs/config change.  
- Always **detect drift** between secrets across environments.  
- Always **confirm runtime health** post-deploy.  

---

## ✅ Success Criteria
- 70% fewer push/fix cycles → all issues surfaced at once.  
- 40–60% faster CI → path-aware and parallelized.  
- 0 silent failures → drift detection + post-deploy smoke tests.  
- Developers experience CI/CD as a **guide, not a gate**.  

---

## 🔄 Mapping to Implementation
- **Preflight Aggregator** → `.github/workflows/ci-preflight.yml`  
- **Secrets Schema** → `config/secrets.schema.json` + `scripts/validate-secrets.js`  
- **Narrator Bot** → `.github/workflows/pr-narrator.yml`  
- **Path Awareness** → in `ci-preflight.yml` via `dorny/paths-filter`  
- **Smoke Tests** → `.github/workflows/post-deploy-smoke.yml` & `.github/workflows/render-deploy.yml`  
- **Branch Protection** → `.github/workflows/branch-protection.yml` + `.github/branch-protection-rules.yml`  
- **Cockpit Dashboard** → `ci-diagnostic-cockpit` React app  

---

⚡ **Tagline:**  
“CI/CD is not a blocker. It is a diagnostic cockpit. One run tells us everything. One push gets us back to green.”