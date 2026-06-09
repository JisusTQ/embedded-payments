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

/**
 * HU 1.13 - Registro de transacciones
 * Cada movimiento de dinero queda registrado para trazabilidad completa.
 *
 * Nota: la plataforma no expone un endpoint de "admin selecciona un comercio";
 * el listado de transacciones está acotado al comercio (token). El tercer
 * escenario se verifica con ese listado acotado (ver matriz de trazabilidad).
 */
test.describe('HU 1.13 - Registro de transacciones', () => {
  test('CP-1.13.1 | Transacción registrada tras un pago exitoso [API]', async ({ request }) => {
    const merchant = await registerMerchant(request, 'tx-pago')
    // Given un pago fue procesado correctamente
    const intent = await createIntentOk(request, merchant.token, 200.0)
    expect((await submitCheckout(request, intent.id)).ok()).toBeTruthy()
    // When la plataforma confirma el cobro / Then queda registrado el movimiento
    const res = await listTransactions(request, merchant.token)
    const body = await res.json()
    expect(body.total).toBeGreaterThanOrEqual(1)
    const tx = body.items[0]
    expect(tx.amount).toBe(200.0)
    expect(['COMPLETED', 'SUCCEEDED']).toContain(tx.status)
  })

  test('CP-1.13.2 | Movimiento de salida registrado tras un reembolso [API]', async ({ request }) => {
    const merchant = await registerMerchant(request, 'tx-refund')
    // Given se procesó una devolución de dinero
    const { transactionId } = await createSucceededTransaction(request, merchant.token, 120.0)
    expect((await refundTransaction(request, merchant.token, transactionId, 30.0, 'Devolución')).status()).toBe(201)
    // When la plataforma confirma el reembolso / Then queda registrado el movimiento de salida
    const res = await listRefunds(request, merchant.token)
    const body = await res.json()
    expect(body.total).toBeGreaterThanOrEqual(1)
    expect(body.items[0].transactionId).toBe(transactionId)
  })

  test('CP-1.13.3 | Consulta de transacciones acotada al comercio [API]', async ({ request }) => {
    const merchant = await registerMerchant(request, 'tx-scope')
    const intent = await createIntentOk(request, merchant.token, 75.0)
    expect((await submitCheckout(request, intent.id)).ok()).toBeTruthy()
    // When solicita ver sus movimientos / Then sólo se muestran los de ese comercio
    const res = await listTransactions(request, merchant.token)
    const body = await res.json()
    expect(body.items.length).toBeGreaterThanOrEqual(1)
    for (const tx of body.items) {
      expect(tx.merchantId).toBe(merchant.merchantId)
    }
  })
})
