/**
 * Datos y utilidades compartidas para las pruebas E2E.
 */

/** Cuenta de comercio sembrada por DemoDataInitializer (rol ROLE_MERCHANT, ACTIVE). */
export const SEEDED_MERCHANT = {
  email: 'test@example.com',
  password: 'password',
}

/** Cuenta administradora sembrada por DemoDataInitializer (rol ROLE_ADMIN). */
export const SEEDED_ADMIN = {
  email: 'admin@example.com',
  password: 'password',
}

/** Base del backend para las pruebas a nivel de API (request fixture). */
export const API_BASE = process.env.E2E_API_URL || 'http://localhost:8085'

/**
 * Monto que el procesador mock RECHAZA de forma determinista (centavos == .01).
 * Cualquier otro monto es aprobado. Ver MockPaymentProcessor.java.
 */
export const DECLINE_AMOUNT = 50.01
export const APPROVE_AMOUNT = 50.0

/** Genera un email único para registrar comercios sin colisiones entre corridas. */
export function uniqueEmail(prefix = 'merchant'): string {
  const rand = Math.random().toString(36).slice(2, 8)
  return `${prefix}.${Date.now()}.${rand}@example.com`
}

/** IBAN/routing válidos (pasan checksum ISO 7064 / ABA). */
export const VALID_BANK = {
  iban: 'ES9121000418450200051332',
  routingNumber: '021000021',
  accountHolder: 'QA Test Holder',
}

/** Routing inválido (falla checksum ABA) para los casos de excepción. */
export const INVALID_ROUTING = '123456789'
