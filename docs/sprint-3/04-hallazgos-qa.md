# 04 — Hallazgos de QA

La automatización E2E detectó defectos reales y vacíos de implementación. Se separan en
**(A) defectos/mejoras corregidos** durante el sprint (necesarios para poder ejecutar las
pruebas de forma estable) y **(B) gaps documentados** que quedan como pendientes del producto.

---

## A. Defectos y mejoras corregidos

### A1. Defecto — checksum de routing number mal calculado (datos bancarios)
- **Síntoma:** registrar datos bancarios con valores válidos (p. ej. routing `021000021`,
  marcado como válido en la propia especificación) devolvía `400 Bad Request`.
- **Causa:** `RoutingNumberValidator` aplicaba los pesos del checksum ABA en el orden
  incorrecto (`1,7,3` repetidos en vez del estándar `3,7,1`), rechazando routing numbers
  válidos.
- **Corrección:** se ajustaron los pesos al algoritmo ABA estándar
  (`3·(d0+d3+d6) + 7·(d1+d4+d7) + 1·(d2+d5+d8)`).
- **Archivo:** `src/.../shared/validation/RoutingNumberValidator.java`
- **Verificación:** dato válido → `200`; dato inválido → sigue devolviendo `400`.

### A2. Mejora — procesador de pagos *mock* no determinista (bloqueaba la automatización)
- **Síntoma:** el resultado del pago se decidía con `System.nanoTime() % 10` (~90% éxito
  aleatorio). Imposible automatizar de forma estable el caso feliz ni el de rechazo (HU 1.10).
- **Corrección:** comportamiento determinista — montos con centavos `.01` simulan **rechazo**;
  el resto, **aprobación** (patrón equivalente a las "tarjetas de prueba" de un gateway real).
- **Archivo:** `src/.../payment/infrastructure/processor/MockPaymentProcessor.java`

### A3. Mejora — faltaba una cuenta de administrador para escenarios admin
- **Síntoma:** los escenarios que requieren rol administrador (p. ej. desactivar un comercio,
  precondición de HU 1.9) no eran ejecutables: no existía ningún usuario `ROLE_ADMIN`.
- **Corrección:** se siembra una cuenta `admin@example.com / password` (`ROLE_ADMIN`).
- **Archivo:** `src/.../infrastructure/config/DemoDataInitializer.java`

### A4. Defecto — la vista de Balances se rompía en navegación directa o al refrescar
- **Síntoma:** al entrar directo a `/settings/balances` (o al refrescar) la página no cargaba
  el comercio (solo lo cargaba el Dashboard), quedando sin datos.
- **Corrección:** la página ahora es autosuficiente: si el comercio no está en memoria, lo
  carga a partir de la sesión al montarse.
- **Archivo:** `frontend/payment-gateway-ui/src/pages/settings/balances.vue`

---

## B. Gaps de implementación (documentados, no corregidos)

Estos hallazgos explican por qué 5 escenarios quedan **omitidos** en la suite. No se
corrigieron porque exceden el alcance del Sprint 3 (automatización), pero quedan trazados.

### B1. HU 1.10 — la autorización por API siempre aprueba
El endpoint `PATCH /api/v1/admin/payments/intents/{id}/authorize` **no** aplica el resultado
del procesador: aprueba siempre, sin importar el monto. El rechazo de un pago solo se produce
por el flujo de checkout (`POST /checkout/submit`). Por eso los escenarios de HU 1.10
(aprobado / rechazado) se automatizan vía checkout, donde el resultado sí es evaluado.

### B2. HU 1.13 — no hay listado de transacciones por comercio para administrador
`GET /api/v1/transactions` acota el resultado al comercio del token; un administrador
(sin `merchantId`) no puede listar las transacciones de un comercio elegido. No existe un
endpoint administrativo equivalente.

### B3. HU 1.14 — el historial no soporta filtro por rango de fechas
La vista de historial ofrece filtro por **estado** y búsqueda por **ID**, pero el endpoint
de transacciones ignora parámetros de fecha; no hay filtro por rango de fechas en esa vista.

### B4. HU 1.15 — no existe ledger financiero consolidado
No hay endpoint ni interfaz para el **balance general de la plataforma** (administrador) ni
para **detección de inconsistencias**. Solo existe una vista de balance **por comercio**
(consolidación de sus propias transacciones en el cliente).

### B5. HU 1.16 — auditoría sin superficie de consulta
Los eventos de auditoría se **persisten** internamente (`AuditEventService` / `AuditEvent`),
pero **no se exponen** por API ni interfaz para consultarlos ni para intentar modificarlos.
Por lo tanto, los tres criterios de auditoría no son verificables como pruebas E2E.

---

## Resumen para la sustentación

> La automatización no solo validó los criterios implementados: **encontró un defecto real**
> (checksum bancario), **hizo testeable** el flujo de pagos (procesador determinista) y
> **detectó 5 vacíos de implementación** en ledger y auditoría, que quedan trazados como
> pendientes del producto.
