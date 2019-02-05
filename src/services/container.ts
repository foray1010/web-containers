const DEFAULT_CONTAINER_COLOR = 'blue'
const DEFAULT_CONTAINER_ICON = 'fingerprint'

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

async function removeContainerCookiesByDomain(storeId: string, domain: string): Promise<void> {
  // TODO: safer way to form the cookie url?
  const cookieUrl = `https://${domain}/`

  const cookies = await browser.cookies.getAll({
    domain,
    storeId
  })

  await Promise.all(
    cookies.map((cookie) =>
      browser.cookies.remove({
        name: cookie.name,
        url: cookieUrl,
        storeId
      }))
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

  const otherContainers = containers.filter(
    (container) => container.cookieStoreId !== cookieStoreId
  )

  const removeAllDomainCookiesAsync = otherContainers.reduce<Array<Promise<void>>>(
    (acc, container) => {
      return [
        ...acc,
        ...containerOption.domains.map(async (domain) =>
          removeContainerCookiesByDomain(container.cookieStoreId, domain))
      ]
    },
    []
  )

  await Promise.all(removeAllDomainCookiesAsync)
}

export {setupContainer, clearDomainCookies}
