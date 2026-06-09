@gap
Feature: HU 1.16 - Auditoría de cambios de estado
  Como administrador
  Quiero saber quién hizo qué cambio y cuándo
  Para tener control y responsabilidad sobre cada acción importante

  # GAP: la auditoría se persiste internamente (AuditEventService) pero no se expone
  # ningún endpoint/UI para consultarla ni modificarla, por lo que estos criterios no
  # son verificables como pruebas E2E. Se documentan como hallazgo de QA (ver docs/sprint-3).

  Scenario: Cambio de estado registrado automáticamente
    Given ocurrió un cambio de estado en un pago o comercio
    When la plataforma procesa el cambio
    Then queda registrado quién lo hizo, qué cambió y en qué momento

  Scenario: Consulta del historial de auditoría
    Given el administrador quiere revisar los cambios recientes
    When consulta el registro de auditoría
    Then la plataforma muestra la lista de eventos ordenados por fecha

  Scenario: Intento de modificar un registro de auditoría
    Given existe un registro de auditoría guardado
    When alguien intenta modificarlo
    Then la plataforma lo impide y protege la integridad del registro
