import { Given, Then, When } from '@cucumber/cucumber'
import { actorCalled, Wait } from '@serenity-js/core'
import { Navigate } from '@serenity-js/web'
import { Ensure, includes } from '@serenity-js/assertions'
import { SEEDED_MERCHANT } from '../../helpers/test-data'
import { EnterCredentials } from '../../screenplay/tasks/MerchantUi'
import { CurrentUrl, LoginErrorMessage } from '../../screenplay/questions/Ui'

Given('el comercio abre la página de inicio de sesión', () =>
  actorCalled('Comercio').attemptsTo(Navigate.to('/login')),
)

Given('el comercio no ha iniciado sesión', () => {
  // El actor aún no tiene una sesión activa.
})

When('inicia sesión con sus credenciales válidas', () =>
  actorCalled('Comercio').attemptsTo(EnterCredentials.of(SEEDED_MERCHANT.email, SEEDED_MERCHANT.password)),
)

When('inicia sesión con una contraseña incorrecta', () =>
  actorCalled('Comercio').attemptsTo(EnterCredentials.of(SEEDED_MERCHANT.email, 'contrasena-incorrecta')),
)

When('intenta abrir una ruta protegida', () =>
  actorCalled('Comercio').attemptsTo(Navigate.to('/dashboard')),
)

Then('accede a su panel de control', () =>
  actorCalled('Comercio').attemptsTo(Wait.until(CurrentUrl(), includes('/dashboard'))),
)

Then('la plataforma muestra un error y permanece en el login', () =>
  actorCalled('Comercio').attemptsTo(
    Wait.until(LoginErrorMessage(), includes('Invalid email or password')),
    Ensure.that(CurrentUrl(), includes('/login')),
  ),
)

Then('la plataforma lo redirige al inicio de sesión', () =>
  actorCalled('Comercio').attemptsTo(Wait.until(CurrentUrl(), includes('/login'))),
)
