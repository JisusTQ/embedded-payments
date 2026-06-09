Feature: HU 1.13 - Registro de transacciones
  Como administrador de la plataforma
  Quiero que cada movimiento de dinero quede registrado
  Para tener trazabilidad completa de lo que ocurre en el sistema

  Scenario: Transacción registrada tras un pago exitoso
    Given un pago fue procesado correctamente
    When la plataforma confirma el cobro
    Then queda registrado el movimiento con fecha, monto y partes involucradas

  Scenario: Transacción registrada tras un reembolso
    Given se procesó una devolución de dinero
    When la plataforma confirma el reembolso
    Then queda registrado el movimiento de salida correspondiente

  Scenario: Consulta de transacciones por comercio
    Given el administrador selecciona un comercio
    When solicita ver sus movimientos
    Then la plataforma muestra el listado de transacciones de ese comercio
