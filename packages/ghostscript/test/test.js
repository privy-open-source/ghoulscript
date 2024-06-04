import Module from '../dist/gs.js'
import { fileURLToPath } from 'url';
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)

let gs

async function callMain(args) {
  if (!gs) {
    const mod     = await Module()
    const working = "/working"

    mod.FS.mkdir(working)
    mod.FS.mount(mod.NODEFS, { root: __dirname }, working)
    mod.FS.chdir(working)

    gs = mod
  }

  return gs.callMain(args)
}

;(async () => {
  await callMain(['--help'])
  await callMain([
    "-q",
    "-dSAFER",
    "-dBATCH",
    "-dNOPAUSE",
    "-sDEVICE=png16m",
    "-dGraphicsAlphaBits=4",
    "-sOutputFile=out/tiger.png",
    "tiger.eps",
  ])
})()
