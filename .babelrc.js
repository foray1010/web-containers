'use strict'

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        useBuiltIns: 'entry',
      },
    ],
    [
      '@babel/preset-typescript',
      {
        allExtensions: true,
      },
    ],
  ],
  env: {
    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            modules: 'commonjs',
            useBuiltIns: 'entry',
          },
        ],
      ],
    },
    production: {
      plugins: [
        [
          'babel-plugin-transform-remove-console',
          { exclude: ['error', 'warn'] },
        ],
      ],
    },
  },
}
