Feature: HU 1.9 - Creación de pagos
  Como comercio activo en la plataforma
  Quiero iniciar un cobro a un cliente
  Para recibir el dinero por un producto o servicio prestado

  Scenario: Pago creado exitosamente
    Given el comercio está activo y autenticado
    When registra un cobro con monto y moneda válidos
    Then la plataforma genera una intención de pago pendiente
    And el comercio recibe la referencia del cobro

  Scenario: El comercio intenta cobrar sin estar activo
    Given el comercio está inactivo
    When intenta registrar un cobro
    Then la plataforma rechaza la operación

  Scenario: El monto del cobro es inválido
    Given el comercio está activo
    When registra un cobro con monto en cero o negativo
    Then la plataforma informa que el valor no es aceptable
