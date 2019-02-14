export const CONTAINER_CONFIGS_FIELD_KEY = 'containerConfigs'

interface ContainerConfig {
  name: string
  color: string
  icon: string
  domains: Array<string>
}

interface SyncConfig {
  containerConfigs?: Array<ContainerConfig>
}

function validateContainerPresets(config: Array<ContainerConfig>): Promise<boolean> | boolean {
  // TODO: validate the config object
  return true
}

async function getSyncConfigs(): Promise<SyncConfig | undefined> {
  try {
    const syncConfigs = (await browser.storage.sync.get()) as SyncConfig

    return syncConfigs
  } catch (err) {
    console.error('Failed to get container config', err)
    return undefined
  }
}

async function saveContainerConfigs(
  config: Array<ContainerConfig>
): Promise<Array<ContainerConfig> | undefined> {
  try {
    const validated = validateContainerPresets(config)

    if (!validated) throw new Error('Invalid Config Object')

    console.debug(`saving ${CONTAINER_CONFIGS_FIELD_KEY} with values: `, config)

    await browser.storage.sync.set({
      [CONTAINER_CONFIGS_FIELD_KEY]: config
    })

    return config
  } catch (err) {
    console.error('Failed to save container config', err)
    return undefined
  }
}

export {getSyncConfigs, saveContainerConfigs}
