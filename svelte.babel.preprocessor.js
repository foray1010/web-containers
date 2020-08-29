import * as babel from '@babel/core'

export default async function svelteBabelPreprocessor({ content, filename }) {
  const config = babel.loadPartialConfig({ filename })
  const { code, map } = await babel.transformAsync(content, config.options)
  return { code, map }
}
