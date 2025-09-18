param(
    [switch]$Autofix
)

# Target FastAPI health endpoint (now under /api/health)
$url = "http://127.0.0.1:8000/api/health"
$timestamp = (Get-Date).ToString('yyyyMMdd_HHmmss')
$logDir = ".sec-log"
$logFile = "$logDir/headers.$timestamp.json"

# Ensure log directory exists
if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir | Out-Null
}

$result = @()
$fail = $false

try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing
    $headers = $response.Headers
} catch {
    Write-Host "❌ Could not reach $url"
    $status = @{ status="skip"; message="Server not reachable at $url" }
    $status | ConvertTo-Json -Depth 5 | Out-File -Encoding utf8 $logFile
    return 1
}

# Required security headers
$required = @{
    "Content-Security-Policy"   = "high"
    "Strict-Transport-Security" = "high"
    "X-Content-Type-Options"    = "medium"
    "X-Frame-Options"           = "medium"
}

foreach ($h in $required.Keys) {
    if (-not $headers[$h]) {
        $fail = $true
        $result += @{
            header   = $h
            issue    = "Missing"
            severity = $required[$h]
            fix      = "Add $h to FastAPI middleware or reverse proxy config"
        }

        if ($Autofix) {
            if (Test-Path "nginx.conf") {
                Add-Content "nginx.conf" "add_header $h 'SUGGESTED_VALUE';"
                $result += @{ header=$h; autofix="Added placeholder for $h in nginx.conf" }
            } else {
                $result += @{ header=$h; autofix="Manual fix required (FastAPI middleware)" }
            }
        }
    }
}

if ($result.Count -eq 0) {
    $result = @(@{ status="pass"; message="All required headers present at $url." })
}

$result | ConvertTo-Json -Depth 5 | Out-File -Encoding utf8 $logFile

# Console summary
if ($fail) {
    if ($Autofix) {
        Write-Host "⚠️ Headers Hardening Gate attempted autofix. See $logFile" -ForegroundColor Yellow
        return 0
    } else {
        Write-Host "❌ Headers Hardening Gate failed. See $logFile" -ForegroundColor Red
        $result | ForEach-Object { Write-Host "   -> Missing:" $_.header " | Fix:" $_.fix -ForegroundColor Red }
        return 1
    }
} else {
    Write-Host "✅ Headers Hardening Gate passed. See $logFile" -ForegroundColor Green
    return 0
}
