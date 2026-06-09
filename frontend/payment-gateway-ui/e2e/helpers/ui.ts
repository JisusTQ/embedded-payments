import { Page, expect, APIRequestContext } from '@playwright/test'
import { API_BASE } from './test-data'

/**
 * Inicia sesión a través de la interfaz (página /login).
 */
export async function loginViaUI(page: Page, email: string, password: string) {
  await page.goto('/login')
  await page.locator('#email').fill(email)
  await page.locator('#password').fill(password)
  await page.getByRole('button', { name: /sign in/i }).click()
}

/**
 * Inicia sesión y espera a llegar al dashboard (caso feliz).
 */
export async function loginAndExpectDashboard(page: Page, email: string, password: string) {
  await loginViaUI(page, email, password)
  await expect(page).toHaveURL(/\/dashboard/)
  await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible()
}

/**
 * Obtiene un token JWT directamente del backend (para pruebas a nivel de API).
 */
export async function apiLogin(request: APIRequestContext, email: string, password: string): Promise<string> {
  const res = await request.post(`${API_BASE}/api/v1/auth/login`, {
    data: { email, password },
  })
  expect(res.ok(), `login API falló para ${email}`).toBeTruthy()
  const body = await res.json()
  return body.token as string
}
