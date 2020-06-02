export const reopenTabInContainer = async (
  tabId: number,
  cookieStoreId: string,
  overwriteUrl?: string,
): Promise<void> => {
  const tab = await browser.tabs.get(tabId)
  console.debug('tab', tab)

  const url = overwriteUrl || tab.url
  console.debug(`reopen ${url || 'undefined'} in ${cookieStoreId}`)

  await browser.tabs.create({
    active: tab.active,
    cookieStoreId,
    index: tab.index,
    url,
    windowId: tab.windowId,
  })

  if (tab.id !== undefined) {
    await browser.tabs.remove(tab.id)
  }
}
