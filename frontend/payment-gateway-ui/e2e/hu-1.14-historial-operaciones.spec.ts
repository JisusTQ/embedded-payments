import { test, expect } from '@playwright/test'
import { loginAndExpectDashboard } from './helpers/ui'
import { registerMerchant, createIntentOk, submitCheckout } from './helpers/api'

test.describe('HU 1.14 - Historial de operaciones', () => {
  test('CP-1.14.1 | Historial consultado exitosamente muestra los movimientos [UI]', async ({ page, request }) => {
    const merchant = await registerMerchant(request, 'hist')
    const intent = await createIntentOk(request, merchant.token, 210.0)
    expect((await submitCheckout(request, intent.id)).ok()).toBeTruthy()
    await loginAndExpectDashboard(page, merchant.email, merchant.password)
    await page.goto('/transactions')
    await expect(page.getByText('210.00')).toBeVisible()
    await expect(page.getByText('No transactions found')).toHaveCount(0)
    await page.screenshot({ path: 'e2e/evidencias/hu-1.14-historial.png', fullPage: true })
  })

  test('CP-1.14.2 | Filtro del historial por estado [UI]', async ({ page, request }) => {
    const merchant = await registerMerchant(request, 'filtro')
    const intent = await createIntentOk(request, merchant.token, 130.0)
    expect((await submitCheckout(request, intent.id)).ok()).toBeTruthy()
    await loginAndExpectDashboard(page, merchant.email, merchant.password)
    await page.goto('/transactions')
    await expect(page.getByText('130.00')).toBeVisible()
    await page.locator('select').selectOption('FAILED')
    await expect(page.getByText('No transactions found')).toBeVisible()
    await page.locator('select').selectOption('COMPLETED')
    await expect(page.getByText('130.00')).toBeVisible()
  })

  test('CP-1.14.3 | Historial vacío informa que no hay operaciones [UI]', async ({ page, request }) => {
    const merchant = await registerMerchant(request, 'vacio')
    await loginAndExpectDashboard(page, merchant.email, merchant.password)
    await page.goto('/transactions')
    await expect(page.getByText('No transactions found')).toBeVisible()
  })
})
