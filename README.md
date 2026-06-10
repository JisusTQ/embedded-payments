# Embedded Payments — Análisis E2E (Sprint 3, Calidad de Software)

Este repositorio está enfocado en el **análisis y la automatización de pruebas End‑to‑End (E2E)**
de la plataforma *Embedded Payments*, correspondiente al **Sprint 3** del curso de Calidad de
Software (HU 1.9 a 1.16).

La suite E2E está construida con **Serenity BDD + Cucumber + patrón Screenplay (Java + Gradle)** y
vive en [`e2e-serenity/`](e2e-serenity/README.md). El resto del repositorio es la **aplicación bajo
prueba** (backend Spring Boot + frontend Vue 3), que se levanta localmente para que las pruebas la
ejerciten de extremo a extremo (navegador + API).

## Estructura del repositorio

| Carpeta | Propósito |
|---|---|
| **`e2e-serenity/`** | **Suite E2E (el foco): Serenity BDD + Cucumber + Screenplay.** |
| `docs/sprint-3/` | Entregables del Sprint 3: matriz de trazabilidad, hallazgos de QA y guion. |
| `src/`, `frontend/` | Aplicación bajo prueba (Spring Boot + Vue), que sirve de objeto de prueba. |
| `db/`, `scripts/` | Esquemas/datos de apoyo y utilidades para levantar el entorno. |

## Qué automatiza

Las HU 1.9–1.16 (creación de pagos, autorización, estado, cancelación/reembolso, registro de
transacciones, historial, ledger y auditoría), con `Scenario Outline` + `Examples`, en inglés y
con el patrón Screenplay (Actores, Abilities, Tasks, Questions). Detalle en
[docs/sprint-3/](docs/sprint-3/README.md) y [e2e-serenity/README.md](e2e-serenity/README.md).

## Cómo ejecutar el análisis E2E

Requisitos: **JDK 17+**, **Gradle 8.5+**, **Node 18+** y Chrome.

```bash
# 1) Levantar la aplicación bajo prueba (objeto de prueba)
./mvnw spring-boot:run                                   # backend  -> http://localhost:8085
cd frontend/payment-gateway-ui && npm install && npm run dev   # frontend -> http://localhost:5173

# 2) Ejecutar la suite E2E (en otra terminal)
cd e2e-serenity
gradle clean test          # o ./gradlew clean test si ya existe el wrapper
```

> Atajo: `scripts/run-e2e.ps1` levanta backend + frontend (el objeto de prueba) para que solo
> tengas que correr Gradle en `e2e-serenity/`.

Reporte Serenity BDD: `e2e-serenity/target/site/serenity/index.html`.

### Cuentas sembradas (para las pruebas)

| Cuenta | Email | Contraseña | Rol |
|---|---|---|---|
| Comercio | `test@example.com` | `password` | `ROLE_MERCHANT` |
| Administrador | `admin@example.com` | `password` | `ROLE_ADMIN` |

## Aplicación bajo prueba (contexto)

Plataforma de pagos embebidos: **Spring Boot** (Java 21, H2 en memoria para desarrollo,
procesador de pagos *mock*) + **Vue 3 / Vite**. Expone autenticación JWT, gestión de comercios,
intenciones de pago, transacciones, reembolsos y un checkout embebido. Se usa únicamente como
objeto de prueba para el análisis E2E de este repositorio.
