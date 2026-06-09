# Embedded Payments Platform

Plataforma de pagos embebidos construida con Spring Boot y Vue 3. Proporciona una API REST completa para procesamiento de pagos con dashboard merchant integrado.

## 🚀 Quick Start

### Requisitos
- Java 21+
- Node.js 18+
- Maven (mvnw incluido)
- PostgreSQL (opcional, H2 en desarrollo)

### Backend
```bash
./mvnw spring-boot:run
# Servidor en http://localhost:8085
# Swagger en http://localhost:8085/swagger-ui/index.html
```

### Frontend
```bash
cd frontend/payment-gateway-ui
npm install
npm run dev
# Aplicación en http://localhost:5173
```

## 📱 Demo en Nube

El servicio está desplegado en Render:
- **URL**: https://embedded-payments-1.onrender.com
- **Swagger**: https://embedded-payments-1.onrender.com/swagger-ui/index.html
- **API Docs**: https://embedded-payments-1.onrender.com/v3/api-docs

## ✨ Características

- ✅ Autenticación JWT
- ✅ Gestión de comercios (merchants)
- ✅ Intenciones de pago
- ✅ Procesamiento de transacciones
- ✅ Reembolsos (refunds)
- ✅ Dashboard merchant responsive
- ✅ API REST completamente documentada
- ✅ Notificaciones global
- ✅ Error handling robusto
- ✅ **Nuevo**: Embedded checkout flow (public payment links)
- ✅ **Nuevo**: Mock payment processor para testing

## 🏗️ Arquitectura

### Backend
```
com.paymentplatform.embeddedpayments
├── auth/              # Autenticación
├── merchant/          # Gestión de comercios
├── payment/           # Intenciones de pago
├── transaction/       # Procesamiento de transacciones
├── refund/            # Reembolsos
├── shared/            # Shared modules (security, audit, logging)
└── infrastructure/    # Config, persistence, webhooks
```

**Capas**:
- `api`: Controllers REST
- `application`: Use cases
- `domain`: Entities y business logic
- `infrastructure`: Implementaciones de repositorio

### Frontend
- **Framework**: Vue 3 (Composition API)
- **Build**: Vite 4.5
- **Styling**: Tailwind CSS v4
- **State**: Pinia
- **HTTP**: Axios

## 🔐 API Endpoints

### Autenticación
- `POST /api/v1/auth/register` - Registrar usuario
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Obtener usuario actual

### Merchants
- `POST /api/v1/merchants` - Registrar comercio (retorna api_key)
- `GET /api/v1/merchants/{id}` - Obtener comercio

### Pagos
- `POST /api/v1/payments/intents` - Crear payment intent
- `POST /api/v1/transactions` - Crear transacción (requiere X-API-Key)
- `GET /api/v1/transactions` - Listar transacciones (protegido)
- `GET /api/v1/transactions/{id}` - Obtener transacción (protegido)

### Embedded Checkout (NUEVO)
- `GET /checkout/intents/{id}` - Obtener intent de pago (público)
- `POST /checkout/submit` - Procesar pago (público)

### Reembolsos
- `POST /api/v1/refunds` - Crear reembolso
- `GET /api/v1/refunds/{id}` - Obtener reembolso

### Webhooks
- `POST /api/v1/webhooks` - Crear webhook
- `GET /api/v1/webhooks` - Listar webhooks

## 🔑 Autenticación

### JWT Authentication
Para endpoints de usuario: usar Bearer token en Authorization header
```http
Authorization: Bearer <jwt_token>
```

### API Key Authentication
Para merchant APIs: usar header X-API-Key (obtenido al registrar comercio)
```http
X-API-Key: epk_<key-id>_<secret>
```

## 🛒 Embedded Checkout Flow (NUEVO)

Flujo completo de pago sin redirecciones externas:

1. **Merchant**: Crea payment intent con monto específico
2. **Customer**: Accede a link de pago (public)
3. **Customer**: Ingresa email y nombre
4. **Transaction**: Se procesa automáticamente
5. **Dashboard**: Merchant ve la transacción

### Endpoints
- `GET /checkout/intents/{id}` - Obtener datos de pago (público)
- `POST /checkout/submit` - Procesar pago (público)

### Documentación Completa
Ver: **docs/CHECKOUT_FLOW.md** y **docs/QUICK_START.md**

**Testing Local**:
```bash
./scripts/test_checkout_flow.sh
```

## 🧪 Testing

```bash
# Backend tests
./mvnw test

# Frontend tests
cd frontend/payment-gateway-ui
npm run test

# Build frontend
npm run build
```

### Pruebas E2E automatizadas (Sprint 3 — patrón Screenplay con Serenity/JS)

Suite E2E que automatiza los criterios de aceptación de las HU 1.9–1.16 (creación de pagos,
autorización, estado, cancelación/reembolso, transacciones, historial, ledger y auditoría)
con el **patrón Screenplay** (Actores, Abilities, Tasks, Questions) usando **Serenity/JS**.

```bash
# Un solo comando (levanta backend + frontend, corre la suite, genera reporte y limpia)
powershell -ExecutionPolicy Bypass -File scripts/run-e2e.ps1

# o, con el backend ya corriendo:
cd frontend/payment-gateway-ui && npm run test:e2e && npm run serenity:report
```

Reporte Serenity BDD: `frontend/payment-gateway-ui/target/site/serenity/index.html`.
Documentación, matriz de trazabilidad y guía de exposición: **[docs/sprint-3/](docs/sprint-3/README.md)**.

## 📦 Docker

### Build
```bash
docker build -t embedded-payments .
```

### Run
```bash
docker run --rm -p 8085:8085 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/embeddedpayments \
  -e SPRING_DATASOURCE_USERNAME=postgres \
  -e SPRING_DATASOURCE_PASSWORD=postgres \
  -e JWT_SECRET=change-this-secret-key-change-this-secret-key \
  embedded-payments
```

## 🌐 Deployment

### Render
El proyecto está configurado para Render con `render.yaml`:

Variables de entorno requeridas:
- `SPRING_DATASOURCE_URL` - PostgreSQL connection
- `SPRING_DATASOURCE_USERNAME` - DB user
- `SPRING_DATASOURCE_PASSWORD` - DB password
- `JWT_SECRET` - JWT signing secret
- `SPRING_JPA_HIBERNATE_DDL_AUTO=none` - No auto-migrate en producción

## 📚 Documentación

Para detalles adicionales:
- **SPRINT_SUMMARY.md** - Resumen de incrementos del sprint
- **GETTING_STARTED.md** - Guía de inicio rápido
- **docs/** - Documentación técnica detallada
- **frontend/README.md** - Documentación del frontend

## 🔄 Git Workflow

Main branches:
- `main` - Código estable
- `develop` - Integración

Feature branches:
- `feature/auth-module`
- `feature/merchant-module`
- `feature/payment-module`
- `feature/transaction-module`
- `feature/refund-module`

## 📝 Convención de Commits

- `feat:` nueva feature
- `fix:` bugfix
- `refactor:` mejora interna
- `docs:` cambios en documentación
- `chore:` tooling o config

## 🎨 UI/UX

El frontend cuenta con:
- Diseño moderno con Tailwind CSS v4
- Paleta de colores neutral (slate)
- Componentes responsivos
- Animaciones fluidas
- Error handling visual
- Notificaciones globales

## 📊 Sprint Completado

✅ 6 HUs implementadas
✅ Backend REST API funcional
✅ Frontend responsivo y moderno
✅ Documentación técnica
✅ Deployment en nube
✅ Tests configurados

**Estado**: 🟢 LISTO PARA REVIEW

---

**Versión**: 1.0.0
**Fecha**: 2026-05-04
**Licencia**: MIT
