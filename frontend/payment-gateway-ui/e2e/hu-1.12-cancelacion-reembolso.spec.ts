import { test, expect } from '@playwright/test'
import { SEEDED_MERCHANT } from './helpers/test-data'
import { loginToken, createIntentOk, cancelIntent, createSucceededTransaction, refundTransaction } from './helpers/api'

test.describe('HU 1.12 - Cancelación y reembolso', () => {
  test('CP-1.12.1 | Cancelación exitosa antes del procesamiento [API]', async ({ request }) => {
    const token = await loginToken(request, SEEDED_MERCHANT.email, SEEDED_MERCHANT.password)
    const intent = await createIntentOk(request, token, 30.0)
    const res = await cancelIntent(request, token, intent.id)
    expect(res.status()).toBe(200)
    expect((await res.json()).status).toBe('CANCELED')
  })

  test('CP-1.12.2 | Reembolso exitoso de un pago ya procesado [API]', async ({ request }) => {
    const token = await loginToken(request, SEEDED_MERCHANT.email, SEEDED_MERCHANT.password)
    const { transactionId } = await createSucceededTransaction(request, token, 80.0)
    const res = await refundTransaction(request, token, transactionId, 20.0, 'Cliente insatisfecho')
    expect(res.status(), 'el reembolso debe crearse').toBe(201)
    expect((await res.json()).transactionId).toBe(transactionId)
  })

  test('CP-1.12.3 | Intento de reembolso de un pago ya cancelado no es posible [API]', async ({ request }) => {
    const token = await loginToken(request, SEEDED_MERCHANT.email, SEEDED_MERCHANT.password)
    const intent = await createIntentOk(request, token, 40.0)
    expect((await cancelIntent(request, token, intent.id)).status()).toBe(200)
    const res = await refundTransaction(request, token, intent.id, 5.0, 'x')
    expect(res.status(), 'no se puede reembolsar un cobro cancelado').toBeGreaterThanOrEqual(400)
  })
})
