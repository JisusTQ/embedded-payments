import { notes, Task } from '@serenity-js/core'
import { ChangeApiConfig, LastResponse, PatchRequest, PostRequest, Send } from '@serenity-js/rest'
import { API_BASE, SEEDED_ADMIN, SEEDED_MERCHANT, uniqueEmail } from '../../helpers/test-data'
import { QANotes } from '../notes'

const asBearer = (token: string) => `Bearer ${token}`

export class Authenticate {
  static asSeededMerchant = (): Task => Authenticate.as(SEEDED_MERCHANT.email, SEEDED_MERCHANT.password)

  static asAdministrator = (): Task => Authenticate.as(SEEDED_ADMIN.email, SEEDED_ADMIN.password)

  static as = (email: string, password: string): Task =>
    Task.where(`#actor inicia sesión por API como ${email}`,
      Send.a(PostRequest.to(`${API_BASE}/api/v1/auth/login`).with({ email, password })),
      ChangeApiConfig.setHeader('Authorization', LastResponse.body<{ token: string }>().token.as(asBearer)),
    )
}

export class RegisterAsMerchant {
  static named = (email: string, password: string, prefix = 'comercio'): Task =>
    Task.where(`#actor registra el comercio ${email}`,
      Send.a(PostRequest.to(`${API_BASE}/api/v1/auth/register`).with({
        email,
        password,
        role: 'MERCHANT',
        merchantName: `QA ${prefix} ${Date.now()}`,
        contactName: 'QA Contact',
        contactEmail: uniqueEmail(`${prefix}.contact`),
      })),
      notes<QANotes>().set('merchantId', LastResponse.body<{ merchantId: string }>().merchantId),
      Authenticate.as(email, password),
    )
}

export class DeactivateAMerchant {
  static withId = (merchantId: string): Task =>
    Task.where(`#actor desactiva el comercio ${merchantId}`,
      Send.a(PatchRequest.to(`${API_BASE}/api/v1/merchants/${merchantId}/deactivate`).with({ reason: 'Suspensión por QA' })),
    )
}
