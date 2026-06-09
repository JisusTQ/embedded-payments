Feature: HU 1.14 - Historial de operaciones
  Como comercio
  Quiero ver el historial de todos mis cobros y devoluciones
  Para controlar mi flujo de caja y detectar inconsistencias

  Scenario: Historial consultado exitosamente
    Given el comercio está autenticado
    When solicita ver su historial de operaciones
    Then la plataforma muestra todos sus movimientos ordenados por fecha

  Scenario: Filtro por estado de las operaciones
    Given el comercio quiere revisar operaciones de un estado específico
    When aplica un filtro por estado
    Then la plataforma muestra solo las operaciones de ese estado

  Scenario: Historial vacío
    Given el comercio no ha realizado ningún cobro
    When consulta su historial
    Then la plataforma informa que no hay operaciones registradas
