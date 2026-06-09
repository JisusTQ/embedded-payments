import { Page, Text, Value } from '@serenity-js/web'
import { BalancesPage, CheckoutPage, CreateOrderPage, LoginPage, TransactionsPage } from '../ui/Pages'

/** Questions sobre el estado de la interfaz. */

export const CurrentUrl = () => Page.current().url().href.describedAs('la URL actual del navegador')

export const LoginErrorMessage = () => Text.of(LoginPage.errorMessage)

export const GeneratedCheckoutLink = () => Value.of(CreateOrderPage.checkoutLinkInput)

export const PaymentReceiptMessage = () => Text.of(CheckoutPage.successBanner)

export const PaymentErrorMessage = () => Text.of(CheckoutPage.errorBanner)

export const TransactionHistoryRows = () => Text.ofAll(TransactionsPage.cells)

export const BalanceSummaryTexts = () => Text.ofAll(BalancesPage.summaryTexts)

export const NumberOfBalanceRows = () => BalancesPage.transactionRows.count()
