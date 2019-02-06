import '@babel/polyfill'

import {clearDomainCookies, setupContainer} from './services/container'
import convertDomainToRegExp from './utils/convertDomainToRegExp'

// TODO: testing, can remove
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

browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    console.debug('onBeforeRequest request', {
      'details.url': details.url,
      'new URL(details.url).hostname': new URL(details.url).hostname
    })

    const response = {
      cancel: TWITTER_DOMAIN_REGEXPS.some((regexp) => {
        return regexp.test(new URL(details.url).hostname)
      })
    }
    console.debug('onBeforeRequest response', response)
    return response
  },
  {
    types: ['main_frame'],
    urls: ['http://*/*', 'https://*/*']
  },
  ['blocking']
)

async function init(): Promise<void> {
  const cookieStoreId = await setupContainer({
    name: 'Testing Twitter'
  })
  await clearDomainCookies(cookieStoreId, {
    domains: TWITTER_DOMAINS
  })
}

init().catch((err) => console.error(err))
