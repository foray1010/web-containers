import postcss from 'postcss'
import postcssPresetEnv from 'postcss-preset-env'
import babel from 'rollup-plugin-babel'
import copy from 'rollup-plugin-copy'
import html from 'rollup-plugin-fill-html'
import resolve from 'rollup-plugin-node-resolve'
import svelte from 'rollup-plugin-svelte'

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs'
  },
  plugins: [
    babel({
      extensions: ['.ts', '.mjs', '.js']
    }),
    copy({
      'manifest.json': 'dist/manifest.json',
      verbose: true
    }),
    html({
      template: 'src/index.html',
      filename: 'index.html'
    }),
    resolve({
      extensions: ['.ts', '.mjs', '.js', '.json']
    }),
    svelte({
      css: (css) => {
        css.write('dist/bundle.css')
      },
      preprocess: {
        style: async ({content}) => {
          const result = await postcss([postcssPresetEnv()]).process(content)
          return {
            code: result.css,
            map: result.map
          }
        }
      }
    })
  ]
}
