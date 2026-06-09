Feature: Acceso a la plataforma
  Como comercio
  Quiero iniciar sesión de forma segura
  Para poder operar en mi panel de control

  Scenario: Login exitoso con credenciales válidas
    Given el comercio abre la página de inicio de sesión
    When inicia sesión con sus credenciales válidas
    Then accede a su panel de control

  Scenario: Login con contraseña incorrecta
    Given el comercio abre la página de inicio de sesión
    When inicia sesión con una contraseña incorrecta
    Then la plataforma muestra un error y permanece en el login

  Scenario: Acceso a una ruta protegida sin sesión
    Given el comercio no ha iniciado sesión
    When intenta abrir una ruta protegida
    Then la plataforma lo redirige al inicio de sesión
