Feature: HU 1.11 - Gestión del estado del pago
  Como comercio
  Quiero conocer en qué punto está el cobro que inicié
  Para informarle al cliente y gestionar mi operación correctamente

  Scenario: Consulta de estado exitosa
    Given el comercio tiene un cobro registrado
    When consulta el estado de ese cobro
    Then la plataforma le muestra el estado actual del pago

  Scenario: El estado cambia después de una acción
    Given un pago fue autorizado
    When la plataforma procesa el cobro
    Then el estado cambia y el comercio puede verlo actualizado

  Scenario: Consulta de un cobro que no pertenece al comercio
    Given el comercio intenta consultar un cobro ajeno
    When hace la consulta
    Then la plataforma deniega el acceso a esa información
