import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'cjs'
  },
  plugins: [
    babel(),
    resolve({
      extensions: ['.ts', '.mjs', '.js', '.json']
    })
  ]
}
