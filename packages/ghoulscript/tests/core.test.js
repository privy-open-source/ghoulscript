import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import {
  describe,
  it,
} from 'node:test'
import fs from 'node:fs/promises'
import assert from 'node:assert'
import {
  optimizePDF,
  combinePDF,
  splitPdf,
  addPassword,
  removePassword,
  isRequirePassword,
  getInfo,
} from '../dist/index.mjs'

const _filename = fileURLToPath(import.meta.url)
const _dirname  = dirname(_filename)

describe('optimizePDF', () => {
  it('should able to optimize size of PDF file', async () => {
    const input  = await fs.readFile(resolve(_dirname, './sample.pdf'))
    const output = await optimizePDF(input)

    assert.ok(output.byteLength < input.byteLength)
  })
})

describe('combinePDF', () => {
  it('should able to combine 2 PDFs into 1', async () => {
    const input  = await fs.readFile(resolve(_dirname, './sample.pdf'))
    const input2 = await fs.readFile(resolve(_dirname, './sample-2.pdf'))
    const output = await combinePDF([input, input2])

    const info1 = await getInfo(input)
    const info2 = await getInfo(input2)
    const info3 = await getInfo(output)

    assert.equal(info1.numPages + info2.numPages, info3.numPages)
  })
})

describe('splitPdf', () => {
  it('should able to split single PDF into multiple file', async () => {
    const input   = await fs.readFile(resolve(_dirname, './sample.pdf'))
    const outputs = await splitPdf(input, ['1-3', '4-10'])

    const info1 = await getInfo(outputs[0])
    const info2 = await getInfo(outputs[1])

    assert.equal(info1.numPages, 3)
    assert.equal(info2.numPages, 7)
  })
})

describe('addPassword', () => {
  it('should able to add password to PDf file', async () => {
    const input  = await fs.readFile(resolve(_dirname, './sample.pdf'))
    const output = await addPassword(input, '******')

    const a = await isRequirePassword(input)
    const b = await isRequirePassword(output)

    assert.equal(a, false)
    assert.equal(b, true)
  })
})

describe('removePassword', () => {
  it('should able to remove password existing PDF', async () => {
    const input  = await fs.readFile(resolve(_dirname, './sample.protected.pdf'))
    const output = await removePassword(input, '123456')

    const a = await isRequirePassword(input)
    const b = await isRequirePassword(output)

    assert.equal(a, true)
    assert.equal(b, false)
  })
})

describe('isRequirePassword', () => {
  it('should return false if file can be open without password', async () => {
    const input  = await fs.readFile(resolve(_dirname, './sample.pdf'))
    const result = await isRequirePassword(input)

    assert.equal(result, false)
  })

  it('should return true if file require password to open', async () => {
    const input  = await fs.readFile(resolve(_dirname, './sample.protected.pdf'))
    const result = await isRequirePassword(input)

    assert.equal(result, true)
  })
})
