import '@babel/polyfill'

import OptionsApp from './components/OptionsApp.html'
import { CONTAINER_COLORS, CONTAINER_ICONS } from './constants/container'
import presets from './presets.json'
import { getSyncConfigs } from './services/configurations'
import valuesFromEnum from './utils/valuesFromEnum'

const optionsApp = new OptionsApp({
  target: document.getElementById('root') as Element,
  data: {
    containerColors: valuesFromEnum(CONTAINER_COLORS),
    containerIcons: valuesFromEnum(CONTAINER_ICONS),
    presets,
  },
})

const main = async (): Promise<void> => {
  const syncConfig = await getSyncConfigs()
  if (syncConfig.containerConfigs) {
    optionsApp.set({
      myRules: syncConfig.containerConfigs,
    })
  }
}

main().catch((err) => {
  console.error(err)
})
