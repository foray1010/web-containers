import '@babel/polyfill'

import {clearDomainCookies, setupContainer} from './services/container'

// TODO: testing, can remove
const TWITTER_DOMAINS = [
  'twitter.com',
  'www.twitter.com',
  't.co',
  'twimg.com',
  'mobile.twitter.com',
  'm.twitter.com',
  'api.twitter.com',
  'abs.twimg.com',
  'ton.twimg.com',
  'pbs.twimg.com',
  'tweetdeck.twitter.com'
]

async function init() {
  const cookieStoreId = await setupContainer({
    name: 'Testing Twitter'
  })
  await clearDomainCookies(cookieStoreId, {
    domains: TWITTER_DOMAINS
  })
}

init().catch((err) => console.error(err))
