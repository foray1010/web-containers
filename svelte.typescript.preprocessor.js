import fs from 'fs'
import path from 'path'
import {promisify} from 'util'

import * as ts from 'typescript'

import tsconfig from './tsconfig.json'

const readFile = promisify(fs.readFile)
const removeFile = promisify(fs.unlink)
const writeFile = promisify(fs.writeFile)

const getTsCompilerOptions = async (configPath) => {
  const configContents = (await readFile(configPath)).toString()
  const {config} = ts.parseConfigFileTextToJson(configPath, configContents)
  return ts.convertCompilerOptionsFromJson(config.compilerOptions || {}, process.cwd())
}

const renameBaseName = ({filePath, prefix, ext}) => {
  const fileName = path.basename(filePath, path.extname(filePath))
  const dirName = path.dirname(filePath)
  const newFilePath = path.format({
    dir: dirName,
    name: prefix + fileName,
    ext
  })
  return newFilePath
}

export default async ({content, filename: filePath}) => {
  const tmpFilePath = renameBaseName({filePath, prefix: '.svelte-typescript.', ext: '.ts'})
  await writeFile(tmpFilePath, content)

  const compilerOptions = await getTsCompilerOptions('./tsconfig.json')

  const program = ts.createProgram([tmpFilePath], {
    ...compilerOptions.options,
    // not sure why this setting need to be disabled
    isolatedModules: false,
    noEmit: true
  })
  const emitResult = program.emit()

  const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)
  console.log('allDiagnostics', allDiagnostics)

  // cleanup
  await removeFile(tmpFilePath)

  return {
    code: content
  }
}
