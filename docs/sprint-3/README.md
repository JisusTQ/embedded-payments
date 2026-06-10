# Sprint 3 — Automatización E2E (Serenity BDD + Screenplay + Gradle)

Entregables de la rúbrica:

1. **Automatizar los escenarios** de aceptación de las HU (1.9 a 1.16).
2. **Ejecutar las pruebas E2E** sobre el objeto de prueba.

## Suite de pruebas (Java + Gradle)

La suite está implementada como un proyecto **Java + Gradle** con **Serenity BDD + Cucumber +
patrón Screenplay** (WebDriver para la interfaz y Serenity REST para la API), en:

```
e2e-serenity/
```

Ver **[e2e-serenity/README.md](../../e2e-serenity/README.md)** para la estructura completa
(features, step definitions, runners, hooks, tasks, questions, ui) y la guía de ejecución.

### Ejecución rápida

```bash
# 1. Backend (raíz del repo)
./mvnw spring-boot:run                 # http://localhost:8085

# 2. Frontend
cd frontend/payment-gateway-ui && npm run dev   # http://localhost:5173

# 3. Pruebas E2E (carpeta e2e-serenity)
cd e2e-serenity
gradle clean test
```

Reporte Serenity BDD: `e2e-serenity/target/site/serenity/index.html`.

## Documentos de apoyo

| Documento | Descripción |
|---|---|
| [02-matriz-trazabilidad.md](02-matriz-trazabilidad.md) | Mapeo HU → escenario → caso (vigente: mismos escenarios y gaps). |
| [04-hallazgos-qa.md](04-hallazgos-qa.md) | Defectos corregidos y gaps de implementación detectados (vigente). |
| [05-guion-exposicion.md](05-guion-exposicion.md) | Guion para la sustentación. |

> Nota: el patrón Screenplay y la cobertura por HU son los mismos descritos en la matriz; lo que
> cambió es el stack de implementación (de TypeScript/Serenity-JS a **Java/Gradle/Serenity BDD**,
> que es el estándar evaluado). Los escenarios `@gap` (HU 1.15 balance general/inconsistencia y
> HU 1.16 auditoría) quedan documentados en los `.feature` y excluidos de la ejecución.
