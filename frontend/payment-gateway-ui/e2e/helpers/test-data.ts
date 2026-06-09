export const SEEDED_MERCHANT = { email: 'test@example.com', password: 'password' }
export const SEEDED_ADMIN = { email: 'admin@example.com', password: 'password' }

export const API_BASE = process.env.E2E_API_URL || 'http://localhost:8085'

// Centavos .01 => el procesador mock rechaza el pago; cualquier otro monto lo aprueba.
export const DECLINE_AMOUNT = 50.01

export function uniqueEmail(prefix = 'merchant'): string {
  const rand = Math.random().toString(36).slice(2, 8)
  return `${prefix}.${Date.now()}.${rand}@example.com`
}
