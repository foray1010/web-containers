import '@babel/polyfill'

import OptionsApp from './components/OptionsApp.html'
import presets from './presets.json'

new OptionsApp({
  target: document.getElementById('root') as Element,
  data: {
    presets
  }
})
