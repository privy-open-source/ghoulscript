/* eslint-disable unicorn/prefer-top-level-await */
import {
  writeFile,
  readFile,
  copyFile,
} from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { EOL } from 'node:os'

const _filename = fileURLToPath(import.meta.url)
const _dirname  = dirname(_filename)

async function createMeta () {
  const pkgJSON = JSON.parse(await readFile(resolve(_dirname, '../package.json')))
  const meta    = {
    name     : pkgJSON.name,
    version  : pkgJSON.version,
    gsVersion: pkgJSON.gsVersion,
  }

  await writeFile(resolve(_dirname, '../dist/meta.cjs'), `module.export = ${JSON.stringify(meta)}${EOL}`)
  await writeFile(resolve(_dirname, '../dist/meta.mjs'), `export default ${JSON.stringify(meta)}${EOL}`)
  await copyFile(resolve(_dirname, './meta.d.ts'), resolve(_dirname, '../dist/meta.d.ts'))
}

async function createDTS () {
  const emscriptenDTS = await readFile(resolve(_dirname, '../../../node_modules/@types/emscripten/index.d.ts'))
  const gsDTS         = await readFile(resolve(_dirname, './gs.d.ts'))

  await writeFile(resolve(_dirname, '../dist/gs.d.ts'), `${emscriptenDTS}${EOL}${gsDTS}`)
}

async function main () {
  await createMeta()
  await createDTS()
}

main()
