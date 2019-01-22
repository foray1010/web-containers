import babel from 'rollup-plugin-babel'
import html from 'rollup-plugin-fill-html'
import resolve from 'rollup-plugin-node-resolve'
import svelte from 'rollup-plugin-svelte'

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'cjs'
  },
  plugins: [
    babel(),
    html({
      template: 'src/index.html',
      filename: 'index.html'
    }),
    resolve({
      extensions: ['.ts', '.mjs', '.js', '.json']
    }),
    svelte()
  ]
}
