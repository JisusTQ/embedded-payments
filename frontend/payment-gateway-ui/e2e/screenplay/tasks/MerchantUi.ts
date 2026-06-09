import { Answerable, notes, Task } from '@serenity-js/core'
import { Click, Enter, Navigate, Select } from '@serenity-js/web'
import { CheckoutPage, CreateOrderPage, LoginPage, TransactionsPage } from '../ui/Pages'
import { QANotes } from '../notes'

export class EnterCredentials {
  static of = (email: string, password: string): Task =>
    Task.where(`#actor ingresa las credenciales de ${email}`,
      Enter.theValue(email).into(LoginPage.emailField),
      Enter.theValue(password).into(LoginPage.passwordField),
      Click.on(LoginPage.signInButton),
    )
}

export class LogIn {
  static withCredentials = (email: string, password: string): Task =>
    Task.where(`#actor inicia sesión en la plataforma como ${email}`,
      Navigate.to('/login'),
      EnterCredentials.of(email, password),
    )
}

export class CreateAPaymentOrder {
  static forAmount = (amount: number, currency = 'USD', description = 'Orden de prueba E2E'): Task =>
    Task.where(`#actor crea una orden de pago por ${amount} ${currency}`,
      Navigate.to('/create-order'),
      Enter.theValue(String(amount)).into(CreateOrderPage.amountField),
      Select.value(currency).from(CreateOrderPage.currencySelect),
      Enter.theValue(description).into(CreateOrderPage.descriptionField),
      Click.on(CreateOrderPage.createButton),
    )
}

export class PayTheCheckout {
  static forStoredIntent = (): Task =>
    PayTheCheckout.navigateAndPay(notes<QANotes>().get('intentId').as((id) => `/pay/${id}`))

  static forIntent = (intentId: string): Task => PayTheCheckout.navigateAndPay(`/pay/${intentId}`)

  private static navigateAndPay(path: Answerable<string>): Task {
    return Task.where(`#actor paga el checkout con tarjeta`,
      Navigate.to(path),
      Enter.theValue('Alex Johnson').into(CheckoutPage.cardholderField),
      Enter.theValue('4242424242424242').into(CheckoutPage.cardNumberField),
      Enter.theValue('1230').into(CheckoutPage.expiryField),
      Enter.theValue('123').into(CheckoutPage.cvcField),
      Enter.theValue('cliente@example.com').into(CheckoutPage.emailField),
      Click.on(CheckoutPage.payButton),
    )
  }
}

export class OpenTheTransactionHistory {
  static now = (): Task =>
    Task.where(`#actor abre el historial de transacciones`, Navigate.to('/transactions'))
}

export class OpenTheBalances {
  static now = (): Task =>
    Task.where(`#actor abre el balance del comercio`, Navigate.to('/settings/balances'))
}

export class FilterTheHistory {
  static byStatus = (status: string): Task =>
    Task.where(`#actor filtra el historial por estado ${status}`,
      Select.value(status).from(TransactionsPage.statusFilter),
    )
}
