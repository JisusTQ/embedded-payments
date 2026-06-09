import { AfterAll, BeforeAll, setDefaultTimeout } from '@cucumber/cucumber'
import { configure } from '@serenity-js/core'
import { Browser, chromium } from 'playwright-core'
import { Actors } from '../../screenplay/cast/Actors'
import { FRONTEND_URL } from '../../helpers/test-data'

setDefaultTimeout(60_000)

let browser: Browser

BeforeAll(async () => {
  browser = await chromium.launch({ headless: process.env.HEADLESS !== 'false' })

  configure({
    actors: new Actors(browser, FRONTEND_URL),
    crew: [
      '@serenity-js/console-reporter',
      ['@serenity-js/web:Photographer', { strategy: 'TakePhotosOfInteractions' }],
      ['@serenity-js/core:ArtifactArchiver', { outputDirectory: 'target/site/serenity' }],
      ['@serenity-js/serenity-bdd', { specDirectory: 'e2e/features' }],
    ],
  })
})

AfterAll(async () => {
  await browser?.close()
})
