# Sprint 3 — Automatización de pruebas E2E (Calidad de Software)

Este sprint cubre los dos entregables de la rúbrica:

1. **Automatizar los escenarios de los casos de prueba** según los criterios de aceptación de las HU.
2. **Ejecutar las pruebas automatizadas (E2E)** sobre el objeto de prueba.

**Objeto de prueba:** plataforma *Embedded Payments* (backend Spring Boot + frontend Vue 3).
**HU priorizadas del Sprint 3:** HU 1.9 a HU 1.16 (creación de pagos, autorización, estado,
cancelación/reembolso, registro de transacciones, historial, ledger y auditoría).

## Resultado de la ejecución

| Métrica | Valor |
|---|---|
| Casos automatizados ejecutados | **27** (24 de las HU + 3 de acceso/login) |
| ✅ Aprobados | **22** |
| ⏭️ Omitidos (gap de implementación documentado) | **5** |
| ❌ Fallidos | **0** |
| Duración total | ~16 s |
| Cobertura de escenarios automatizables | **19/19 (100%)** |
| Cobertura sobre el total de escenarios HU | **19/24 (79%)** |

> Los 5 casos omitidos corresponden a criterios sin implementación en el objeto de
> prueba (ledger consolidado de administrador, detección de inconsistencias y consulta/
> inmutabilidad de auditoría). Se documentan como **hallazgos de QA**, no como fallos.

## Herramienta de automatización

- **Playwright** (navegador Chromium real) para los flujos de interfaz (UI E2E).
- **Playwright `request`** (cliente HTTP) para los escenarios de servicio que no tienen
  interfaz (autorizar, cancelar, reembolsar, accesos cruzados, comercio inactivo).

Ambos enfoques ejercitan el objeto de prueba **de extremo a extremo**: el de UI desde el
navegador contra el frontend+backend reales; el de API contra el backend real.

## Contenido de esta carpeta

| Documento | Descripción |
|---|---|
| [01-estrategia-automatizacion.md](01-estrategia-automatizacion.md) | Estrategia, alcance, herramientas, arquitectura de la suite y convenciones. |
| [02-matriz-trazabilidad.md](02-matriz-trazabilidad.md) | Mapeo HU → escenario (Gherkin) → caso automatizado → estado. |
| [03-guia-ejecucion.md](03-guia-ejecucion.md) | Cómo ejecutar la suite y dónde ver el reporte/evidencias. |
| [04-hallazgos-qa.md](04-hallazgos-qa.md) | Defectos corregidos y gaps de implementación detectados por la automatización. |
| [05-guion-exposicion.md](05-guion-exposicion.md) | Guion sugerido para la sustentación del Sprint 3. |

## Dónde está el código de las pruebas

```
frontend/payment-gateway-ui/
├── playwright.config.ts        # configuración E2E
└── e2e/
    ├── helpers/                # utilidades (login UI, helpers de API, datos)
    ├── auth.spec.ts            # acceso a la plataforma (precondición)
    ├── hu-1.09-creacion-pagos.spec.ts
    ├── hu-1.10-autorizacion-pagos.spec.ts
    ├── hu-1.11-estado-pago.spec.ts
    ├── hu-1.12-cancelacion-reembolso.spec.ts
    ├── hu-1.13-registro-transacciones.spec.ts
    ├── hu-1.14-historial-operaciones.spec.ts
    ├── hu-1.15-ledger-financiero.spec.ts
    ├── hu-1.16-auditoria.spec.ts
    ├── evidencias/             # capturas PNG de los flujos UI
    └── report/                 # reporte HTML + results.json (generado)
```
