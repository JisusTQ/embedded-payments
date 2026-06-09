# 01 — Estrategia de automatización (Serenity BDD + Screenplay + Cucumber)

## Objetivo

Automatizar los escenarios de aceptación (Gherkin) de las HU 1.9–1.16 y ejecutarlos como
pruebas **E2E** sobre el objeto de prueba, usando **BDD con Cucumber** y el **patrón Screenplay**
de **Serenity/JS** (sobre el motor de Playwright).

## El flujo completo

```
.feature (Gherkin, negocio)  ->  step definitions  ->  Actores + Tasks + Questions  ->  navegador/API reales
```

| Elemento | Implementación |
|---|---|
| **Feature / Scenario** | `e2e/features/*.feature` (uno por HU; los del documento de HU) |
| **Step definitions** | `e2e/features/step_definitions/*.steps.ts` |
| **Actor** | `actorCalled('Comercio' \| 'Administrador' \| 'Cliente' \| 'Intruso')` |
| **Ability** | `BrowseTheWebWithPlaywright`, `CallAnApi`, `TakeNotes` (Cast `Actors`) |
| **Task** | `LogIn`, `CreateAPaymentOrder`, `CreateAPaymentIntent`, `AuthorizeThePayment`, `CancelThePayment`, `RequestARefund`, `SubmitTheCheckout`, `PayTheCheckout`, … |
| **Interaction** | primitivas de Serenity: `Navigate`, `Click`, `Enter`, `Select`, `Send` |
| **Question** | `ResponseStatus`, `PaymentIntentStatus`, `NumberOfTransactions`, `TransactionHistoryRows`, … |

## Alcance E2E

Cada escenario atraviesa el sistema completo:

- **E2E por interfaz (navegador):** el actor usa `BrowseTheWebWithPlaywright` para operar el
  frontend Vue real, que consume el backend real (login, crear orden, checkout, historial, balances).
- **E2E por servicio (API):** el actor usa `CallAnApi` para ejercitar el backend real en las
  operaciones sin interfaz (autorizar, cancelar, reembolsar, accesos cruzados, comercio inactivo).

## Herramientas

| Herramienta | Uso |
|---|---|
| **@cucumber/cucumber** | Runner BDD que ejecuta los `.feature`. |
| **@serenity-js/cucumber** | Adaptador que registra los pasos en Serenity. |
| **@serenity-js/core / web / rest / assertions** | Núcleo Screenplay: actores, tareas, interacciones, preguntas, aserciones. |
| **@serenity-js/playwright** | Ability de navegador (sobre Playwright). |
| **@serenity-js/serenity-bdd + console-reporter** | Reportería (HTML BDD + consola). |
| **tsx** | Loader TypeScript/ESM para Cucumber. |
| **Spring Boot + H2 (en memoria)** | Backend real autocontenido con procesador de pagos *mock*. |

## Convenciones

- **Un `.feature` por HU**; los nombres de escenario son los del documento de HU.
- Actores con nombre por rol; escenarios con dos roles (p. ej. Comercio + Administrador,
  Comercio + Intruso) comparten datos vía el *World* de Cucumber + el notepad del actor.
- **Datos aislados:** los escenarios con datos registran su propio comercio (email único) y sus
  propios cobros mediante tasks; la corrida es repetible.
- **Ejecución secuencial** y determinista.
- Escenarios sin soporte en el producto se etiquetan **`@gap`** y se excluyen (`tags: 'not @gap'`),
  quedando documentados en el `.feature` y en la matriz de trazabilidad.

## Determinismo del procesador de pagos

El procesador *mock* del backend se hizo determinista: montos con centavos `.01` → **RECHAZADO**;
cualquier otro → **APROBADO**. Permite automatizar aprobación y rechazo (HU 1.10).
Ver [04-hallazgos-qa.md](04-hallazgos-qa.md).

## Cuentas sembradas

| Cuenta | Email | Contraseña | Rol |
|---|---|---|---|
| Comercio demo | `test@example.com` | `password` | `ROLE_MERCHANT` |
| Administrador demo | `admin@example.com` | `password` | `ROLE_ADMIN` |
