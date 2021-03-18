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

function validateContainerPresets(config: Array<ContainerConfig>): boolean {
  // TODO: validate the config object
  return config !== undefined
}

async function getSyncConfigs(): Promise<SyncConfig> {
  try {
    const syncConfigs = (await browser.storage.sync.get()) as SyncConfig

    return syncConfigs
  } catch (err: unknown) {
    console.error('Failed to get container config', err)
    throw err
  }
}

async function saveContainerConfigs(
  config: Array<ContainerConfig>,
): Promise<void> {
  try {
    const validated = validateContainerPresets(config)

    if (!validated) throw new Error('Invalid Config Object')

    console.debug(`saving ${CONTAINER_CONFIGS_FIELD_KEY} with values: `, config)

    await browser.storage.sync.set({
      [CONTAINER_CONFIGS_FIELD_KEY]: config,
    })
  } catch (err: unknown) {
    console.error('Failed to save container config', err)
    throw err
  }
}

export { getSyncConfigs, saveContainerConfigs }
