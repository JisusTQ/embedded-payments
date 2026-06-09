Feature: HU 1.15 - Ledger financiero
  Como administrador
  Quiero ver el balance consolidado de entradas y salidas de dinero
  Para verificar que las cuentas de la plataforma están en orden

  @gap
  Scenario: Consulta del balance general
    Given el administrador está autenticado
    When solicita el resumen financiero de la plataforma
    Then el sistema muestra el total de ingresos, egresos y saldo disponible

  Scenario: Balance por comercio
    Given el comercio tiene operaciones registradas
    When consulta su balance
    Then el sistema muestra los ingresos asociados a ese comercio

  @gap
  Scenario: Detección de inconsistencia en el balance
    Given los registros de transacciones no cuadran con el balance
    When el administrador revisa el ledger
    Then el sistema marca la inconsistencia para revisión
