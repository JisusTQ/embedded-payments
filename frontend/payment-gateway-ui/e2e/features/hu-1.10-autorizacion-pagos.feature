Feature: HU 1.10 - Autorización de pagos
  Como plataforma de pagos
  Quiero verificar que un cobro cumple las condiciones necesarias
  Para garantizar que solo los pagos válidos sean procesados

  Scenario: Pago autorizado correctamente
    Given existe una intención de pago pendiente
    When la plataforma evalúa las condiciones del cobro
    Then aprueba el pago y lo marca como autorizado

  Scenario: Pago rechazado por fondos insuficientes
    Given existe una intención de pago pendiente
    When los fondos disponibles no cubren el monto
    Then la plataforma rechaza el pago e informa el motivo

  Scenario: Pago rechazado por datos inconsistentes
    Given existe una intención de pago con información incorrecta
    When la plataforma intenta autorizarlo
    Then rechaza la operación e informa el problema encontrado
