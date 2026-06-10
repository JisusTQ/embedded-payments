<#
  run-e2e.ps1 — Levanta la aplicación bajo prueba (objeto de prueba) para las pruebas E2E.

  Arranca el backend (Spring Boot, :8085) y el frontend (Vite, :5173) y los deja corriendo.
  Luego ejecuta la suite E2E desde e2e-serenity con Gradle:

      cd e2e-serenity
      gradle clean test        # o .\gradlew.bat clean test

  Para detener los servidores al terminar, cierra las ventanas o usa los PID que imprime.
#>
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$frontend = Join-Path $root 'frontend\payment-gateway-ui'

function Wait-ForPort([int]$port, [string]$name, [int]$retries = 90) {
  for ($i = 0; $i -lt $retries; $i++) {
    if (Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue) {
      Write-Host "==> $name listo (:$port)." -ForegroundColor Green
      return
    }
    Start-Sleep -Seconds 2
  }
  throw "$name no respondió en el puerto $port"
}

Write-Host '==> Iniciando backend (Spring Boot + H2)...' -ForegroundColor Cyan
$backend = Start-Process -FilePath (Join-Path $root 'mvnw.cmd') -ArgumentList 'spring-boot:run' -WorkingDirectory $root -PassThru -WindowStyle Minimized
Wait-ForPort 8085 'Backend'

Write-Host '==> Iniciando frontend (Vite)...' -ForegroundColor Cyan
$frontendProc = Start-Process -FilePath 'npm.cmd' -ArgumentList 'run', 'dev' -WorkingDirectory $frontend -PassThru -WindowStyle Minimized
Wait-ForPort 5173 'Frontend'

Write-Host ''
Write-Host '==> Objeto de prueba arriba. Ahora ejecuta la suite E2E:' -ForegroundColor Green
Write-Host '    cd e2e-serenity' -ForegroundColor Yellow
Write-Host '    gradle clean test        # o .\gradlew.bat clean test' -ForegroundColor Yellow
Write-Host ''
Write-Host "PID backend=$($backend.Id)  PID frontend=$($frontendProc.Id) (deten estos procesos al terminar)" -ForegroundColor DarkGray
