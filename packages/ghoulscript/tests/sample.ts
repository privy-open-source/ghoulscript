/* eslint-disable unicorn/prefer-top-level-await */
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import {
  addPassword,
  combinePDF,
  optimizePDF,
  removePassword,
  renderPageAsImage,
  splitPdf,
} from '../dist'

const _filename = fileURLToPath(import.meta.url)
const _dirname  = dirname(_filename)

async function main () {
  const buf = await fs.readFile(resolve(_dirname, './sample.pdf'))
  const out = await optimizePDF(buf)

  await fs.writeFile(resolve(_dirname, './out/sample.compressed.pdf'), out)

  const buf2    = await fs.readFile(resolve(_dirname, './sample-2.pdf'))
  const combine = await combinePDF([buf, buf2])

  await fs.writeFile(resolve(_dirname, './out/combine.pdf'), combine)

  const imgOut = await renderPageAsImage(buf, 2)

  await fs.writeFile(resolve(_dirname, './out/sample.jpg'), imgOut)

  const withPass = await addPassword(buf, '123456', '654321')

  await fs.writeFile(resolve(_dirname, './out/sample.protected.pdf'), withPass)

  const withoutPass = await removePassword(withPass, '123456')

  await fs.writeFile(resolve(_dirname, './out/sample.unlock.pdf'), withoutPass)

  const [part0, part1] = await splitPdf(buf, [[{ start: 1, end: 5 }], [6, 7]])

  await fs.writeFile(resolve(_dirname, './out/sample.part0.pdf'), part0)
  await fs.writeFile(resolve(_dirname, './out/sample.part1.pdf'), part1)
}

void main()
