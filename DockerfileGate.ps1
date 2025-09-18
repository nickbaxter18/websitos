param(
    [switch]$Autofix
)

$dockerfile = "Dockerfile"
$timestamp = (Get-Date).ToString('yyyyMMdd_HHmmss')
$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$logDir = Join-Path $scriptRoot ".sec-log"
$logFile = Join-Path $logDir "dockerfile.$timestamp.json"

# Ensure log directory exists
if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir | Out-Null
}

$result = @()
$fail = $false

if (-not (Test-Path $dockerfile)) {
    Write-Host "No Dockerfile found."
    $status = @{ status="skip"; message="No Dockerfile present." }
    $status | ConvertTo-Json -Depth 5 | Out-File -Encoding utf8 $logFile
    return 0
}

$content = Get-Content $dockerfile -Raw
$lines = Get-Content $dockerfile

# Rule 1: FROM latest
if ($content -match "FROM\s+\S*:latest") {
    $fail = $true
    $result += @{ issue="FROM latest"; severity="high"; fix="Pin version (e.g. FROM node:20 or FROM python:3.11-slim)" }

    if ($Autofix) {
        $lines = $lines -replace "FROM\s+\S*:latest", "FROM node:20"
        $result += @{ autofix="Replaced FROM latest with FROM node:20" }
    }
}

# Rule 2: Missing USER (should not be root)
if ($content -notmatch "(?i)^\s*USER\s+") {
    $fail = $true
    $result += @{ issue="No USER specified"; severity="high"; fix="Add 'USER appuser' before CMD" }

    if ($Autofix) {
        $cmdIndex = $lines.IndexOf(($lines | Where-Object { $_ -match "^\s*CMD\s+" }))
        if ($cmdIndex -ge 0) {
            $lines = $lines[0..($cmdIndex-1)] + "USER appuser" + $lines[$cmdIndex..($lines.Length-1)]
        } else {
            $lines += "USER appuser"
        }
        $result += @{ autofix="Inserted USER appuser" }
    }
}

# Rule 3: Missing HEALTHCHECK
if ($content -notmatch "(?i)^\s*HEALTHCHECK\s+") {
    $fail = $true
    $result += @{ issue="No HEALTHCHECK defined"; severity="medium"; fix="Add HEALTHCHECK CMD curl -f http://localhost:8000/api/health || exit 1" }

    if ($Autofix) {
        $lines += "HEALTHCHECK CMD curl -f http://localhost:8000/api/health || exit 1"
        $result += @{ autofix="Added default HEALTHCHECK for /api/health" }
    }
}

# Rule 4: npm install vs npm ci
if ($content -match "npm install" -and $content -notmatch "npm ci") {
    $fail = $true
    $result += @{ issue="npm install used"; severity="medium"; fix="Use npm ci for reproducible builds" }

    if ($Autofix) {
        $lines = $lines -replace "npm install", "npm ci"
        $result += @{ autofix="Replaced npm install with npm ci" }
    }
}

# Write back Dockerfile if autofix applied
if ($Autofix -and $fail) {
    Set-Content -Path $dockerfile -Value $lines -Encoding utf8
    Write-Host "🛠 Autofix applied to Dockerfile." -ForegroundColor Yellow
}

# Write log
if ($result.Count -eq 0) {
    $result = @(@{ status="pass"; message="No issues found." })
}

$result | ConvertTo-Json -Depth 5 | Out-File -Encoding utf8 $logFile

# Final output
if ($fail) {
    if ($Autofix) {
        Write-Host "⚠️ Dockerfile Hardening Gate fixed issues. See $logFile" -ForegroundColor Yellow
        return 0
    } else {
        Write-Host "❌ Dockerfile Hardening Gate failed. See $logFile" -ForegroundColor Red
        return 1
    }
} else {
    Write-Host "✅ Dockerfile Hardening Gate passed. See $logFile" -ForegroundColor Green
    return 0
}
