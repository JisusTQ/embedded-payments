import { test, expect } from '@playwright/test'
import { SEEDED_MERCHANT } from './helpers/test-data'
import { loginViaUI, loginAndExpectDashboard } from './helpers/ui'

test.describe('Autenticación de comercio', () => {
  test('CP-AUTH-01 | Login exitoso con credenciales válidas redirige al dashboard', async ({ page }) => {
    await loginAndExpectDashboard(page, SEEDED_MERCHANT.email, SEEDED_MERCHANT.password)
    await expect(page.getByText(SEEDED_MERCHANT.email).first()).toBeVisible()
  })

  test('CP-AUTH-02 | Login con contraseña incorrecta muestra error y permanece en login', async ({ page }) => {
    await loginViaUI(page, SEEDED_MERCHANT.email, 'contrasena-incorrecta')
    await expect(page.getByText(/invalid email or password/i)).toBeVisible()
    await expect(page).toHaveURL(/\/login/)
  })

  test('CP-AUTH-03 | Acceso a ruta protegida sin sesión redirige a login', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible()
  })
})
