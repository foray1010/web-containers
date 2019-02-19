import '@babel/polyfill'

import OptionsApp from './components/OptionsApp.html'
import {CONTAINER_COLORS, CONTAINER_ICONS} from './constants/container'
import presets from './presets.json'
import valuesFromEnum from './utils/valuesFromEnum'

new OptionsApp({
  target: document.getElementById('root') as Element,
  data: {
    containerColors: valuesFromEnum(CONTAINER_COLORS),
    containerIcons: valuesFromEnum(CONTAINER_ICONS),
    // TODO: get it from options
    myRules: presets,
    presets
  }
})
