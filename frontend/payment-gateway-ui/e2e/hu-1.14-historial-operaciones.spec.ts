import { test, expect } from '@playwright/test'
import { loginAndExpectDashboard } from './helpers/ui'
import { registerMerchant, createIntentOk, submitCheckout } from './helpers/api'

/**
 * HU 1.14 - Historial de operaciones
 * El comercio ve el historial de todos sus cobros y devoluciones.
 *
 * Nota: la vista de historial ofrece filtro por estado y búsqueda por ID;
 * el filtro por rango de fechas no está disponible en esta vista (ver matriz).
 * El escenario "filtro" se automatiza con el filtro por estado disponible.
 */
test.describe('HU 1.14 - Historial de operaciones', () => {
  test('CP-1.14.1 | Historial consultado exitosamente muestra los movimientos [UI]', async ({ page, request }) => {
    // Given el comercio está autenticado y tiene operaciones
    const merchant = await registerMerchant(request, 'hist')
    const intent = await createIntentOk(request, merchant.token, 210.0)
    expect((await submitCheckout(request, intent.id)).ok()).toBeTruthy()
    await loginAndExpectDashboard(page, merchant.email, merchant.password)
    // When solicita ver su historial de operaciones
    await page.goto('/transactions')
    // Then la plataforma muestra sus movimientos (la fila con el monto del cobro)
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
    // When aplica un filtro que no coincide (FAILED) -> sólo operaciones de ese estado
    await page.locator('select').selectOption('FAILED')
    await expect(page.getByText('No transactions found')).toBeVisible()
    // When vuelve a filtrar por COMPLETED -> reaparecen las operaciones
    await page.locator('select').selectOption('COMPLETED')
    await expect(page.getByText('130.00')).toBeVisible()
  })

  test('CP-1.14.3 | Historial vacío informa que no hay operaciones [UI]', async ({ page, request }) => {
    // Given el comercio no ha realizado ningún cobro
    const merchant = await registerMerchant(request, 'vacio')
    await loginAndExpectDashboard(page, merchant.email, merchant.password)
    // When consulta su historial
    await page.goto('/transactions')
    // Then la plataforma informa que no hay operaciones registradas
    await expect(page.getByText('No transactions found')).toBeVisible()
  })
})
