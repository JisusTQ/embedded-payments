# 05 — Guion de la exposición (Sprint 3)

Duración sugerida: 8–10 min. Estructura: contexto → patrón Screenplay → demo → resultados →
hallazgos → cierre.

## 1. Apertura (30 s)
> "En el Sprint 3 automatizamos los escenarios de aceptación de las HU 1.9 a 1.16 con el
> **patrón Screenplay** usando **Serenity/JS**. Las pruebas se leen como lenguaje de negocio:
> **actores** con **habilidades** que ejecutan **tareas** y verifican el sistema con **preguntas**.
> Se ejecutan de extremo a extremo sobre la plataforma real."

## 2. El patrón Screenplay (1–2 min)
Abre [01-estrategia-automatizacion.md](01-estrategia-automatizacion.md) y muestra la tabla de
los 4 elementos. Luego muestra un escenario real (p. ej. `e2e/hu-1.11-estado-pago.spec.ts`):
```ts
await actorCalled('Comercio').attemptsTo(
  Authenticate.asSeededMerchant(),
  CreateAPaymentIntent.of(95),
  ConsultThePaymentStatus.now(),
  Ensure.that(PaymentIntentStatus(), equals('CREATED')),
  AuthorizeThePayment.now(),
  ConsultThePaymentStatus.now(),
  Ensure.that(PaymentIntentStatus(), equals('SUCCEEDED')),
)
```
Señala:
- **Actor**: `Comercio` (y en otros escenarios `Administrador`, `Cliente`, `Intruso`).
- **Abilities**: definidas en `screenplay/cast/Actors.ts` (BrowseTheWeb, CallAnApi, TakeNotes).
- **Tasks**: `Authenticate`, `CreateAPaymentIntent`, `AuthorizeThePayment`… en `screenplay/tasks/`.
- **Questions**: `PaymentIntentStatus`, `ResponseStatus`… en `screenplay/questions/`.

## 3. Demo en vivo (3–4 min)
Backend arriba (o usa `scripts/run-e2e.ps1`). Ejecuta una HU con interfaz:
```bash
cd frontend/payment-gateway-ui
npm run test:e2e -- hu-1.10
```
Narra: el actor **Comercio** crea el cobro por API y el actor **Cliente** paga el checkout por la
interfaz; con el monto trigger la plataforma **rechaza**.

Cierra abriendo el **reporte Serenity BDD**:
```bash
npm run serenity:report
# Abrir: target/site/serenity/index.html
```
Muestra el árbol por actor/tarea con capturas y el resumen **22 successful, 5 skipped**.

## 4. Resultados (1 min)
- **22 aprobados / 27**, 0 fallidos.
- **19 de 19** escenarios automatizables: 100%.
- 5 omitidos = criterios **sin implementación** en el producto (no son fallos): quedan como
  pruebas omitidas con su motivo, visibles en el reporte.

## 5. Hallazgos de QA (1–2 min) — el punto fuerte
Resume [04-hallazgos-qa.md](04-hallazgos-qa.md):
- **Defecto real:** validador de routing bancario calculaba mal el checksum ABA. **Corregido.**
- **Testabilidad:** el procesador de pagos era aleatorio; lo hicimos **determinista**.
- **Defecto de UI:** la vista de Balances se rompía al refrescar; **corregido.**
- **5 vacíos de implementación** detectados (ledger consolidado, inconsistencias y auditoría).

## 6. Cierre (30 s)
> "Dejamos una suite E2E con patrón Screenplay, reproducible de un comando, con reporte Serenity
> BDD y trazada 1:1 con los criterios de aceptación. Quedan identificados los pendientes de
> producto en ledger y auditoría."

---

## Posibles preguntas

**¿Dónde está cada parte del patrón?** Actores en las specs (`actorCalled`), abilities en
`screenplay/cast/Actors.ts`, tasks en `screenplay/tasks/`, questions en `screenplay/questions/`,
page objects en `screenplay/ui/Pages.ts`.

**¿Por qué algunas pruebas son por API y no por la interfaz?** Varias operaciones (autorizar,
cancelar, reembolsar, accesos cruzados) **no tienen interfaz**; el actor las ejerce con la ability
`CallAnApi`. Sigue siendo E2E sobre el sistema real.

**¿Por qué hay 5 pruebas omitidas?** Son criterios sin soporte en el producto (ledger consolidado
de administrador, detección de inconsistencias y consulta/inmutabilidad de auditoría); se dejan
trazados como pendientes.

**¿Serenity reemplaza a Playwright?** Serenity/JS implementa el patrón Screenplay **sobre** el
motor de Playwright. El código de las pruebas es 100% Screenplay (no hay `test()`/`expect()` ni
`page.locator` en las specs).
