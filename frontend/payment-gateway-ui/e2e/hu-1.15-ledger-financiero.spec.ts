import { test, expect } from '@playwright/test'
import { loginAndExpectDashboard } from './helpers/ui'
import { registerMerchant, createIntentOk, submitCheckout } from './helpers/api'

test.describe('HU 1.15 - Ledger financiero', () => {
  test('CP-1.15.1 | Consulta del balance general de la plataforma (admin)', async () => {
    test.skip(true, 'GAP: no existe endpoint/UI de ledger consolidado de plataforma para administrador.')
  })

  test('CP-1.15.2 | Balance por comercio: la vista consolida ingresos del comercio [UI]', async ({ page, request }) => {
    const merchant = await registerMerchant(request, 'balance')
    const intent = await createIntentOk(request, merchant.token, 250.0)
    expect((await submitCheckout(request, intent.id)).ok()).toBeTruthy()
    await loginAndExpectDashboard(page, merchant.email, merchant.password)
    await page.goto('/settings/balances')
    await expect(page.getByRole('heading', { name: /balances y transacciones/i })).toBeVisible()
    await expect(page.getByText('Total recaudado')).toBeVisible()
    await expect(page.locator('table tbody tr').first()).toBeVisible()
    await page.screenshot({ path: 'e2e/evidencias/hu-1.15-balance.png', fullPage: true })
  })

  test('CP-1.15.3 | Detección de inconsistencia en el balance', async () => {
    test.skip(true, 'GAP: no existe verificación de consistencia del ledger ni marcado de inconsistencias.')
  })
})
