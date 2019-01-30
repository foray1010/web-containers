import postcss from 'postcss'
import postcssPresetEnv from 'postcss-preset-env'
import babel from 'rollup-plugin-babel'
import html from 'rollup-plugin-fill-html'
import resolve from 'rollup-plugin-node-resolve'
import svelte from 'rollup-plugin-svelte'

import svelteBabelPreprocessor from './svelte.babel.preprocessor'

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
        script: svelteBabelPreprocessor,
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
