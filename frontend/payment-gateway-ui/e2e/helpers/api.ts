import { APIRequestContext, expect } from '@playwright/test'
import { API_BASE, SEEDED_ADMIN, uniqueEmail } from './test-data'

/**
 * Helpers de API para preparar datos de prueba y para los escenarios E2E a nivel
 * de servicio (operaciones del ciclo de vida del pago que no tienen interfaz:
 * autorizar, cancelar, reembolsar, accesos cruzados, etc.).
 */

export interface MerchantSession {
  email: string
  password: string
  merchantId: string
  token: string
  authHeader: { Authorization: string }
}

export async function loginToken(request: APIRequestContext, email: string, password: string): Promise<string> {
  const res = await request.post(`${API_BASE}/api/v1/auth/login`, { data: { email, password } })
  expect(res.ok(), `login API falló para ${email} (status ${res.status()})`).toBeTruthy()
  return (await res.json()).token as string
}

export async function adminToken(request: APIRequestContext): Promise<string> {
  return loginToken(request, SEEDED_ADMIN.email, SEEDED_ADMIN.password)
}

/** Registra un comercio nuevo (ACTIVO) y devuelve su sesión lista para usar. */
export async function registerMerchant(request: APIRequestContext, prefix = 'merchant'): Promise<MerchantSession> {
  const email = uniqueEmail(prefix)
  const password = 'password123'
  const res = await request.post(`${API_BASE}/api/v1/auth/register`, {
    data: {
      email,
      password,
      role: 'MERCHANT',
      merchantName: `QA ${prefix} ${Date.now()}`,
      contactName: 'QA Contact',
      contactEmail: uniqueEmail(`${prefix}.contact`),
    },
  })
  expect(res.ok(), `registro falló (status ${res.status()})`).toBeTruthy()
  const body = await res.json()
  const token = await loginToken(request, email, password)
  return {
    email,
    password,
    merchantId: body.merchantId,
    token,
    authHeader: { Authorization: `Bearer ${token}` },
  }
}

export async function createIntent(
  request: APIRequestContext,
  token: string,
  amount: number,
  currency = 'USD',
  description = 'E2E intent'
) {
  const res = await request.post(`${API_BASE}/api/v1/admin/payments/intents`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { amount, currency, description },
  })
  return res
}

/** Crea una intención y verifica que quedó CREATED; devuelve el cuerpo. */
export async function createIntentOk(request: APIRequestContext, token: string, amount: number, currency = 'USD') {
  const res = await createIntent(request, token, amount, currency)
  expect(res.status(), 'crear intent debería ser 201').toBe(201)
  return await res.json()
}

/** Procesa un pago por el flujo público de checkout (cliente paga). */
export async function submitCheckout(request: APIRequestContext, intentId: string, email = 'buyer@example.com', name = 'Buyer QA') {
  return request.post(`${API_BASE}/checkout/submit`, {
    data: { checkoutId: intentId, customerEmail: email, customerName: name },
  })
}

export async function authorizeIntent(request: APIRequestContext, token: string, intentId: string) {
  return request.patch(`${API_BASE}/api/v1/admin/payments/intents/${intentId}/authorize`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function cancelIntent(request: APIRequestContext, token: string, intentId: string) {
  return request.patch(`${API_BASE}/api/v1/admin/payments/intents/${intentId}/cancel`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function refundTransaction(request: APIRequestContext, token: string, transactionId: string, amount: number, reason = 'cliente') {
  return request.post(`${API_BASE}/api/v1/refunds`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { transactionId, amount, reason },
  })
}

export async function listTransactions(request: APIRequestContext, token: string, query = '') {
  return request.get(`${API_BASE}/api/v1/transactions${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function listRefunds(request: APIRequestContext, token: string) {
  return request.get(`${API_BASE}/api/v1/refunds`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function getTransaction(request: APIRequestContext, token: string, id: string) {
  return request.get(`${API_BASE}/api/v1/transactions/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function deactivateMerchant(request: APIRequestContext, admin: string, merchantId: string) {
  return request.patch(`${API_BASE}/api/v1/merchants/${merchantId}/deactivate`, {
    headers: { Authorization: `Bearer ${admin}` },
    data: { reason: 'Suspensión por QA' },
  })
}

/**
 * Crea una intención y la lleva hasta una transacción SUCCEEDED (vía autorización),
 * devolviendo { intentId, transactionId } para escenarios de reembolso.
 */
export async function createSucceededTransaction(request: APIRequestContext, token: string, amount: number) {
  const intent = await createIntentOk(request, token, amount)
  const res = await authorizeIntent(request, token, intent.id)
  expect(res.status(), 'autorizar debería ser 200').toBe(200)
  const tx = await res.json()
  return { intentId: intent.id, transactionId: tx.id as string, amount }
}
