# 03 — Guía de ejecución

## Requisitos

- **Java 21+** (para el backend Spring Boot).
- **Node.js 18+** y **npm**.
- Navegador Chromium de Playwright (se instala una sola vez, ver abajo).

> No se necesita base de datos externa: el backend usa **H2 en memoria** y un procesador de
> pagos **mock**.

## Instalación única

```bash
# 1) Dependencias del frontend (incluye Playwright)
cd frontend/payment-gateway-ui
npm install

# 2) Navegador para Playwright
npx playwright install chromium
```

## Opción A — Un solo comando (recomendada)

Desde la raíz del repositorio, en PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/run-e2e.ps1
```

El script levanta el backend, espera a que esté listo, ejecuta la suite (que a su vez levanta
el frontend) y detiene el backend al terminar. Para dejar el backend corriendo: añade
`-KeepBackend`.

## Opción B — Manual (dos terminales)

**Terminal 1 — backend:**
```bash
./mvnw spring-boot:run
# Espera el log "Started EmbeddedPaymentsApplication" (http://localhost:8085)
```

**Terminal 2 — pruebas E2E:**
```bash
cd frontend/payment-gateway-ui
npm run test:e2e
```

Playwright levanta automáticamente el frontend (Vite, `http://localhost:5173`) gracias a la
sección `webServer` de `playwright.config.ts`.

## Comandos útiles

```bash
# Ejecutar toda la suite
npm run test:e2e

# Ejecutar una sola HU
npm run test:e2e -- hu-1.10

# Ver el último reporte HTML
npx playwright show-report e2e/report

# Ejecutar en modo visible (ver el navegador) o paso a paso
npm run test:e2e -- --headed
npm run test:e2e -- --ui
```

## Dónde queda la evidencia

| Artefacto | Ruta |
|---|---|
| Reporte HTML interactivo | `frontend/payment-gateway-ui/e2e/report/index.html` |
| Resultado en JSON | `frontend/payment-gateway-ui/e2e/report/results.json` |
| Capturas de los flujos UI | `frontend/payment-gateway-ui/e2e/evidencias/*.png` |
| Trazas/videos (solo si algo falla) | `frontend/payment-gateway-ui/e2e/.artifacts/` |

## Resultado esperado

```
27 casos · 22 passed · 5 skipped · 0 failed
```

Los 5 *skipped* son los criterios sin implementación (HU 1.15 balance general e inconsistencia;
HU 1.16 auditoría) y aparecen en el reporte con su motivo.

## Nota sobre Windows

Si `node_modules` se instaló en otro sistema operativo, los binarios (`vite`, `playwright`)
pueden no resolverse en Windows. Solución: volver a ejecutar `npm install` en
`frontend/payment-gateway-ui` para regenerar los accesos `.cmd`.
