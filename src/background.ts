import '@babel/polyfill'

import {DEFAULT_FIREFOX_COOKIE_STORE_ID} from './constants/container'
import {clearDomainCookies, setupContainer} from './services/container'
import {reopenTabInContainer} from './services/tabs'
import convertDomainToRegExp from './utils/convertDomainToRegExp'

// TODO: testing, can remove
const TWITTER_CONTAINER_NAME = 'Testing Twitter'
const TWITTER_DOMAINS = [
  '*.t.co',
  '*.twimg.com',
  '*.twitter.com',
  't.co',
  'twimg.com',
  'twitter.com'
]
const TWITTER_DOMAIN_REGEXPS = TWITTER_DOMAINS.map(convertDomainToRegExp)
console.debug('TWITTER_DOMAIN_REGEXPS', TWITTER_DOMAIN_REGEXPS)

async function onBeforeRequestListener(
  details: Parameters<Parameters<typeof browser.webRequest.onBeforeRequest.addListener>[0]>[0]
): Promise<browser.webRequest.BlockingResponse> {
  console.debug('onBeforeRequest request', {
    'details.url': details.url,
    'new URL(details.url).hostname': new URL(details.url).hostname
  })

  const {cookieStoreId: currentCookieStoreId} = await browser.tabs.get(details.tabId)
  console.debug(`current cookieStoreId: ${currentCookieStoreId}`)

  const [targetContextualIdentity] = await browser.contextualIdentities.query({
    name: TWITTER_CONTAINER_NAME
  })
  const targetCookieStoreId = targetContextualIdentity ?
    targetContextualIdentity.cookieStoreId :
    undefined
  console.debug(`target cookieStoreId: ${targetCookieStoreId}`)
  if (!targetCookieStoreId) {
    return {
      cancel: false
    }
  }

  const isContained = currentCookieStoreId === targetCookieStoreId
  const isMatchedDomain = TWITTER_DOMAIN_REGEXPS.some((regexp) => {
    return regexp.test(new URL(details.url).hostname)
  })

  if (isMatchedDomain && !isContained) {
    await reopenTabInContainer(details.tabId, targetCookieStoreId, details.url)
    return {
      cancel: true
    }
  }

  if (!isMatchedDomain && isContained) {
    await reopenTabInContainer(details.tabId, DEFAULT_FIREFOX_COOKIE_STORE_ID, details.url)
  }

  return {
    cancel: false
  }
}

async function init(): Promise<void> {
  const cookieStoreId = await setupContainer({
    name: TWITTER_CONTAINER_NAME
  })
  await clearDomainCookies(cookieStoreId, {
    domains: TWITTER_DOMAINS
  })

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
