import { test } from '@playwright/test'

test.describe('HU 1.16 - Auditoría de cambios de estado', () => {
  test('CP-1.16.1 | Cambio de estado registrado automáticamente', async () => {
    test.skip(true, 'GAP: la auditoría se persiste internamente pero no hay API/UI para verificarla vía E2E.')
  })

  test('CP-1.16.2 | Consulta del historial de auditoría', async () => {
    test.skip(true, 'GAP: no existe endpoint/UI para consultar el registro de auditoría.')
  })

  test('CP-1.16.3 | Intento de modificar un registro de auditoría es impedido', async () => {
    test.skip(true, 'GAP: no existe endpoint para modificar auditoría; la inmutabilidad no es verificable vía E2E.')
  })
})
