import { Question } from '@serenity-js/core'
import { LastResponse } from '@serenity-js/rest'

/** Questions sobre la última respuesta de la API. */

export const ResponseStatus = () =>
  Question.about('el código de estado de la respuesta', (actor) => LastResponse.status().answeredBy(actor))

export const PaymentIntentStatus = () =>
  Question.about('el estado de la intención de pago', async (actor) =>
    (await LastResponse.body<{ status: string }>().answeredBy(actor)).status,
  )

export const NumberOfTransactions = () =>
  Question.about('el número de transacciones registradas', async (actor) =>
    (await LastResponse.body<{ total: number }>().answeredBy(actor)).total,
  )

export const FirstTransactionAmount = () =>
  Question.about('el monto de la primera transacción', async (actor) =>
    (await LastResponse.body<{ items: Array<{ amount: number }> }>().answeredBy(actor)).items[0].amount,
  )

export const FirstTransactionStatus = () =>
  Question.about('el estado de la primera transacción', async (actor) =>
    (await LastResponse.body<{ items: Array<{ status: string }> }>().answeredBy(actor)).items[0].status,
  )

export const DistinctMerchantsInHistory = () =>
  Question.about('la cantidad de comercios distintos en el historial', async (actor) => {
    const body = await LastResponse.body<{ items: Array<{ merchantId: string }> }>().answeredBy(actor)
    return new Set(body.items.map((item) => item.merchantId)).size
  })

export const NumberOfRefunds = () =>
  Question.about('el número de reembolsos registrados', async (actor) =>
    (await LastResponse.body<{ total: number }>().answeredBy(actor)).total,
  )
