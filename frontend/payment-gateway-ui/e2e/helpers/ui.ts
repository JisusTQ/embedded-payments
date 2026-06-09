import { Page, expect } from '@playwright/test'

export async function loginViaUI(page: Page, email: string, password: string) {
  await page.goto('/login')
  await page.locator('#email').fill(email)
  await page.locator('#password').fill(password)
  await page.getByRole('button', { name: /sign in/i }).click()
}

export async function loginAndExpectDashboard(page: Page, email: string, password: string) {
  await loginViaUI(page, email, password)
  await expect(page).toHaveURL(/\/dashboard/)
  await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible()
}
