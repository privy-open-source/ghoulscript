/* eslint-disable unicorn/prefer-top-level-await */
import { writeFile, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { EOL } from 'node:os'

const _filename = fileURLToPath(import.meta.url)
const _dirname  = dirname(_filename)

async function applyVersion () {
  const pkgJSON = JSON.parse(await readFile(resolve(_dirname, '../package.json')))
  const fileJS  = resolve(_dirname, '../dist/gs.js')
  const origin  = await readFile(fileJS)

  await writeFile(fileJS, origin.toString().replace('__VERSION__', pkgJSON.version))
}

async function createDTS () {
  const emscriptenDTS = await readFile(resolve(_dirname, '../../../node_modules/@types/emscripten/index.d.ts'))
  const gsDTS         = await readFile(resolve(_dirname, './gs.d.ts'))

  await writeFile(resolve(_dirname, '../dist/gs.d.ts'), `${emscriptenDTS}${EOL}${gsDTS}`)
}

async function main () {
  await applyVersion()
  await createDTS()
}

main()
