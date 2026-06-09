import { test, expect, Page } from '@playwright/test'
import { SEEDED_MERCHANT, DECLINE_AMOUNT } from './helpers/test-data'
import { loginToken, createIntentOk, submitCheckout } from './helpers/api'

/**
 * HU 1.10 - Autorización de pagos
 * La plataforma verifica que un cobro cumple las condiciones para ser procesado.
 * Se ejercita a través del flujo público de checkout (el cliente paga).
 */

async function fillCheckoutForm(page: Page) {
  await page.locator('#cardholderName').fill('Alex Johnson')
  await page.locator('#cardNumber').fill('4242424242424242')
  await page.locator('#expiry').fill('1230')
  await page.locator('#cvc').fill('123')
  await page.locator('#email').fill('cliente@example.com')
}

test.describe('HU 1.10 - Autorización de pagos', () => {
  test('CP-1.10.1 | Pago autorizado correctamente y marcado como exitoso [UI checkout]', async ({ page, request }) => {
    // Given existe una intención de pago pendiente
    const token = await loginToken(request, SEEDED_MERCHANT.email, SEEDED_MERCHANT.password)
    const intent = await createIntentOk(request, token, 120.0)
    // When la plataforma evalúa las condiciones del cobro (el cliente paga)
    await page.goto(`/pay/${intent.id}`)
    await fillCheckoutForm(page)
    await page.locator('button[type="submit"]').click()
    // Then aprueba el pago y lo marca como autorizado (recibo de pago exitoso)
    await expect(page.getByRole('heading', { name: /thank you/i })).toBeVisible()
    await page.screenshot({ path: 'e2e/evidencias/hu-1.10-pago-exitoso.png', fullPage: true })
  })

  test('CP-1.10.2 | Pago rechazado por fondos insuficientes [UI checkout]', async ({ page, request }) => {
    // Given existe una intención de pago pendiente
    const token = await loginToken(request, SEEDED_MERCHANT.email, SEEDED_MERCHANT.password)
    const intent = await createIntentOk(request, token, DECLINE_AMOUNT) // dispara rechazo determinista
    // When los fondos disponibles no cubren el monto
    await page.goto(`/pay/${intent.id}`)
    await fillCheckoutForm(page)
    await page.locator('button[type="submit"]').click()
    // Then la plataforma rechaza el pago e informa el motivo
    await expect(page.getByText(/payment processing failed/i).first()).toBeVisible()
    await page.screenshot({ path: 'e2e/evidencias/hu-1.10-pago-rechazado.png', fullPage: true })
  })

  test('CP-1.10.3 | Pago rechazado por datos inconsistentes (intención inexistente) [API]', async ({ request }) => {
    // Given existe una intención de pago con información incorrecta / inexistente
    // When la plataforma intenta autorizarlo
    const res = await submitCheckout(request, '11111111-1111-1111-1111-111111111111')
    // Then rechaza la operación e informa el problema encontrado
    expect(res.status(), 'una intención inexistente no se puede procesar').toBe(404)
  })
})
