import fs from 'fs'
import path from 'path'
import {promisify} from 'util'

import chalk from 'chalk'
import * as ts from 'typescript'

import tsconfig from './tsconfig.json'

const unlinkFileAsync = promisify(fs.unlink)
const writeFileAsync = promisify(fs.writeFile)

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
  await writeFileAsync(tmpFilePath, content)

  const compilerOptions = ts.convertCompilerOptionsFromJson(
    tsconfig.compilerOptions || {},
    process.cwd()
  )

  const program = ts.createProgram([tmpFilePath], {
    ...compilerOptions.options,
    // not sure why this setting need to be disabled
    isolatedModules: false,
    noEmit: true
  })
  const emitResult = program.emit()

  const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)
  allDiagnostics.forEach((diagnostic) => {
    const fileName = path.relative(process.cwd(), filePath)
    console.error(
      chalk.red(`${fileName}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`)
    )
  })

  // cleanup
  await unlinkFileAsync(tmpFilePath)

  return {
    code: content
  }
}