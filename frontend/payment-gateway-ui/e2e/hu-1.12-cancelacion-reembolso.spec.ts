import { test, expect } from '@playwright/test'
import { SEEDED_MERCHANT } from './helpers/test-data'
import {
  loginToken,
  createIntentOk,
  cancelIntent,
  createSucceededTransaction,
  refundTransaction,
} from './helpers/api'

/**
 * HU 1.12 - Cancelación y reembolso
 * El comercio puede cancelar un cobro o devolver el dinero al cliente.
 */
test.describe('HU 1.12 - Cancelación y reembolso', () => {
  test('CP-1.12.1 | Cancelación exitosa antes del procesamiento [API]', async ({ request }) => {
    // Given existe un cobro que aún no fue procesado
    const token = await loginToken(request, SEEDED_MERCHANT.email, SEEDED_MERCHANT.password)
    const intent = await createIntentOk(request, token, 30.0)
    // When el comercio solicita cancelarlo
    const res = await cancelIntent(request, token, intent.id)
    // Then la plataforma lo cancela y ningún cobro se realiza
    expect(res.status()).toBe(200)
    expect((await res.json()).status).toBe('CANCELED')
  })

  test('CP-1.12.2 | Reembolso exitoso de un pago ya procesado [API]', async ({ request }) => {
    // Given un cobro fue procesado exitosamente
    const token = await loginToken(request, SEEDED_MERCHANT.email, SEEDED_MERCHANT.password)
    const { transactionId } = await createSucceededTransaction(request, token, 80.0)
    // When el comercio solicita devolver el dinero al cliente
    const res = await refundTransaction(request, token, transactionId, 20.0, 'Cliente insatisfecho')
    // Then la plataforma inicia la devolución y confirma la operación
    expect(res.status(), 'el reembolso debe crearse').toBe(201)
    expect((await res.json()).transactionId).toBe(transactionId)
  })

  test('CP-1.12.3 | Intento de reembolso de un pago ya cancelado no es posible [API]', async ({ request }) => {
    // Given un cobro está cancelado
    const token = await loginToken(request, SEEDED_MERCHANT.email, SEEDED_MERCHANT.password)
    const intent = await createIntentOk(request, token, 40.0)
    expect((await cancelIntent(request, token, intent.id)).status()).toBe(200)
    // When el comercio intenta reembolsarlo (un cobro cancelado no produjo transacción)
    const res = await refundTransaction(request, token, intent.id, 5.0, 'x')
    // Then la plataforma informa que no es posible reembolsar ese cobro
    expect(res.status(), 'no se puede reembolsar un cobro cancelado').toBeGreaterThanOrEqual(400)
  })
})
