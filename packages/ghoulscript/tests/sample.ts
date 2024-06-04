import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path'
import { addPassword, combinePDF, optimizePDF, removePassword, renderPageAsImage } from '../src/index.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)

;(async () => {
  const buf = await fs.readFile(resolve(__dirname, './sample.pdf'))
  const out = await optimizePDF(buf)

  await fs.writeFile(resolve(__dirname, './out/sample.compressed.pdf'), out)

  const buf2    = await fs.readFile(resolve(__dirname, './sample-2.pdf'))
  const combine = await combinePDF([buf, buf2])

  await fs.writeFile(resolve(__dirname, './out/combine.pdf'), combine)

  const imgOut = await renderPageAsImage(buf, 2)

  await fs.writeFile(resolve(__dirname, './out/sample.jpg'), imgOut)

  const withPass = await addPassword(buf, '123456', '654321')

  await fs.writeFile(resolve(__dirname, './out/sample.protected.pdf'), withPass)

  const withoutPass = await removePassword(withPass, '654321')

  await fs.writeFile(resolve(__dirname, './out/sample.unlock.pdf'), withoutPass)
})()
