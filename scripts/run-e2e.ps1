<#
  run-e2e.ps1 — Ejecuta la suite E2E del Sprint 3 con un solo comando.

  1. Levanta el backend Spring Boot (H2 en memoria, procesador mock).
  2. Espera a que el backend responda en http://localhost:8085.
  3. Ejecuta la suite Playwright (que a su vez levanta el frontend Vite).
  4. Detiene el backend al terminar (salvo -KeepBackend).

  Uso:
    powershell -ExecutionPolicy Bypass -File scripts/run-e2e.ps1
    powershell -ExecutionPolicy Bypass -File scripts/run-e2e.ps1 -KeepBackend
#>
param([switch]$KeepBackend)

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$frontend = Join-Path $root 'frontend\payment-gateway-ui'

Write-Host '==> Iniciando backend (Spring Boot + H2)...' -ForegroundColor Cyan
$mvnw = Join-Path $root 'mvnw.cmd'
$backend = Start-Process -FilePath $mvnw -ArgumentList 'spring-boot:run' -WorkingDirectory $root -PassThru -WindowStyle Minimized

try {
  Write-Host '==> Esperando a que el backend responda en :8085...' -ForegroundColor Cyan
  $ready = $false
  for ($i = 0; $i -lt 90; $i++) {
    try {
      Invoke-WebRequest -Uri 'http://localhost:8085/api/v1/auth/me' -TimeoutSec 3 -UseBasicParsing | Out-Null
      $ready = $true; break
    } catch {
      if ($_.Exception.Response) { $ready = $true; break }  # respondió (401/403) => está arriba
      Start-Sleep -Seconds 2
    }
  }
  if (-not $ready) { throw 'El backend no respondió a tiempo en http://localhost:8085' }
  Write-Host '==> Backend listo.' -ForegroundColor Green

  Write-Host '==> Ejecutando suite E2E (Playwright)...' -ForegroundColor Cyan
  Push-Location $frontend
  try {
    npm run test:e2e
    $code = $LASTEXITCODE
  } finally {
    Pop-Location
  }

  Write-Host ''
  Write-Host "==> Reporte HTML: $frontend\e2e\report\index.html" -ForegroundColor Green
  Write-Host "==> Evidencias:   $frontend\e2e\evidencias\" -ForegroundColor Green
  exit $code
}
finally {
  if (-not $KeepBackend) {
    Write-Host '==> Deteniendo backend...' -ForegroundColor Cyan
    # El wrapper de Maven (mvnw.cmd) lanza un proceso Java hijo: hay que matar el árbol
    # y, por si acaso, cualquier proceso que siga escuchando en el puerto 8085.
    if ($backend -and -not $backend.HasExited) {
      Get-CimInstance Win32_Process -Filter "ParentProcessId=$($backend.Id)" -ErrorAction SilentlyContinue |
        ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
      Stop-Process -Id $backend.Id -Force -ErrorAction SilentlyContinue
    }
    $conn = Get-NetTCPConnection -LocalPort 8085 -State Listen -ErrorAction SilentlyContinue
    if ($conn) {
      $conn.OwningProcess | Sort-Object -Unique |
        ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
    }
  }
}
