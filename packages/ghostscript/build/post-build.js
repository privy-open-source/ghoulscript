import { writeFile, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path'
import { EOL } from 'node:os'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)

async function applyVersion () {
  const pkgJSON = JSON.parse(await readFile(resolve(__dirname, '../package.json')))
  const fileJS  = resolve(__dirname, '../dist/gs.js')
  const origin  = await readFile(fileJS)

  await writeFile(fileJS, origin.toString().replace('__VERSION__', pkgJSON.version))
}

async function createDTS () {
  const emscriptenDTS = await readFile(resolve(__dirname, '../../../node_modules/@types/emscripten/index.d.ts'))
  const gsDTS         = await readFile(resolve(__dirname, './gs.d.ts'))

  await writeFile(resolve(__dirname, '../dist/gs.d.ts'), `${emscriptenDTS}${EOL}${gsDTS}`)
}

async function main () {
  await applyVersion()
  await createDTS()
}

main()
