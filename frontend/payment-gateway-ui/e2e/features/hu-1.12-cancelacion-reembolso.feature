Feature: HU 1.12 - Cancelación y reembolso
  Como comercio
  Quiero poder cancelar un cobro o devolver el dinero a un cliente
  Para resolver inconvenientes y mantener la confianza en mi negocio

  Scenario: Cancelación exitosa antes del procesamiento
    Given existe un cobro que aún no fue procesado
    When el comercio solicita cancelarlo
    Then la plataforma lo cancela y ningún cobro se realiza

  Scenario: Reembolso exitoso de un pago ya procesado
    Given un cobro fue procesado exitosamente
    When el comercio solicita devolver el dinero al cliente
    Then la plataforma inicia la devolución y confirma la operación

  Scenario: Intento de reembolso de un pago ya cancelado
    Given un cobro está cancelado
    When el comercio intenta reembolsarlo
    Then la plataforma informa que no es posible reembolsar ese cobro
