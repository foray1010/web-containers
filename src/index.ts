import App from './components/App.html'
import testImport from './testImport'

testImport()

const app = new App({
  target: document.getElementById('root') as Element,
  data: {
    name: 'world'
  }
})

app.set({
  name: 'everybody'
})
