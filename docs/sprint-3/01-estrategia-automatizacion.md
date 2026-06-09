# 01 — Estrategia de automatización de pruebas

## Objetivo

Automatizar los escenarios de aceptación (Gherkin) de las HU priorizadas del Sprint 3
(HU 1.9 a 1.16) y ejecutarlos como pruebas **E2E** sobre el objeto de prueba, generando
evidencia reproducible.

## Pirámide de pruebas y alcance de este sprint

El Sprint 3 se enfoca en la **capa E2E** (extremo a extremo). Cada escenario de negocio se
valida atravesando el sistema completo:

- **UI E2E (navegador):** se conduce un navegador Chromium real contra el frontend Vue, que
  a su vez consume el backend Spring Boot real. Se usa para los flujos que tienen interfaz:
  crear orden, checkout del cliente, historial y balances.
- **API E2E (servicio):** se invoca el backend real por HTTP para los escenarios del ciclo
  de vida del pago que **no tienen interfaz** (autorizar, cancelar, reembolsar, validar
  accesos cruzados, comercio inactivo). Siguen siendo E2E porque ejercitan el objeto de
  prueba desplegado, no unidades aisladas.

Esta combinación es una práctica estándar: se prueba por la interfaz cuando existe, y por el
contrato de servicio cuando la funcionalidad solo está expuesta como API.

## Herramientas

| Herramienta | Uso |
|---|---|
| **Playwright** (`@playwright/test`) | Framework E2E: navegador, aserciones, reporte HTML, trazas, video y screenshots. |
| **Chromium** (gestionado por Playwright) | Navegador real para los flujos de UI. |
| **Playwright `request` fixture** | Cliente HTTP para escenarios E2E de servicio y para preparar datos. |
| **Vite dev server** | Sirve el frontend; Playwright lo levanta automáticamente (`webServer`). |
| **Spring Boot + H2 (en memoria)** | Backend real autocontenido (sin base de datos externa) con procesador de pagos *mock*. |

## Arquitectura de la suite

```
e2e/
├── helpers/
│   ├── test-data.ts   # credenciales sembradas, montos determinísticos, generador de emails únicos
│   ├── ui.ts          # acciones de UI reutilizables (login por interfaz)
│   └── api.ts         # helpers de API (registrar comercio, crear/ autorizar/ cancelar/ reembolsar...)
├── auth.spec.ts       # acceso a la plataforma (precondición transversal)
└── hu-1.NN-*.spec.ts  # un archivo por HU; un test por escenario Gherkin
```

### Convenciones

- **Un archivo por HU**, **un `test` por escenario** del Gherkin.
- Nombre de cada caso: `CP-<HU>.<n> | <descripción>` con etiqueta `[UI]` o `[API]`.
- Comentarios `Given / When / Then` dentro de cada test, espejo del Gherkin de negocio.
- **Aislamiento de datos:** los escenarios que dependen de datos crean su propio comercio
  con email único (`registerMerchant`) y sus propios cobros, de modo que la corrida es
  repetible sin depender del estado acumulado en la base H2.
- **Ejecución secuencial** (`workers: 1`) para resultados deterministas sobre un backend
  compartido.

## Determinismo del procesador de pagos

El procesador *mock* del backend se ajustó para ser **determinista** (antes decidía al azar,
lo que hacía imposible automatizar el caso feliz y el de rechazo):

- Montos cuyos centavos son exactamente `.01` → **pago RECHAZADO** (simula fondos insuficientes).
- Cualquier otro monto → **pago APROBADO**.

Esto permite automatizar de forma estable tanto la aprobación (HU 1.10 / caso feliz) como el
rechazo (HU 1.10 / fondos insuficientes). Ver [04-hallazgos-qa.md](04-hallazgos-qa.md).

## Datos de prueba sembrados

Al arrancar, el backend siembra cuentas de demostración usadas por la suite:

| Cuenta | Email | Contraseña | Rol |
|---|---|---|---|
| Comercio demo | `test@example.com` | `password` | `ROLE_MERCHANT` |
| Administrador demo | `admin@example.com` | `password` | `ROLE_ADMIN` |

La cuenta de administrador se agregó en este sprint para poder automatizar los escenarios
que requieren rol administrador (p. ej., desactivar un comercio en HU 1.9).

## Criterio de "aprobado"

Un caso se considera aprobado cuando el comportamiento observado del objeto de prueba
coincide con el `Then` del escenario de aceptación (estado HTTP, transición de estado,
mensaje o elemento visible en la interfaz).
