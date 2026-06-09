import { Given, Then, When } from '@cucumber/cucumber'
import { actorCalled, notes, Wait } from '@serenity-js/core'
import { Ensure, equals, includes, matches } from '@serenity-js/assertions'
import { DECLINE_AMOUNT, SEEDED_MERCHANT, uniqueEmail } from '../../helpers/test-data'
import { QANotes } from '../../screenplay/notes'
import { Authenticate, DeactivateAMerchant, RegisterAsMerchant } from '../../screenplay/tasks/Authentication'
import {
  AuthorizeThePayment,
  CancelThePayment,
  ConsultATransaction,
  ConsultThePaymentStatus,
  CreateAPaymentIntent,
  RequestARefund,
  SubmitACheckoutForAMissingIntent,
} from '../../screenplay/tasks/Payments'
import { CreateAPaymentOrder, LogIn, PayTheCheckout } from '../../screenplay/tasks/MerchantUi'
import { CurrentUrl, GeneratedCheckoutLink, PaymentErrorMessage, PaymentReceiptMessage } from '../../screenplay/questions/Ui'
import { PaymentIntentStatus, ResponseStatus } from '../../screenplay/questions/Api'

// ----------------------------- HU 1.9 - Creación de pagos -----------------------------

Given('el comercio está activo y autenticado', () =>
  actorCalled('Comercio').attemptsTo(
    LogIn.withCredentials(SEEDED_MERCHANT.email, SEEDED_MERCHANT.password),
    Wait.until(CurrentUrl(), includes('/dashboard')),
  ),
)

When('registra un cobro con monto y moneda válidos', () =>
  actorCalled('Comercio').attemptsTo(CreateAPaymentOrder.forAmount(149.9, 'USD')),
)

Then('la plataforma genera una intención de pago pendiente', () =>
  actorCalled('Comercio').attemptsTo(Wait.until(GeneratedCheckoutLink(), includes('/pay/'))),
)

Then('el comercio recibe la referencia del cobro', () =>
  actorCalled('Comercio').attemptsTo(Ensure.that(GeneratedCheckoutLink(), matches(/\/pay\/[0-9a-f-]{36}/i))),
)

Given('el comercio está inactivo', async function (this: any) {
  await actorCalled('Comercio').attemptsTo(RegisterAsMerchant.named(uniqueEmail('comercio'), 'password123'))
  this.merchantId = await actorCalled('Comercio').answer(notes<QANotes>().get('merchantId'))
  await actorCalled('Administrador').attemptsTo(
    Authenticate.asAdministrator(),
    DeactivateAMerchant.withId(this.merchantId),
  )
})

When('intenta registrar un cobro', () =>
  actorCalled('Comercio').attemptsTo(CreateAPaymentIntent.of(50)),
)

Then('la plataforma rechaza la operación', () =>
  actorCalled('Comercio').attemptsTo(Ensure.that(ResponseStatus(), equals(403))),
)

Given('el comercio está activo', () =>
  actorCalled('Comercio').attemptsTo(RegisterAsMerchant.named(uniqueEmail('comercio'), 'password123')),
)

When('registra un cobro con monto en cero o negativo', () =>
  actorCalled('Comercio').attemptsTo(CreateAPaymentIntent.of(0)),
)

Then('la plataforma informa que el valor no es aceptable', () =>
  actorCalled('Comercio').attemptsTo(Ensure.that(ResponseStatus(), equals(400))),
)

// --------------------------- HU 1.10 - Autorización de pagos ---------------------------

Given('existe una intención de pago pendiente', () =>
  actorCalled('Comercio').attemptsTo(Authenticate.asSeededMerchant()),
)

When('la plataforma evalúa las condiciones del cobro', async function (this: any) {
  await actorCalled('Comercio').attemptsTo(CreateAPaymentIntent.of(120))
  this.intentId = await actorCalled('Comercio').answer(notes<QANotes>().get('intentId'))
  await actorCalled('Cliente').attemptsTo(PayTheCheckout.forIntent(this.intentId))
})

Then('aprueba el pago y lo marca como autorizado', () =>
  actorCalled('Cliente').attemptsTo(Wait.until(PaymentReceiptMessage(), matches(/payment successful/i))),
)

When('los fondos disponibles no cubren el monto', async function (this: any) {
  await actorCalled('Comercio').attemptsTo(CreateAPaymentIntent.of(DECLINE_AMOUNT))
  this.intentId = await actorCalled('Comercio').answer(notes<QANotes>().get('intentId'))
  await actorCalled('Cliente').attemptsTo(PayTheCheckout.forIntent(this.intentId))
})

Then('la plataforma rechaza el pago e informa el motivo', () =>
  actorCalled('Cliente').attemptsTo(Wait.until(PaymentErrorMessage(), includes('Payment processing failed'))),
)

Given('existe una intención de pago con información incorrecta', () => {
  // Se usará un identificador de cobro inexistente en el paso siguiente.
})

When('la plataforma intenta autorizarlo', () =>
  actorCalled('Cliente').attemptsTo(SubmitACheckoutForAMissingIntent.now()),
)

Then('rechaza la operación e informa el problema encontrado', () =>
  actorCalled('Cliente').attemptsTo(Ensure.that(ResponseStatus(), equals(404))),
)

// ------------------------ HU 1.11 - Gestión del estado del pago ------------------------

Given('el comercio tiene un cobro registrado', () =>
  actorCalled('Comercio').attemptsTo(Authenticate.asSeededMerchant(), CreateAPaymentIntent.of(90)),
)

When('consulta el estado de ese cobro', () =>
  actorCalled('Comercio').attemptsTo(ConsultThePaymentStatus.now()),
)

Then('la plataforma le muestra el estado actual del pago', () =>
  actorCalled('Comercio').attemptsTo(Ensure.that(PaymentIntentStatus(), equals('CREATED'))),
)

Given('un pago fue autorizado', () =>
  actorCalled('Comercio').attemptsTo(Authenticate.asSeededMerchant(), CreateAPaymentIntent.of(95)),
)

When('la plataforma procesa el cobro', () =>
  actorCalled('Comercio').attemptsTo(AuthorizeThePayment.now()),
)

Then('el estado cambia y el comercio puede verlo actualizado', () =>
  actorCalled('Comercio').attemptsTo(
    ConsultThePaymentStatus.now(),
    Ensure.that(PaymentIntentStatus(), equals('SUCCEEDED')),
  ),
)

Given('el comercio intenta consultar un cobro ajeno', async function (this: any) {
  await actorCalled('Comercio').attemptsTo(
    Authenticate.asSeededMerchant(),
    CreateAPaymentIntent.of(60),
    AuthorizeThePayment.now(),
  )
  this.transactionId = await actorCalled('Comercio').answer(notes<QANotes>().get('transactionId'))
})

When('hace la consulta', async function (this: any) {
  await actorCalled('Intruso').attemptsTo(
    RegisterAsMerchant.named(uniqueEmail('intruso'), 'password123', 'intruso'),
    ConsultATransaction.withId(this.transactionId),
  )
})

Then('la plataforma deniega el acceso a esa información', () =>
  actorCalled('Intruso').attemptsTo(Ensure.that(ResponseStatus(), equals(403))),
)

// ------------------------- HU 1.12 - Cancelación y reembolso -------------------------

Given('existe un cobro que aún no fue procesado', () =>
  actorCalled('Comercio').attemptsTo(Authenticate.asSeededMerchant(), CreateAPaymentIntent.of(30)),
)

When('el comercio solicita cancelarlo', () =>
  actorCalled('Comercio').attemptsTo(CancelThePayment.now()),
)

Then('la plataforma lo cancela y ningún cobro se realiza', () =>
  actorCalled('Comercio').attemptsTo(
    Ensure.that(ResponseStatus(), equals(200)),
    Ensure.that(PaymentIntentStatus(), equals('CANCELED')),
  ),
)

Given('un cobro fue procesado exitosamente', () =>
  actorCalled('Comercio').attemptsTo(
    Authenticate.asSeededMerchant(),
    CreateAPaymentIntent.of(80),
    AuthorizeThePayment.now(),
  ),
)

When('el comercio solicita devolver el dinero al cliente', () =>
  actorCalled('Comercio').attemptsTo(RequestARefund.ofStoredTransaction(20, 'Cliente insatisfecho')),
)

Then('la plataforma inicia la devolución y confirma la operación', () =>
  actorCalled('Comercio').attemptsTo(Ensure.that(ResponseStatus(), equals(201))),
)

Given('un cobro está cancelado', () =>
  actorCalled('Comercio').attemptsTo(
    Authenticate.asSeededMerchant(),
    CreateAPaymentIntent.of(40),
    CancelThePayment.now(),
  ),
)

When('el comercio intenta reembolsarlo', () =>
  actorCalled('Comercio').attemptsTo(RequestARefund.ofTheCancelledPayment(5)),
)

Then('la plataforma informa que no es posible reembolsar ese cobro', () =>
  actorCalled('Comercio').attemptsTo(Ensure.that(ResponseStatus(), equals(404))),
)
