# Sprint 3 — Automatización E2E con Serenity BDD + Screenplay + Cucumber

Este sprint cubre los dos entregables de la rúbrica:

1. **Automatizar los escenarios de los casos de prueba** según los criterios de aceptación de las HU.
2. **Ejecutar las pruebas automatizadas (E2E)** sobre el objeto de prueba.

**Objeto de prueba:** plataforma *Embedded Payments* (backend Spring Boot + frontend Vue 3).
**HU priorizadas del Sprint 3:** HU 1.9 a HU 1.16.
**Stack de automatización:** **Gherkin (.feature) → Cucumber → Screenplay (Serenity/JS) → Playwright**.

## El patrón completo (lo que exige la rúbrica)

| Capa | Qué es | Dónde está |
|---|---|---|
| **Features** (Gherkin) | Escenarios de negocio en lenguaje natural | `e2e/features/*.feature` |
| **Step definitions** | Conectan cada paso Gherkin con el Screenplay | `e2e/features/step_definitions/*.steps.ts` |
| **Actors** (actores) | `Comercio`, `Administrador`, `Cliente`, `Intruso` | `actorCalled('Comercio')` en los steps |
| **Abilities** (habilidades) | BrowseTheWebWithPlaywright, CallAnApi, TakeNotes | `e2e/screenplay/cast/Actors.ts` |
| **Tasks** (tareas) | `LogIn`, `CreateAPaymentOrder`, `AuthorizeThePayment`, `RequestARefund`… | `e2e/screenplay/tasks/` |
| **Questions** (preguntas) | `PaymentIntentStatus`, `ResponseStatus`, `TransactionHistoryRows`… | `e2e/screenplay/questions/` |

Así se lee un escenario (Gherkin) y su step (Screenplay):

```gherkin
Scenario: El estado cambia después de una acción
  Given un pago fue autorizado
  When la plataforma procesa el cobro
  Then el estado cambia y el comercio puede verlo actualizado
```
```ts
When('la plataforma procesa el cobro', () =>
  actorCalled('Comercio').attemptsTo(AuthorizeThePayment.now()),
)
```

## Resultado de la ejecución

| Métrica | Valor |
|---|---|
| Escenarios ejecutados | **22** (19 de las HU + 3 de acceso) |
| ✅ Aprobados | **22** |
| ❌ Fallidos | **0** |
| Escenarios documentados como **@gap** (no ejecutables) | **5** |
| Cobertura de escenarios automatizables | **19/19 (100%)** |

> Los 5 escenarios `@gap` (ledger consolidado de administrador, detección de inconsistencias y
> auditoría) **están en los `.feature`** etiquetados `@gap` y se excluyen de la ejecución porque el
> objeto de prueba no los implementa. Son **hallazgos de QA**, no fallos. Ver
> [04-hallazgos-qa.md](04-hallazgos-qa.md).

## Reporte y evidencias

- **Reporte Serenity BDD** (Feature → Scenario → Step, por actor, con capturas):
  `frontend/payment-gateway-ui/target/site/serenity/index.html`
- Se genera con `npm run serenity:report` después de ejecutar la suite.

## Estructura del código de pruebas

```
frontend/payment-gateway-ui/
├── cucumber.cjs                       # configuración del runner Cucumber
└── e2e/
    ├── features/
    │   ├── *.feature                  # Gherkin (HU 1.9–1.16 + acceso)
    │   ├── step_definitions/*.steps.ts# pasos -> Screenplay
    │   └── support/serenity.config.ts # navegador + Cast + reporteros
    ├── screenplay/
    │   ├── cast/Actors.ts             # ABILITIES
    │   ├── tasks/                     # TASKS (Authentication, Payments, MerchantUi)
    │   ├── questions/                 # QUESTIONS (Api.ts, Ui.ts)
    │   ├── ui/Pages.ts                # Page Objects (Targets)
    │   └── notes.ts
    └── helpers/test-data.ts
```

## Contenido de esta carpeta

| Documento | Descripción |
|---|---|
| [01-estrategia-automatizacion.md](01-estrategia-automatizacion.md) | Estrategia, stack y patrón Screenplay/BDD. |
| [02-matriz-trazabilidad.md](02-matriz-trazabilidad.md) | Mapeo HU → escenario (Gherkin) → estado. |
| [03-guia-ejecucion.md](03-guia-ejecucion.md) | Cómo ejecutar la suite y ver el reporte. |
| [04-hallazgos-qa.md](04-hallazgos-qa.md) | Defectos corregidos y gaps detectados. |
| [05-guion-exposicion.md](05-guion-exposicion.md) | Guion para la sustentación. |
