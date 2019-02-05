import postcss from 'postcss'
import postcssPresetEnv from 'postcss-preset-env'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import copy from 'rollup-plugin-copy'
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import svelte from 'rollup-plugin-svelte'
import {terser} from 'rollup-plugin-terser'

import svelteBabelPreprocessor from './svelte.babel.preprocessor'
import svelteTypescriptPreprocessor from './svelte.typescript.preprocessor'

const appNames = ['background', 'popup']
const isProd = process.env.NODE_ENV === 'production'

export default appNames.map((appName) => ({
  input: `src/${appName}.ts`,
  output: {
    file: `dist/${appName}.js`,
    format: 'iife',
    sourcemap: isProd ? false : 'inline'
  },
  plugins: [
    babel({
      extensions: ['.ts', '.mjs', '.js']
    }),
    commonjs(),
    copy({
      'src/manifest.json': 'dist/manifest.json',
      'src/popup.html': 'dist/popup.html',
      verbose: true
    }),
    replace({
      'process.env.NODE_ENV': process.env.NODE_ENV
    }),
    resolve({
      extensions: ['.ts', '.mjs', '.js', '.json']
    }),
    svelte({
      css: (css) => {
        if (css.code) {
          css.write(`dist/${appName}.css`, false)
        }
      },
      preprocess: {
        script: async (...args) => {
          await svelteTypescriptPreprocessor(...args)
          return svelteBabelPreprocessor(...args)
        },
        style: async ({content}) => {
          const result = await postcss([postcssPresetEnv()]).process(content)
          return {
            code: result.css,
            map: result.map
          }
        }
      }
    }),
    isProd && terser()
  ]
}))
