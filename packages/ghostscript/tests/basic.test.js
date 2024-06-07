/* eslint-disable unicorn/prefer-top-level-await */
import Module from '../dist/gs.js'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import {
  describe,
  it,
  before,
} from 'node:test'
import fs from 'node:fs'
import assert from 'node:assert'

const _filename = fileURLToPath(import.meta.url)
const _dirname  = dirname(_filename)

let gs

async function callMain (args) {
  if (!gs) {
    const mod     = await Module()
    const working = '/working'

    mod.FS.mkdir(working)
    mod.FS.mount(mod.NODEFS, { root: _dirname }, working)
    mod.FS.chdir(working)

    gs = mod
  }

  return gs.callMain(args)
}

describe('Main functionality', () => {
  before((done) => {
    fs.mkdir(`${_dirname}/out/`, (err) => {
      if (!err)
        done()
    })
  })

  it('should run --help', async () => {
    const code = await callMain(['--help'])

    assert.equal(code, 0)
  })

  it('should able to covert eps to image', async () => {
    const code = await callMain([
      '-q',
      '-dSAFER',
      '-dBATCH',
      '-dNOPAUSE',
      '-sDEVICE=png16m',
      '-dGraphicsAlphaBits=4',
      '-sOutputFile=out/tiger.png',
      'tiger.eps',
    ])

    const isExist = fs.existsSync(`${_dirname}/out/tiger.png`)

    assert.equal(code, 0)
    assert.equal(isExist, true)
  })
})
