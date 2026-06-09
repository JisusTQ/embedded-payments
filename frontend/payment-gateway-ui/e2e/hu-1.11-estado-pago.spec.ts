import { test, expect } from '@playwright/test'
import { SEEDED_MERCHANT, API_BASE } from './helpers/test-data'
import {
  loginToken,
  createIntentOk,
  authorizeIntent,
  registerMerchant,
  createSucceededTransaction,
  getTransaction,
} from './helpers/api'

/**
 * HU 1.11 - Gestión del estado del pago
 * El comercio conoce en qué punto está el cobro que inició.
 */
test.describe('HU 1.11 - Gestión del estado del pago', () => {
  test('CP-1.11.1 | Consulta de estado exitosa: la plataforma muestra el estado actual [API]', async ({ request }) => {
    // Given el comercio tiene un cobro registrado
    const token = await loginToken(request, SEEDED_MERCHANT.email, SEEDED_MERCHANT.password)
    const intent = await createIntentOk(request, token, 90.0)
    // When consulta el estado de ese cobro
    const res = await request.get(`${API_BASE}/checkout/intents/${intent.id}`)
    // Then la plataforma le muestra el estado actual del pago
    expect(res.ok()).toBeTruthy()
    expect((await res.json()).status).toBe('CREATED')
  })

  test('CP-1.11.2 | El estado cambia después de una acción y el comercio lo ve actualizado [API]', async ({ request }) => {
    const token = await loginToken(request, SEEDED_MERCHANT.email, SEEDED_MERCHANT.password)
    // Given un cobro pendiente
    const intent = await createIntentOk(request, token, 95.0)
    const before = await request.get(`${API_BASE}/checkout/intents/${intent.id}`)
    expect((await before.json()).status).toBe('CREATED')
    // When la plataforma procesa el cobro (autorización)
    expect((await authorizeIntent(request, token, intent.id)).status()).toBe(200)
    // Then el estado cambia y el comercio puede verlo actualizado
    const after = await request.get(`${API_BASE}/checkout/intents/${intent.id}`)
    expect((await after.json()).status).toBe('SUCCEEDED')
  })

  test('CP-1.11.3 | La consulta de un cobro ajeno es denegada [API]', async ({ request }) => {
    // Given un cobro perteneciente a otro comercio
    const owner = await loginToken(request, SEEDED_MERCHANT.email, SEEDED_MERCHANT.password)
    const { transactionId } = await createSucceededTransaction(request, owner, 60.0)
    // When un comercio distinto intenta consultarlo
    const other = await registerMerchant(request, 'ajeno')
    const res = await getTransaction(request, other.token, transactionId)
    // Then la plataforma deniega el acceso a esa información
    expect(res.status(), 'no debe acceder a cobros de otro comercio').toBe(403)
  })
})
