# 05 — Guion de la exposición (Sprint 3)

Duración sugerida: 8–10 min. Estructura: contexto → estrategia → demo en vivo → resultados →
hallazgos → cierre.

## 1. Apertura (30 s)
> "En el Sprint 3 automatizamos los escenarios de aceptación de las HU 1.9 a 1.16 y los
> ejecutamos como pruebas E2E sobre la plataforma de pagos. Usamos **Playwright**: para los
> flujos con interfaz, conducimos un navegador real; para las operaciones que solo existen
> como servicio, probamos la API. En ambos casos contra el sistema **real**, de extremo a extremo."

## 2. Qué se automatizó (1 min)
Muestra la **matriz de trazabilidad** ([02-matriz-trazabilidad.md](02-matriz-trazabilidad.md)).
Puntos a decir:
- Un archivo de pruebas por HU; un caso por escenario Gherkin.
- 24 escenarios de las HU + 3 de acceso (login) = **27 casos**.
- El Gherkin se mantiene en **lenguaje de negocio**; lo técnico vive solo en el código de
  automatización (con comentarios Given/When/Then que reflejan el escenario).

## 3. Demo en vivo (3–4 min)
Antes de empezar: backend arriba (o usa `scripts/run-e2e.ps1`).

**Opción rápida (recomendada):** ejecuta la suite completa en modo visible para una HU clave:
```bash
cd frontend/payment-gateway-ui
npm run test:e2e -- hu-1.10 --headed
```
Narra mientras corre:
- "Creamos la intención de pago, abrimos el checkout del cliente y pagamos: la plataforma
  **aprueba** y muestra el recibo." (CP-1.10.1)
- "Con el monto que dispara rechazo, la plataforma **rechaza** e informa el motivo." (CP-1.10.2)

**Cierre de la demo:** ejecuta toda la suite y abre el reporte:
```bash
npm run test:e2e
npx playwright show-report e2e/report
```
Muestra el reporte HTML: **22 passed, 5 skipped, 0 failed**. Abre un caso y enseña los pasos.

> Plan B si no quieres ejecutar en vivo: muestra las capturas de `e2e/evidencias/` y el
> reporte HTML ya generado.

## 4. Resultados (1 min)
- **22 aprobados / 27**, 0 fallidos.
- **19 de 19** escenarios automatizables: 100%.
- 5 omitidos = criterios **sin implementación** en el producto (no son fallos): se dejan como
  pruebas omitidas con motivo, visibles en el reporte.

## 5. Hallazgos de QA (1–2 min) — el punto fuerte
Resume [04-hallazgos-qa.md](04-hallazgos-qa.md):
- **Defecto real encontrado:** el validador de routing bancario calculaba mal el checksum
  ABA y rechazaba datos válidos. **Corregido y verificado.**
- **Testabilidad:** el procesador de pagos era aleatorio; lo hicimos **determinista** para
  poder automatizar aprobación y rechazo.
- **Defecto de UI:** la vista de Balances se rompía al refrescar; **corregido.**
- **5 vacíos de implementación** detectados y documentados (ledger consolidado, detección de
  inconsistencias y auditoría sin API de consulta).

> Mensaje clave: "La automatización no solo verifica lo que funciona; **encontró un bug real
> y mapeó lo que falta** en el producto."

## 6. Cierre (30 s)
> "Dejamos una suite E2E reproducible de un comando, integrable a CI, con reporte y evidencias,
> trazada 1:1 con los criterios de aceptación. Quedan identificados los pendientes de producto
> en ledger y auditoría para los próximos sprints."

---

## Posibles preguntas y respuestas

**¿Por qué algunas pruebas son por API y no por la interfaz?**
Porque varias operaciones del ciclo de vida del pago (autorizar, cancelar, reembolsar, validar
accesos cruzados) **no tienen interfaz**; solo existen como servicio. Probarlas por su API
sigue siendo E2E: ejercita el sistema real desplegado.

**¿Por qué hay 5 pruebas omitidas?**
Son criterios cuyo soporte **no está implementado** en el producto (ledger consolidado de
administrador, detección de inconsistencias y consulta/inmutabilidad de auditoría). Se dejan
como pruebas omitidas con su motivo, para que el criterio quede trazado y pendiente.

**¿Las pruebas dependen de datos previos?**
No: los casos que necesitan datos **crean su propio comercio** (email único) y sus propios
cobros, por lo que la corrida es repetible.

**¿Cómo se integra a CI?**
`npm run test:e2e` levanta el frontend automáticamente; basta tener el backend arriba (o usar
`scripts/run-e2e.ps1`). El reporte HTML y el `results.json` sirven como artefactos del pipeline.
