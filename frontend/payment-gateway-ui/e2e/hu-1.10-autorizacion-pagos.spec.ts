import { test, expect, Page } from '@playwright/test'
import { SEEDED_MERCHANT, DECLINE_AMOUNT } from './helpers/test-data'
import { loginToken, createIntentOk, submitCheckout } from './helpers/api'

async function fillCheckoutForm(page: Page) {
  await page.locator('#cardholderName').fill('Alex Johnson')
  await page.locator('#cardNumber').fill('4242424242424242')
  await page.locator('#expiry').fill('1230')
  await page.locator('#cvc').fill('123')
  await page.locator('#email').fill('cliente@example.com')
}

test.describe('HU 1.10 - Autorización de pagos', () => {
  test('CP-1.10.1 | Pago autorizado correctamente y marcado como exitoso [UI checkout]', async ({ page, request }) => {
    const token = await loginToken(request, SEEDED_MERCHANT.email, SEEDED_MERCHANT.password)
    const intent = await createIntentOk(request, token, 120.0)
    await page.goto(`/pay/${intent.id}`)
    await fillCheckoutForm(page)
    await page.locator('button[type="submit"]').click()
    await expect(page.getByRole('heading', { name: /thank you/i })).toBeVisible()
    await page.screenshot({ path: 'e2e/evidencias/hu-1.10-pago-exitoso.png', fullPage: true })
  })

  test('CP-1.10.2 | Pago rechazado por fondos insuficientes [UI checkout]', async ({ page, request }) => {
    const token = await loginToken(request, SEEDED_MERCHANT.email, SEEDED_MERCHANT.password)
    const intent = await createIntentOk(request, token, DECLINE_AMOUNT)
    await page.goto(`/pay/${intent.id}`)
    await fillCheckoutForm(page)
    await page.locator('button[type="submit"]').click()
    await expect(page.getByText(/payment processing failed/i).first()).toBeVisible()
    await page.screenshot({ path: 'e2e/evidencias/hu-1.10-pago-rechazado.png', fullPage: true })
  })

  test('CP-1.10.3 | Pago rechazado por datos inconsistentes (intención inexistente) [API]', async ({ request }) => {
    const res = await submitCheckout(request, '11111111-1111-1111-1111-111111111111')
    expect(res.status(), 'una intención inexistente no se puede procesar').toBe(404)
  })
})
