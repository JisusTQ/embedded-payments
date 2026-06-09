# 02 — Matriz de trazabilidad (HU → escenario → caso automatizado)

Leyenda de estado:
- ✅ **Automatizado y aprobado**
- ⏭️ **Omitido (gap)** — criterio sin implementación en el objeto de prueba (hallazgo de QA, ver doc 04)

Leyenda de tipo: **UI** = prueba por navegador · **API** = prueba por servicio HTTP.

| HU | Escenario de aceptación (Gherkin) | Caso | Tipo | Resultado esperado (Then) | Estado |
|----|-----------------------------------|------|------|---------------------------|--------|
| **1.9** Creación de pagos | Pago creado exitosamente | CP-1.9.1 | UI | Se genera la intención pendiente y se entrega la referencia (link de cobro) | ✅ |
| | El comercio intenta cobrar sin estar activo | CP-1.9.2 | API | La plataforma rechaza la operación (403) | ✅ |
| | El monto del cobro es inválido (cero o negativo) | CP-1.9.3 | API | La plataforma informa que el valor no es aceptable (400) | ✅ |
| **1.10** Autorización de pagos | Pago autorizado correctamente | CP-1.10.1 | UI | Aprueba el pago y muestra el recibo exitoso | ✅ |
| | Pago rechazado por fondos insuficientes | CP-1.10.2 | UI | Rechaza el pago e informa el motivo | ✅ |
| | Pago rechazado por datos inconsistentes | CP-1.10.3 | API | Rechaza la operación (404 intención inexistente) | ✅ |
| **1.11** Gestión del estado | Consulta de estado exitosa | CP-1.11.1 | API | Muestra el estado actual del pago (CREATED) | ✅ |
| | El estado cambia después de una acción | CP-1.11.2 | API | El estado pasa de CREATED a SUCCEEDED y es visible | ✅ |
| | Consulta de un cobro que no pertenece al comercio | CP-1.11.3 | API | Deniega el acceso a esa información (403) | ✅ |
| **1.12** Cancelación y reembolso | Cancelación exitosa antes del procesamiento | CP-1.12.1 | API | Cancela el cobro (estado CANCELED) | ✅ |
| | Reembolso exitoso de un pago ya procesado | CP-1.12.2 | API | Inicia la devolución y confirma la operación (201) | ✅ |
| | Intento de reembolso de un pago ya cancelado | CP-1.12.3 | API | Informa que no es posible reembolsar (4xx) | ✅ |
| **1.13** Registro de transacciones | Transacción registrada tras un pago exitoso | CP-1.13.1 | API | Queda registrado el movimiento (monto y estado) | ✅ |
| | Transacción registrada tras un reembolso | CP-1.13.2 | API | Queda registrado el movimiento de salida (reembolso) | ✅ |
| | Consulta de transacciones por comercio | CP-1.13.3 | API | Se muestra el listado de transacciones de ese comercio¹ | ✅ |
| **1.14** Historial de operaciones | Historial consultado exitosamente | CP-1.14.1 | UI | Muestra los movimientos del comercio | ✅ |
| | Filtro por rango de fechas | CP-1.14.2 | UI | Filtra el historial (por estado)² | ✅ |
| | Historial vacío | CP-1.14.3 | UI | Informa que no hay operaciones registradas | ✅ |
| **1.15** Ledger financiero | Consulta del balance general (administrador) | CP-1.15.1 | — | (sin endpoint/UI de ledger consolidado) | ⏭️ |
| | Balance por comercio | CP-1.15.2 | UI | La vista consolida los ingresos del comercio | ✅ |
| | Detección de inconsistencia en el balance | CP-1.15.3 | — | (sin verificación de consistencia) | ⏭️ |
| **1.16** Auditoría de cambios de estado | Cambio de estado registrado automáticamente | CP-1.16.1 | — | (auditoría sin API/UI de consulta) | ⏭️ |
| | Consulta del historial de auditoría | CP-1.16.2 | — | (sin endpoint/UI de consulta) | ⏭️ |
| | Intento de modificar un registro de auditoría | CP-1.16.3 | — | (sin endpoint de modificación; no verificable E2E) | ⏭️ |
| **Acceso** (precondición) | Login exitoso | CP-AUTH-01 | UI | Redirige al dashboard | ✅ |
| | Login con credenciales inválidas | CP-AUTH-02 | UI | Muestra error y permanece en login | ✅ |
| | Acceso a ruta protegida sin sesión | CP-AUTH-03 | UI | Redirige a login | ✅ |

**Totales:** 27 casos · ✅ 22 aprobados · ⏭️ 5 omitidos (gap) · ❌ 0 fallidos.

---

## Notas de mapeo

**¹ HU 1.13 — "Consulta de transacciones por comercio".**
El Gherkin lo plantea desde el rol *administrador que selecciona un comercio*. El objeto de
prueba **no expone** un endpoint de administrador para listar transacciones de un comercio
arbitrario: el listado está acotado al comercio autenticado (vía token). El caso se automatiza
verificando ese listado acotado (todas las transacciones devueltas pertenecen al comercio).
La ausencia del listado a nivel de administrador se registra como hallazgo (doc 04).

**² HU 1.14 — "Filtro por rango de fechas".**
La vista de historial de operaciones ofrece **filtro por estado** y **búsqueda por ID**, pero
**no** filtro por rango de fechas (el endpoint de transacciones ignora parámetros de fecha).
El caso se automatiza con el filtro por estado disponible (cambiar el filtro modifica el
listado mostrado). La limitación del filtro por fechas se registra como hallazgo (doc 04).

## Escenarios omitidos (gaps) — justificación

| Caso | Motivo |
|---|---|
| CP-1.15.1 | No existe endpoint ni interfaz de **ledger consolidado de la plataforma** para administrador. |
| CP-1.15.3 | No existe verificación de consistencia del ledger ni marcado de inconsistencias. |
| CP-1.16.1 | La auditoría se **persiste** internamente (`AuditEventService`) pero no se expone para verificarla por E2E. |
| CP-1.16.2 | No existe endpoint ni interfaz para **consultar** el registro de auditoría. |
| CP-1.16.3 | No existe endpoint para **modificar** auditoría; la inmutabilidad no es verificable por E2E. |

Estos casos quedan implementados como pruebas **omitidas con motivo explícito** en la suite,
de modo que aparecen en el reporte y dejan trazabilidad del criterio pendiente.
