# 05 — Guion de la exposición (Sprint 3)

Duración sugerida: 8–10 min. Estructura: contexto → patrón Screenplay → demo → resultados →
hallazgos → cierre.

## 1. Apertura (30 s)
> "En el Sprint 3 automatizamos los escenarios de aceptación de las HU 1.9 a 1.16 con
> **Serenity BDD + Cucumber + el patrón Screenplay** en **Java/Gradle**. Las pruebas parten de
> archivos `.feature` (Gherkin en inglés, con `Examples`) y los step definitions delegan en
> **actores** que ejecutan **tasks** y verifican con **questions**, de extremo a extremo sobre
> la plataforma real."

## 2. El patrón Screenplay (1–2 min)
Muestra la estructura del proyecto `e2e-serenity/`:
- **Features**: `src/test/resources/features/**` (auth, payments, transactions, ledger).
- **Step definitions** y **runners** (JUnit 5): `src/test/java/.../stepdefinitions`, `.../runners`.
- **Actors / Abilities**: `hooks/StageSetup` (OnStage + WebDriver + CallAnApi).
- **Tasks**: `src/main/java/.../tasks` (`Login`, `CreatePaymentOrder`, `AuthorizePayment`, `RequestRefund`, …).
- **Questions**: `src/main/java/.../questions` (`PaymentStatus`, `TransactionCount`, …).

Abre un `.feature` (p. ej. `payment_creation.feature`) y enseña el `Scenario Outline` con
`Examples`; luego abre un step definition para mostrar `actorCalled(...).attemptsTo(Task...)`.

## 3. Demo en vivo (3–4 min)
Con backend (`:8085`) y frontend (`:5173`) arriba, desde `e2e-serenity/`:
```bash
gradlew clean test
```
Narra: los actores **Merchant / Administrator / Customer / Intruder** ejecutan las HU por
API y por navegador. Al terminar, abre el **reporte Serenity BDD**:
```
target/site/serenity/index.html
```
Muéstralo agrupado por *Feature → Scenario → Step*, con capturas de los pasos de UI.

## 4. Resultados (1 min)
- Escenarios ejecutables: **22 aprobados** (HU + acceso); **0 fallidos**.
- 5 escenarios `@gap` (ledger consolidado, detección de inconsistencias, auditoría) quedan en
  los `.feature` y **excluidos de la ejecución** porque el producto no los implementa.

## 5. Hallazgos de QA (1–2 min) — el punto fuerte
Resume [04-hallazgos-qa.md](04-hallazgos-qa.md):
- **Defecto real:** el validador de routing bancario calculaba mal el checksum ABA. **Corregido.**
- **Testabilidad:** el procesador de pagos era aleatorio; lo hicimos **determinista**.
- **Defecto de UI:** la vista de Balances se rompía al refrescar; **corregido.**
- **5 vacíos de implementación** detectados (ledger consolidado, inconsistencias y auditoría).

## 6. Cierre (30 s)
> "Dejamos una suite E2E con patrón Screenplay (Serenity BDD), ejecutable con Gradle, con
> reporte Serenity y trazada 1:1 con los criterios de aceptación. Quedan identificados los
> pendientes de producto en ledger y auditoría."

---

## Posibles preguntas

**¿Dónde está cada parte del patrón?** Features en `src/test/resources/features`; runners y
step definitions en `src/test/java`; tasks, questions, page objects y abilities (Cast) en
`src/main/java`.

**¿Por qué algunas pruebas son por API y otras por navegador?** Varias operaciones (autorizar,
cancelar, reembolsar, accesos cruzados) **no tienen interfaz**; el actor las ejerce con la
ability `CallAnApi`. Sigue siendo E2E sobre el sistema real.

**¿Por qué hay 5 escenarios omitidos?** Son criterios sin soporte en el producto (ledger
consolidado de administrador, detección de inconsistencias y consulta/inmutabilidad de
auditoría); se dejan trazados como pendientes.
