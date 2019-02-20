import '@babel/polyfill'

import {DEFAULT_FIREFOX_COOKIE_STORE_ID} from './constants/container'
import presets from './presets.json'
import * as configurationService from './services/configurations'
import {clearDomainCookies, setupContainer} from './services/container'
import {reopenTabInContainer} from './services/tabs'
import convertDomainToRegExp from './utils/convertDomainToRegExp'

async function onBeforeRequestListener(
  details: Parameters<Parameters<typeof browser.webRequest.onBeforeRequest.addListener>[0]>[0]
): Promise<browser.webRequest.BlockingResponse> {
  console.debug('onBeforeRequest request', {
    'details.url': details.url,
    'new URL(details.url).hostname': new URL(details.url).hostname
  })

  const {cookieStoreId: currentCookieStoreId} = await browser.tabs.get(details.tabId)
  console.debug(`current cookieStoreId: ${currentCookieStoreId}`)

  const responses = await Promise.all(
    presets.map(
      async (
        preset
      ): Promise<{
        cancel: boolean
        shouldReset: boolean
      }> => {
        const [targetContextualIdentity] = await browser.contextualIdentities.query({
          name: preset.name
        })
        const targetCookieStoreId = targetContextualIdentity ?
          targetContextualIdentity.cookieStoreId :
          undefined
        console.debug(`target cookieStoreId: ${targetCookieStoreId} for ${preset.name}`)
        if (!targetCookieStoreId) {
          return {
            cancel: false,
            shouldReset: false
          }
        }

        const isContained = currentCookieStoreId === targetCookieStoreId
        const isMatchedDomain = preset.domains
          .map(convertDomainToRegExp)
          .some((regexp) => regexp.test(new URL(details.url).hostname))

        if (isMatchedDomain && !isContained) {
          await reopenTabInContainer(details.tabId, targetCookieStoreId, details.url)
          return {
            cancel: true,
            shouldReset: true
          }
        }

        if (!isMatchedDomain && isContained) {
          return {
            cancel: false,
            shouldReset: true
          }
        }

        return {
          cancel: false,
          shouldReset: false
        }
      }
    )
  )

  if (responses.every((response) => response.shouldReset)) {
    await reopenTabInContainer(details.tabId, DEFAULT_FIREFOX_COOKIE_STORE_ID, details.url)
  }

  return {
    cancel: responses.some((response) => response.cancel)
  }
}

async function init(): Promise<void> {
  const syncConfigs = await configurationService.getSyncConfigs()

  if (syncConfigs && !syncConfigs[configurationService.CONTAINER_CONFIGS_FIELD_KEY]) {
    await configurationService.saveContainerConfigs(presets)

    await Promise.all(
      presets.map(async (preset) => {
        const cookieStoreId = await setupContainer({
          name: preset.name,
          color: preset.color,
          icon: preset.icon
        })
        await clearDomainCookies(cookieStoreId, {
          domains: preset.domains
        })
      })
    )
  }

  browser.webRequest.onBeforeRequest.addListener(
    onBeforeRequestListener,
    {
      types: ['main_frame'],
      urls: ['http://*/*', 'https://*/*']
    },
    ['blocking']
  )
}

init().catch((err) => console.error(err))
