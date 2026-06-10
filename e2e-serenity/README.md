# Embedded Payments - E2E (Serenity BDD + Screenplay)

End-to-end acceptance tests for the Embedded Payments platform (Sprint 3, HU 1.9 to 1.16),
built with **Serenity BDD + Cucumber + the Screenplay pattern** on **Gradle**.

## Stack

- **Gradle** + Serenity Gradle plugin
- **Cucumber** (Gherkin `.feature` files, English, with `Examples`)
- **Serenity Screenplay** (Actors, Abilities, Tasks, Questions)
- **WebDriver** (Chrome) for UI flows and **Serenity REST** for service flows

## Screenplay layout

| Layer | Location |
|---|---|
| Features (Gherkin) | `src/test/resources/features/**` |
| Step definitions | `src/test/java/.../stepdefinitions` |
| Runners (JUnit 5 suites) | `src/test/java/.../runners` |
| Hooks (stage / cast) | `src/test/java/.../hooks` |
| Tasks | `src/main/java/.../tasks` |
| Questions | `src/main/java/.../questions` |
| UI page objects (Targets) | `src/main/java/.../ui` |
| Model / Config | `src/main/java/.../model`, `.../config` |

Actors: **Merchant**, **Administrator**, **Customer**, **Intruder** — each able to
`BrowseTheWebWithPlaywright`/WebDriver, `CallAnApi` and `TakeNotes`.

## Prerequisites

- **JDK 17+** (a JDK 21 is fine)
- **Gradle 8.5+**
- The application under test running locally:
  - Backend on `http://localhost:8085` (`./mvnw spring-boot:run` from the repository root)
  - Frontend on `http://localhost:5173` (`npm run dev` in `frontend/payment-gateway-ui`)

The seeded accounts used by the tests are `test@example.com / password` (merchant) and
`admin@example.com / password` (administrator).

## How to run

From this folder (`e2e-serenity/`), with the app running:

```bash
# 1. (first time only) generate the Gradle wrapper if you do not have one
gradle wrapper --gradle-version 8.8

# 2. run the whole suite (Chrome headless) and build the Serenity report
gradle clean test

# run a single module
gradle clean test --tests "*PaymentsRunner"

# run with a visible browser
gradle clean test -Dheadless=false

# point to different hosts
gradle clean test -Dfrontend.url=http://localhost:5173 -Dapi.url=http://localhost:8085
```

If you already have a wrapper, use `./gradlew clean test` (or `gradlew.bat` on Windows).

## Report

The Serenity BDD report is generated at:

```
target/site/serenity/index.html
```

## Tags

- `@gap` scenarios (ledger general balance / inconsistency detection and audit trail) are
  documented in the `.feature` files but excluded from execution because the platform does not
  implement them yet. They are quality findings, not failures. The default test task runs
  `not @gap`.
