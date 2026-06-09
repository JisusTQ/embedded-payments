import { test, expect } from '@playwright/test'
import { SEEDED_MERCHANT } from './helpers/test-data'
import { loginAndExpectDashboard } from './helpers/ui'
import { registerMerchant, adminToken, deactivateMerchant, createIntent } from './helpers/api'

/**
 * HU 1.9 - Creación de pagos
 * Como comercio activo quiero iniciar un cobro a un cliente.
 */
test.describe('HU 1.9 - Creación de pagos', () => {
  test('CP-1.9.1 | Pago creado exitosamente: el comercio activo genera la intención y recibe la referencia [UI]', async ({ page }) => {
    // Given el comercio está activo y autenticado
    await loginAndExpectDashboard(page, SEEDED_MERCHANT.email, SEEDED_MERCHANT.password)
    // When registra un cobro con monto y moneda válidos
    await page.goto('/create-order')
    await page.locator('#amount').fill('149.90')
    await page.locator('#currency').selectOption('USD')
    await page.locator('#description').fill('Orden de prueba E2E')
    await page.getByRole('button', { name: /create payment order/i }).click()
    // Then la plataforma genera una intención de pago pendiente y entrega la referencia del cobro
    await expect(page.getByRole('heading', { name: /payment order created/i })).toBeVisible()
    await expect(page.locator('input[readonly]')).toHaveValue(/\/pay\/[0-9a-f-]{36}/i)
    await page.screenshot({ path: 'e2e/evidencias/hu-1.9-pago-creado.png', fullPage: true })
  })

  test('CP-1.9.2 | El comercio inactivo no puede registrar un cobro (la plataforma rechaza) [API]', async ({ request }) => {
    // Given el comercio está inactivo
    const merchant = await registerMerchant(request, 'inactivo')
    const admin = await adminToken(request)
    expect((await deactivateMerchant(request, admin, merchant.merchantId)).ok()).toBeTruthy()
    // When intenta registrar un cobro
    const res = await createIntent(request, merchant.token, 50, 'USD')
    // Then la plataforma rechaza la operación
    expect(res.status(), 'un comercio inactivo no debe poder cobrar').toBe(403)
  })

  test('CP-1.9.3 | El monto del cobro es inválido (cero o negativo) y la plataforma lo rechaza [API]', async ({ request }) => {
    // Given el comercio está activo
    const merchant = await registerMerchant(request, 'monto')
    // When registra un cobro con monto en cero o negativo / Then no es aceptable
    expect((await createIntent(request, merchant.token, 0, 'USD')).status(), 'monto 0 no es aceptable').toBe(400)
    expect((await createIntent(request, merchant.token, -10, 'USD')).status(), 'monto negativo no es aceptable').toBe(400)
  })
})
