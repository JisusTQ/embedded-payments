import { Given, Then, When } from '@cucumber/cucumber'
import { actorCalled, Wait } from '@serenity-js/core'
import { Ensure, containAtLeastOneItemThat, equals, includes, isGreaterThan, matches } from '@serenity-js/assertions'
import { uniqueEmail } from '../../helpers/test-data'
import { RegisterAsMerchant } from '../../screenplay/tasks/Authentication'
import {
  AuthorizeThePayment,
  ConsultTheRefunds,
  ConsultTheTransactionHistory,
  CreateAPaymentIntent,
  RequestARefund,
  SubmitTheCheckout,
} from '../../screenplay/tasks/Payments'
import { FilterTheHistory, LogIn, OpenTheBalances, OpenTheTransactionHistory } from '../../screenplay/tasks/MerchantUi'
import { BalanceSummaryTexts, CurrentUrl, NumberOfBalanceRows, TransactionHistoryRows } from '../../screenplay/questions/Ui'
import {
  DistinctMerchantsInHistory,
  FirstTransactionAmount,
  FirstTransactionStatus,
  NumberOfRefunds,
  NumberOfTransactions,
} from '../../screenplay/questions/Api'

// ----------------------- HU 1.13 - Registro de transacciones -----------------------

Given('un pago fue procesado correctamente', () =>
  actorCalled('Comercio').attemptsTo(
    RegisterAsMerchant.named(uniqueEmail('comercio'), 'password123'),
    CreateAPaymentIntent.of(200),
    SubmitTheCheckout.asCustomer(),
  ),
)

When('la plataforma confirma el cobro', () =>
  actorCalled('Comercio').attemptsTo(ConsultTheTransactionHistory.viaApi()),
)

Then('queda registrado el movimiento con fecha, monto y partes involucradas', () =>
  actorCalled('Comercio').attemptsTo(
    Ensure.that(NumberOfTransactions(), isGreaterThan(0)),
    Ensure.that(FirstTransactionAmount(), equals(200)),
    Ensure.that(FirstTransactionStatus(), equals('COMPLETED')),
  ),
)

Given('se procesó una devolución de dinero', () =>
  actorCalled('Comercio').attemptsTo(
    RegisterAsMerchant.named(uniqueEmail('comercio'), 'password123'),
    CreateAPaymentIntent.of(120),
    AuthorizeThePayment.now(),
    RequestARefund.ofStoredTransaction(30, 'Devolución'),
  ),
)

When('la plataforma confirma el reembolso', () =>
  actorCalled('Comercio').attemptsTo(ConsultTheRefunds.viaApi()),
)

Then('queda registrado el movimiento de salida correspondiente', () =>
  actorCalled('Comercio').attemptsTo(Ensure.that(NumberOfRefunds(), isGreaterThan(0))),
)

Given('el administrador selecciona un comercio', () =>
  actorCalled('Comercio').attemptsTo(
    RegisterAsMerchant.named(uniqueEmail('comercio'), 'password123'),
    CreateAPaymentIntent.of(75),
    SubmitTheCheckout.asCustomer(),
  ),
)

When('solicita ver sus movimientos', () =>
  actorCalled('Comercio').attemptsTo(ConsultTheTransactionHistory.viaApi()),
)

Then('la plataforma muestra el listado de transacciones de ese comercio', () =>
  actorCalled('Comercio').attemptsTo(
    Ensure.that(NumberOfTransactions(), isGreaterThan(0)),
    Ensure.that(DistinctMerchantsInHistory(), equals(1)),
  ),
)

// ----------------------- HU 1.14 - Historial de operaciones -----------------------

Given('el comercio está autenticado', async function (this: any) {
  const email = uniqueEmail('comercio')
  const password = 'password123'
  await actorCalled('Comercio').attemptsTo(
    RegisterAsMerchant.named(email, password),
    CreateAPaymentIntent.of(210),
    SubmitTheCheckout.asCustomer(),
    LogIn.withCredentials(email, password),
    Wait.until(CurrentUrl(), includes('/dashboard')),
  )
})

When('solicita ver su historial de operaciones', () =>
  actorCalled('Comercio').attemptsTo(OpenTheTransactionHistory.now()),
)

Then('la plataforma muestra todos sus movimientos ordenados por fecha', () =>
  actorCalled('Comercio').attemptsTo(
    Wait.until(TransactionHistoryRows(), containAtLeastOneItemThat(includes('210.00'))),
  ),
)

Given('el comercio quiere revisar operaciones de un estado específico', async function () {
  const email = uniqueEmail('comercio')
  const password = 'password123'
  await actorCalled('Comercio').attemptsTo(
    RegisterAsMerchant.named(email, password),
    CreateAPaymentIntent.of(130),
    SubmitTheCheckout.asCustomer(),
    LogIn.withCredentials(email, password),
    Wait.until(CurrentUrl(), includes('/dashboard')),
    OpenTheTransactionHistory.now(),
    Wait.until(TransactionHistoryRows(), containAtLeastOneItemThat(includes('130.00'))),
  )
})

When('aplica un filtro por estado', () =>
  actorCalled('Comercio').attemptsTo(FilterTheHistory.byStatus('FAILED')),
)

Then('la plataforma muestra solo las operaciones de ese estado', () =>
  actorCalled('Comercio').attemptsTo(
    Wait.until(TransactionHistoryRows(), containAtLeastOneItemThat(includes('No transactions found'))),
    FilterTheHistory.byStatus('COMPLETED'),
    Wait.until(TransactionHistoryRows(), containAtLeastOneItemThat(includes('130.00'))),
  ),
)

Given('el comercio no ha realizado ningún cobro', async function () {
  const email = uniqueEmail('comercio')
  const password = 'password123'
  await actorCalled('Comercio').attemptsTo(
    RegisterAsMerchant.named(email, password),
    LogIn.withCredentials(email, password),
    Wait.until(CurrentUrl(), includes('/dashboard')),
  )
})

When('consulta su historial', () =>
  actorCalled('Comercio').attemptsTo(OpenTheTransactionHistory.now()),
)

Then('la plataforma informa que no hay operaciones registradas', () =>
  actorCalled('Comercio').attemptsTo(
    Wait.until(TransactionHistoryRows(), containAtLeastOneItemThat(includes('No transactions found'))),
  ),
)

// ------------------------- HU 1.15 - Ledger financiero (balance por comercio) -------------------------

Given('el comercio tiene operaciones registradas', async function () {
  const email = uniqueEmail('comercio')
  const password = 'password123'
  await actorCalled('Comercio').attemptsTo(
    RegisterAsMerchant.named(email, password),
    CreateAPaymentIntent.of(250),
    SubmitTheCheckout.asCustomer(),
    LogIn.withCredentials(email, password),
    Wait.until(CurrentUrl(), includes('/dashboard')),
  )
})

When('consulta su balance', () =>
  actorCalled('Comercio').attemptsTo(OpenTheBalances.now()),
)

Then('el sistema muestra los ingresos asociados a ese comercio', () =>
  actorCalled('Comercio').attemptsTo(
    Wait.until(BalanceSummaryTexts(), containAtLeastOneItemThat(matches(/total recaudado/i))),
    Ensure.that(NumberOfBalanceRows(), isGreaterThan(0)),
  ),
)
