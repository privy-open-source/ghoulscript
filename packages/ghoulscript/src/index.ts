import useGS from '@privyid/ghostscript'
import { defu } from 'defu'

interface CompressOptions {
  password?: string,
  pdfSettings: 'screen' | 'ebook' | 'printer' | 'prepress' | 'default',
  fastWebView: boolean,
  compatibilityLevel: string,
  noTransparency: boolean,
  ownerPassword?: string,
  userPassword?: string,
  keepPassword: boolean,
}

async function createPDF (inputs: Array<string | ArrayBufferView>, option: Partial<CompressOptions> = {}): Promise<Uint8Array> {
  const gs   = await useGS()
  const opts = defu<CompressOptions, [CompressOptions]>(option, {
    pdfSettings       : 'screen',
    compatibilityLevel: '1.4',
    fastWebView       : true,
    noTransparency    : true,
    keepPassword      : true,
  })

  const args = [
    '-dQUIET',
    '-dNOPAUSE',
    '-dBATCH',
    '-dSAFER',
    '-sDEVICE=pdfwrite',
  ]

  let userPassword  = opts.userPassword
  let ownerPassword = opts.ownerPassword ?? opts.userPassword

  if (opts.password) {
    args.push(`-sPDFPassword=${opts.password}`)

    if (opts.keepPassword) {
      userPassword  ??= opts.password
      ownerPassword ??= opts.password
    }
  }

  if (userPassword) {
    args.push(`-sUserPassword=${userPassword}`)
    args.push(`-sOwnerPassword=${ownerPassword}`)
  }

  if (opts.noTransparency)
    args.push(`-dNOTRANSPARENCY`)

  args.push(`-dCompatibilityLevel=${opts.compatibilityLevel}`)
  args.push(`-sColorConversionStrategy=RGB`)
  args.push(`-dPDFSETTINGS=/${opts.pdfSettings}`)
  args.push(`-dFastWebView=${opts.fastWebView}`)
  args.push(`-sOutputFile=./output.pdf`)

  inputs.forEach((input, i) => {
    const inputFilename = `./input-${i}`

    gs.FS.writeFile(inputFilename, input)
    args.push(inputFilename)
  })

  await gs.callMain(args)

  return gs.FS.readFile('./output.pdf', { encoding: 'binary' })
}

export async function optimizePDF (input: string | ArrayBufferView, option: Partial<CompressOptions> = {}) {
  return createPDF([input], option)
}

export async function combinePDF (inputs: Array<string | ArrayBufferView>, option: Partial<CompressOptions> = {}) {
  return createPDF(inputs, option)
}

export async function addPassword (input: string | ArrayBufferView, ownerPassword: string, userPassword: string = ownerPassword) {
  return createPDF([input], {
    ownerPassword,
    userPassword,
  })
}

export async function removePassword (input: string | ArrayBufferView, password: string) {
  return createPDF([input], { keepPassword: false, password: password })
}


export async function renderPageAsImage (input: string | ArrayBufferView, pageNumber: number = 1) {
  const gs   = await useGS()
  const args = [
    '-dQUIET',
    '-dNOPAUSE',
    '-dBATCH',
    '-dSAFER',
    '-sDEVICE=jpeg',
    `-sPageList=${pageNumber}`,
    `-r96`,
    '-dTextAlphaBits=4',
    '-dGraphicsAlphaBits=4',
    `-sOutputFile=./output.jpg`,
    'input',
  ]

  gs.FS.writeFile('./input', input)

  await gs.callMain(args)

  return gs.FS.readFile('./output.jpg', { encoding: 'binary' })
}
