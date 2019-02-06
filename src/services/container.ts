import convertDomainToRegExp from '../utils/convertDomainToRegExp'

const DEFAULT_CONTAINER_COLOR = 'blue'
const DEFAULT_CONTAINER_ICON = 'fingerprint'
const DEFAULT_FIREFOX_COOKIE_STORE_ID = 'firefox-default'

/**
 * Upsert a container and retrieve the cookieStoreId
 */
async function setupContainer(option: {
  name: string
  color?: string
  icon?: string
}): Promise<string> {
  const {name, color = DEFAULT_CONTAINER_COLOR, icon = DEFAULT_CONTAINER_ICON} = option
  const contexts = await browser.contextualIdentities.query({
    name
  })

  if (contexts.length > 0) {
    return contexts[0].cookieStoreId
  } else {
    const context = await browser.contextualIdentities.create({
      color,
      icon,
      name
    })

    return context.cookieStoreId
  }
}

function cookieDomainToUrl(domain: string): string {
  const hostname = domain.replace(/^\./, '')
  return `https://${hostname}/`
}

async function removeContainerCookiesByDomains(
  storeId: string,
  domains: Array<string>
): Promise<void> {
  const allCookies = await browser.cookies.getAll({
    storeId
  })

  const domainRegExps = domains.map(convertDomainToRegExp)

  const matchDomainCookies = allCookies.filter((cookie) => {
    return domainRegExps.some((regexp) => {
      return regexp.test(cookie.domain)
    })
  })

  await Promise.all(
    matchDomainCookies.map((cookie) => {
      return browser.cookies.remove({
        name: cookie.name,
        url: cookieDomainToUrl(cookie.domain),
        storeId
      })
    })
  )
}

/**
 * Remove domain cookies outside of designated container
 */
async function clearDomainCookies(
  cookieStoreId: string,
  containerOption: {
    domains: Array<string>
  }
): Promise<void> {
  const containers = await browser.contextualIdentities.query({})

  const cookieStoreToBeRemoved = containers
    .filter((container) => container.cookieStoreId !== cookieStoreId)
    .map((container) => container.cookieStoreId)
    .concat(DEFAULT_FIREFOX_COOKIE_STORE_ID)

  const removeAllDomainCookiesAsync = cookieStoreToBeRemoved.reduce<Array<Promise<void>>>(
    (acc, storeId) => {
      return [
        ...acc,
        removeContainerCookiesByDomains(storeId, containerOption.domains)
      ]
    },
    []
  )

  await Promise.all(removeAllDomainCookiesAsync)
}

export {setupContainer, clearDomainCookies}
