param(
    [switch]$FailFast
)

Write-Host "🚀 Starting OpsPipeline..."

# -----------------------------
# Gate: Lint
# -----------------------------
if (Test-Path .\LintGate.ps1) {
    Write-Host "▶ Running LintGate..."
    & .\LintGate.ps1
    if ($LASTEXITCODE -ne 0) {
        Write-Error "❌ LintGate failed"
        if ($FailFast) { exit 1 }
    }
} else {
    Write-Warning "⚠️ LintGate.ps1 not found, skipping..."
}

# -----------------------------
# Gate: Headers
# -----------------------------
if (Test-Path .\HeadersGate.ps1) {
    Write-Host "▶ Running HeadersGate..."
    & .\HeadersGate.ps1
    if ($LASTEXITCODE -ne 0) {
        Write-Error "❌ HeadersGate failed"
        if ($FailFast) { exit 1 }
    }
} else {
    Write-Warning "⚠️ HeadersGate.ps1 not found, skipping..."
}

# -----------------------------
# Gate: Dockerfile
# -----------------------------
if (Test-Path .\DockerfileGate.ps1) {
    Write-Host "▶ Running DockerfileGate..."
    & .\DockerfileGate.ps1
    if ($LASTEXITCODE -ne 0) {
        Write-Error "❌ DockerfileGate failed"
        if ($FailFast) { exit 1 }
    }
} else {
    Write-Warning "⚠️ DockerfileGate.ps1 not found, skipping..."
}

Write-Host "✅ OpsPipeline completed successfully."
exit 0
