# 03 — Guía de ejecución

## Requisitos

- **Java 21+** (backend Spring Boot, y también el generador de reportes Serenity BDD).
- **Node.js 18+** y **npm**.
- Navegador Chromium de Playwright (se instala una sola vez).

> No se necesita base de datos externa: el backend usa **H2 en memoria** y un procesador de
> pagos **mock**.

## Instalación única

```bash
cd frontend/payment-gateway-ui
npm install
npx playwright install chromium
```

## Opción A — Un solo comando (recomendada)

Desde la raíz del repositorio, en PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/run-e2e.ps1
```

Levanta el **backend** (:8085) y el **frontend Vite** (:5173), ejecuta la suite Cucumber, genera
el reporte Serenity BDD y detiene los servidores. Para dejarlos corriendo: añade `-KeepServers`.

## Opción B — Manual (tres terminales)

```bash
# Terminal 1 — backend
./mvnw spring-boot:run                  # http://localhost:8085

# Terminal 2 — frontend
cd frontend/payment-gateway-ui && npm run dev    # http://localhost:5173

# Terminal 3 — pruebas + reporte
cd frontend/payment-gateway-ui
npm run test:e2e
npm run serenity:report
```

## Comandos útiles

```bash
# Toda la suite
npm run test:e2e

# Una sola feature
npm run test:e2e -- e2e/features/hu-1.12-cancelacion-reembolso.feature

# Incluir los escenarios @gap (quedan como no implementados)
npm run test:e2e -- --tags "@gap or not @gap"

# Generar el reporte Serenity BDD (tras ejecutar la suite)
npm run serenity:report
```

## Dónde queda la evidencia

| Artefacto | Ruta |
|---|---|
| **Reporte Serenity BDD** (Feature → Scenario → Step, con capturas) | `frontend/payment-gateway-ui/target/site/serenity/index.html` |
| Resultados crudos (JSON Serenity) | `frontend/payment-gateway-ui/target/site/serenity/` |

## Resultado esperado

```
22 scenarios (22 passed)
```

(Los 5 escenarios `@gap` se excluyen por defecto; están en los `.feature` documentados.)

## Nota sobre Windows

Si `node_modules` se instaló en otro sistema operativo, vuelve a ejecutar `npm install` en
`frontend/payment-gateway-ui` para regenerar los binarios.
