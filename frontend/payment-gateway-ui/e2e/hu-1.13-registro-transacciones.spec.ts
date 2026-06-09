import { test, expect } from '@playwright/test'
import {
  registerMerchant,
  createIntentOk,
  submitCheckout,
  createSucceededTransaction,
  refundTransaction,
  listTransactions,
  listRefunds,
} from './helpers/api'

test.describe('HU 1.13 - Registro de transacciones', () => {
  test('CP-1.13.1 | Transacción registrada tras un pago exitoso [API]', async ({ request }) => {
    const merchant = await registerMerchant(request, 'tx-pago')
    const intent = await createIntentOk(request, merchant.token, 200.0)
    expect((await submitCheckout(request, intent.id)).ok()).toBeTruthy()
    const body = await (await listTransactions(request, merchant.token)).json()
    expect(body.total).toBeGreaterThanOrEqual(1)
    expect(body.items[0].amount).toBe(200.0)
    expect(['COMPLETED', 'SUCCEEDED']).toContain(body.items[0].status)
  })

  test('CP-1.13.2 | Movimiento de salida registrado tras un reembolso [API]', async ({ request }) => {
    const merchant = await registerMerchant(request, 'tx-refund')
    const { transactionId } = await createSucceededTransaction(request, merchant.token, 120.0)
    expect((await refundTransaction(request, merchant.token, transactionId, 30.0, 'Devolución')).status()).toBe(201)
    const body = await (await listRefunds(request, merchant.token)).json()
    expect(body.total).toBeGreaterThanOrEqual(1)
    expect(body.items[0].transactionId).toBe(transactionId)
  })

  test('CP-1.13.3 | Consulta de transacciones acotada al comercio [API]', async ({ request }) => {
    const merchant = await registerMerchant(request, 'tx-scope')
    const intent = await createIntentOk(request, merchant.token, 75.0)
    expect((await submitCheckout(request, intent.id)).ok()).toBeTruthy()
    const body = await (await listTransactions(request, merchant.token)).json()
    expect(body.items.length).toBeGreaterThanOrEqual(1)
    for (const tx of body.items) {
      expect(tx.merchantId).toBe(merchant.merchantId)
    }
  })
})
