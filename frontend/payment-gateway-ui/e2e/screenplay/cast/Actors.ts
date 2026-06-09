import { Actor, Cast, TakeNotes } from '@serenity-js/core'
import { BrowseTheWebWithPlaywright } from '@serenity-js/playwright'
import { CallAnApi } from '@serenity-js/rest'
import type { Browser } from 'playwright-core'
import { API_BASE } from '../../helpers/test-data'

/**
 * Cast (reparto): define las ABILITIES que recibe cada actor del escenario.
 *  - BrowseTheWebWithPlaywright: operar la interfaz vía navegador (con baseURL del frontend).
 *  - CallAnApi: interactuar con la API del backend.
 *  - TakeNotes: recordar datos (ids, referencias) entre actividades.
 */
export class Actors implements Cast {
  constructor(
    private readonly browser: Browser,
    private readonly baseURL: string,
  ) {}

  prepare(actor: Actor): Actor {
    return actor.whoCan(
      BrowseTheWebWithPlaywright.using(this.browser, { baseURL: this.baseURL }),
      CallAnApi.at(API_BASE),
      TakeNotes.usingAnEmptyNotepad(),
    )
  }
}
