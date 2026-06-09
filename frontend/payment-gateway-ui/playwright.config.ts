import { defineConfig, devices } from '@playwright/test'

/**
 * Configuración E2E para el objeto de prueba (Payment Gateway UI).
 *
 * Requisitos para ejecutar:
 *  1. Backend Spring Boot arriba en http://localhost:8085  (./mvnw spring-boot:run)
 *  2. `npm run test:e2e`  -> Playwright levanta automáticamente el frontend (Vite)
 *
 * El backend NO se levanta aquí a propósito (arranque pesado de Maven en Windows);
 * se documenta como prerrequisito y existe scripts/run-e2e.ps1 como atajo de un comando.
 */
export default defineConfig({
  testDir: './e2e',
  outputDir: './e2e/.artifacts',
  // Las pruebas comparten estado del backend (H2) -> ejecución secuencial y estable.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'e2e/report', open: 'never' }],
    ['json', { outputFile: 'e2e/report/results.json' }],
  ],
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:5173',
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
