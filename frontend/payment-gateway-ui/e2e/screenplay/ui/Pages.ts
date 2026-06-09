import { By, PageElement, PageElements } from '@serenity-js/web'

/** Page Objects estilo Screenplay: cada elemento es un "Target" localizable. */

export const LoginPage = {
  emailField: PageElement.located(By.id('email')).describedAs('el campo de email'),
  passwordField: PageElement.located(By.id('password')).describedAs('el campo de contraseña'),
  signInButton: PageElement.located(By.css('button[type="submit"]')).describedAs('el botón Iniciar sesión'),
  errorMessage: PageElement.located(By.css('span.text-red-800')).describedAs('el mensaje de error'),
}

export const CreateOrderPage = {
  amountField: PageElement.located(By.id('amount')).describedAs('el campo de monto'),
  currencySelect: PageElement.located(By.id('currency')).describedAs('el selector de moneda'),
  descriptionField: PageElement.located(By.id('description')).describedAs('el campo de descripción'),
  createButton: PageElement.located(By.css('button[type="submit"]')).describedAs('el botón Crear orden'),
  checkoutLinkInput: PageElement.located(By.css('input[readonly]')).describedAs('el enlace de checkout generado'),
}

export const CheckoutPage = {
  cardholderField: PageElement.located(By.id('cardholderName')).describedAs('el nombre en la tarjeta'),
  cardNumberField: PageElement.located(By.id('cardNumber')).describedAs('el número de tarjeta'),
  expiryField: PageElement.located(By.id('expiry')).describedAs('el vencimiento'),
  cvcField: PageElement.located(By.id('cvc')).describedAs('el CVC'),
  emailField: PageElement.located(By.id('email')).describedAs('el email de recibo'),
  payButton: PageElement.located(By.css('button[type="submit"]')).describedAs('el botón Pagar'),
  successBanner: PageElement.located(By.css('p.text-emerald-700')).describedAs('el mensaje de pago exitoso'),
  errorBanner: PageElement.located(By.css('p.text-rose-800')).describedAs('el mensaje de error del pago'),
}

export const TransactionsPage = {
  cells: PageElements.located(By.css('td')).describedAs('las celdas del historial'),
  statusFilter: PageElement.located(By.css('select')).describedAs('el filtro por estado'),
}

export const BalancesPage = {
  summaryTexts: PageElements.located(By.css('p')).describedAs('los textos del resumen de balance'),
  transactionRows: PageElements.located(By.css('table tbody tr')).describedAs('las filas de transacciones'),
}
