<#
  run-e2e.ps1 — Ejecuta la suite E2E (Serenity/JS + Cucumber, patrón Screenplay).

  1. Levanta el backend Spring Boot (H2 en memoria, procesador mock) en :8085.
  2. Levanta el frontend Vite en :5173.
  3. Ejecuta la suite Cucumber (features .feature + Screenplay).
  4. Genera el reporte Serenity BDD.
  5. Detiene backend y frontend (salvo -KeepServers).

  Uso:
    powershell -ExecutionPolicy Bypass -File scripts/run-e2e.ps1
    powershell -ExecutionPolicy Bypass -File scripts/run-e2e.ps1 -KeepServers
#>
param([switch]$KeepServers)

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$frontend = Join-Path $root 'frontend\payment-gateway-ui'

function Wait-ForPort([int]$port, [string]$name, [int]$retries = 90) {
  for ($i = 0; $i -lt $retries; $i++) {
    if (Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue) {
      Write-Host "==> $name listo (:$port)." -ForegroundColor Green
      return $true
    }
    Start-Sleep -Seconds 2
  }
  throw "$name no respondió en el puerto $port"
}

function Stop-Port([int]$port) {
  $conn = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
  if ($conn) {
    $conn.OwningProcess | Sort-Object -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
  }
}

$backend = $null
$frontendProc = $null
try {
  Write-Host '==> Iniciando backend (Spring Boot + H2)...' -ForegroundColor Cyan
  $backend = Start-Process -FilePath (Join-Path $root 'mvnw.cmd') -ArgumentList 'spring-boot:run' -WorkingDirectory $root -PassThru -WindowStyle Minimized
  Wait-ForPort 8085 'Backend' | Out-Null

  Write-Host '==> Iniciando frontend (Vite)...' -ForegroundColor Cyan
  $frontendProc = Start-Process -FilePath 'npm.cmd' -ArgumentList 'run', 'dev' -WorkingDirectory $frontend -PassThru -WindowStyle Minimized
  Wait-ForPort 5173 'Frontend' | Out-Null

  Push-Location $frontend
  try {
    Write-Host '==> Ejecutando suite Cucumber (Screenplay)...' -ForegroundColor Cyan
    npm run test:e2e
    $code = $LASTEXITCODE
    Write-Host '==> Generando reporte Serenity BDD...' -ForegroundColor Cyan
    npm run serenity:report
  } finally {
    Pop-Location
  }

  Write-Host ''
  Write-Host "==> Reporte Serenity BDD: $frontend\target\site\serenity\index.html" -ForegroundColor Green
  exit $code
}
finally {
  if (-not $KeepServers) {
    Write-Host '==> Deteniendo servidores...' -ForegroundColor Cyan
    foreach ($p in @($backend, $frontendProc)) {
      if ($p -and -not $p.HasExited) {
        Get-CimInstance Win32_Process -Filter "ParentProcessId=$($p.Id)" -ErrorAction SilentlyContinue |
          ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
        Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue
      }
    }
    Stop-Port 8085
    Stop-Port 5173
  }
}
