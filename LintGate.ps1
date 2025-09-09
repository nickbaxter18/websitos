param(
    [switch]$Autofix
)

$timestamp = (Get-Date).ToString('yyyyMMdd_HHmmss')
$logDir = ".qa-log"
$logFile = "$logDir/lint.$timestamp.json"

if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir | Out-Null
}

$result = @()
$fail = $false

# Get changed JS/TS files (staged in Git)
$changed = git diff --name-only --cached | Where-Object { $_ -match "\.(js|ts|jsx|tsx)$" }

if (-not $changed) {
    Write-Host "No JS/TS files changed."
    $status = @{ status="skip"; message="No JS/TS files modified." }
    $status | ConvertTo-Json -Depth 5 | Out-File -Encoding utf8 $logFile
    return 0
}

foreach ($file in $changed) {
    # ESLint check
    $eslint = npx eslint $file --format json
    if ($LASTEXITCODE -ne 0) {
        $fail = $true
        $result += @{ file=$file; issue="ESLint errors"; severity="high"; details=$eslint }
    }

    # Prettier check (autofix if enabled)
    if ($Autofix) {
        npx prettier --write $file | Out-Null
        $result += @{ file=$file; autofix="Prettier applied" }
    } else {
        npx prettier --check $file | Out-Null
        if ($LASTEXITCODE -ne 0) {
            $result += @{ file=$file; issue="Prettier formatting issue"; severity="warning"; fix="Run Prettier or use -Autofix" }
        }
    }
}

if ($result.Count -eq 0) {
    $result = @(@{ status="pass"; message="No linting issues found." })
}

$result | ConvertTo-Json -Depth 5 | Out-File -Encoding utf8 $logFile

if ($fail) {
    if ($Autofix) {
        Write-Host "⚠️ ESLint/Prettier fixed some issues. See $logFile" -ForegroundColor Yellow
        return 0
    } else {
        Write-Host "❌ ESLint/Prettier Lint Gate failed. See $logFile" -ForegroundColor Red
        return 1
    }
} else {
    Write-Host "✅ ESLint/Prettier Lint Gate passed. See $logFile" -ForegroundColor Green
    return 0
}
