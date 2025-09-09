@echo off
REM ======================================================
REM  Fix CI issues: run Prettier, stage, commit, and push
REM ======================================================

echo Running Prettier formatting...
call npx prettier --write .

echo Staging all changes...
git add -A

echo Committing changes...
git commit -m "fix: guard static mount in api.py + format with Prettier for CI"

echo Pushing to main branch...
git push origin main

echo.
echo ✅ Done! Changes pushed to main and CI should re-run.
pause
