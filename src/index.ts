import App from './App.html'
import testImport from './testImport'

testImport()

const app = new App({
	target: document.getElementById('root'),
	data: {
    name: 'world'
  }
})

app.set({
  name: 'everybody'
})
