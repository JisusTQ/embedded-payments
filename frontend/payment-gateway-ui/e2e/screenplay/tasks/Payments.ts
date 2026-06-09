import { notes, Question, Task } from '@serenity-js/core'
import { GetRequest, LastResponse, PatchRequest, PostRequest, Send } from '@serenity-js/rest'
import { API_BASE } from '../../helpers/test-data'
import { QANotes } from '../notes'

const intentsBase = `${API_BASE}/api/v1/admin/payments/intents`

export class CreateAPaymentIntent {
  static of = (amount: number, currency = 'USD'): Task =>
    Task.where(`#actor crea una intención de pago por ${amount} ${currency}`,
      Send.a(PostRequest.to(intentsBase).with({ amount, currency, description: 'Cobro E2E' })),
      notes<QANotes>().set('intentId', LastResponse.body<{ id: string }>().id),
    )
}

export class AuthorizeThePayment {
  static now = (): Task =>
    Task.where(`#actor autoriza la intención de pago`,
      Send.a(PatchRequest.to(notes<QANotes>().get('intentId').as((id) => `${intentsBase}/${id}/authorize`))),
      notes<QANotes>().set('transactionId', LastResponse.body<{ id: string }>().id),
    )
}

export class CancelThePayment {
  static now = (): Task =>
    Task.where(`#actor cancela la intención de pago`,
      Send.a(PatchRequest.to(notes<QANotes>().get('intentId').as((id) => `${intentsBase}/${id}/cancel`))),
    )
}

export class ConsultThePaymentStatus {
  static now = (): Task =>
    Task.where(`#actor consulta el estado del cobro`,
      Send.a(GetRequest.to(notes<QANotes>().get('intentId').as((id) => `${API_BASE}/checkout/intents/${id}`))),
    )
}

export class SubmitTheCheckout {
  static asCustomer = (customerEmail = 'cliente@example.com', customerName = 'Cliente QA'): Task =>
    Task.where(`#actor envía el pago del checkout`,
      Send.a(PostRequest.to(`${API_BASE}/checkout/submit`).with(
        Question.about('los datos del checkout', async (actor) => ({
          checkoutId: await notes<QANotes>().get('intentId').answeredBy(actor),
          customerEmail,
          customerName,
        })),
      )),
    )
}

export class SubmitACheckoutForAMissingIntent {
  static now = (): Task =>
    Task.where(`#actor intenta pagar una intención inexistente`,
      Send.a(PostRequest.to(`${API_BASE}/checkout/submit`).with({
        checkoutId: '11111111-1111-1111-1111-111111111111',
        customerEmail: 'cliente@example.com',
        customerName: 'Cliente QA',
      })),
    )
}

export class RequestARefund {
  static ofStoredTransaction = (amount: number, reason = 'Devolución solicitada'): Task =>
    RequestARefund.using('transactionId', amount, reason)

  static ofTheCancelledPayment = (amount: number, reason = 'Devolución solicitada'): Task =>
    RequestARefund.using('intentId', amount, reason)

  private static using(idNote: keyof QANotes, amount: number, reason: string): Task {
    return Task.where(`#actor solicita un reembolso de ${amount}`,
      Send.a(PostRequest.to(`${API_BASE}/api/v1/refunds`).with(
        Question.about('los datos del reembolso', async (actor) => ({
          transactionId: await notes<QANotes>().get(idNote).answeredBy(actor),
          amount,
          reason,
        })),
      )),
    )
  }
}

export class ConsultTheTransactionHistory {
  static viaApi = (): Task =>
    Task.where(`#actor consulta el historial de transacciones por API`,
      Send.a(GetRequest.to(`${API_BASE}/api/v1/transactions`)),
    )
}

export class ConsultTheRefunds {
  static viaApi = (): Task =>
    Task.where(`#actor consulta los reembolsos por API`,
      Send.a(GetRequest.to(`${API_BASE}/api/v1/refunds`)),
    )
}

export class ConsultATransaction {
  static withId = (transactionId: string): Task =>
    Task.where(`#actor consulta la transacción ${transactionId}`,
      Send.a(GetRequest.to(`${API_BASE}/api/v1/transactions/${transactionId}`)),
    )
}
