import useGS from '@privyid/ghostscript'
import { defu } from 'defu'

interface PageRange {
  start: number,
  end: number,
}

type PageList = Array<number | PageRange | [number, number] | string>

export interface CompressOptions {
  /**
   * Document protection password
   */
  password?: string,
  /**
   * PDF Preset setting
   * @default 'screen'
   */
  pdfSettings: 'screen' | 'ebook' | 'printer' | 'prepress' | 'default',
  /**
   * Enable Fast Web View (Linearization)
   * @default true
   */
  fastWebView: boolean,
  /**
   * Compability version
   * @default '1.4'
   */
  compatibilityLevel: string,
  /**
   * Color conversion strategy
   * @default 'RGB'
   */
  colorConversionStrategy: 'RGB' | 'CMYK',
  /**
   * Remove transparency
   * @default true
   */
  noTransparency: boolean,
  /**
   * Owner password
   */
  ownerPassword?: string,
  /**
   * User password
   */
  userPassword?: string,
  /**
   * Keep document password if document have a password protection
   * otherwise will remove the password
   * @default true
   */
  keepPassword: boolean,
  /**
   * Page list for splitting
   * @example
   * // Spesific page
   * createPDF({ pageList: [1, 2, 3] })
   * // Range page
   * createPDF({ pageList: ['1-3', '6-10'] })
   */
  pageList?: PageList,
  /**
   * Color image resolution
   * @default 300
   */
  colorImageResolution: number,
  /**
   * Gray image resolution
   * @default 300
   */
  grayImageResolution: number,
  /**
   * Monochrome image resolution
   * @default 300
   */
  monoImageResolution: number,
  /**
   * Additional arguments to Ghostscript
   */
  args: string[],
}

type InputFile = ArrayBufferView | Blob

async function readFile (input: InputFile): Promise<ArrayBufferView> {
  if (input instanceof globalThis.Blob)
    return new Uint8Array(await input.arrayBuffer())

  return input
}

async function createPDF (inputs: InputFile[], options: Partial<CompressOptions> = {}): Promise<Uint8Array> {
  const gs   = await useGS({ print () {}, printErr () {} })
  const opts = defu<CompressOptions, [CompressOptions]>(options, {
    pdfSettings            : 'screen',
    compatibilityLevel     : '1.4',
    colorConversionStrategy: 'RGB',
    fastWebView            : true,
    noTransparency         : true,
    keepPassword           : true,
    colorImageResolution   : 300,
    grayImageResolution    : 300,
    monoImageResolution    : 300,
    args                   : [],
  })

  const args = [
    ...opts.args,
    '-dQUIET',
    '-dNOPAUSE',
    '-dBATCH',
    '-dSAFER',
    '-sDEVICE=pdfwrite',
  ]

  let userPassword  = opts.userPassword
  let ownerPassword = opts.ownerPassword

  if (opts.password) {
    args.push(`-sPDFPassword=${opts.password}`)

    if (opts.keepPassword) {
      userPassword  = userPassword ?? opts.password
      ownerPassword = ownerPassword ?? opts.password
    }
  }

  if (userPassword)
    args.push(`-sUserPassword=${userPassword}`, `-sOwnerPassword=${ownerPassword ?? userPassword}`)

  if (opts.noTransparency)
    args.push('-dNOTRANSPARENCY')

  if (opts.pageList) {
    const pageList = Array.isArray(opts.pageList)
      ? opts.pageList
        .map((page) => {
          if (Array.isArray(page))
            return `${page[0]}-${page[1]}`

          if (typeof page === 'object' && page !== null)
            return `${page.start}-${page.end}`

          return page.toString()
        })
        .join(',')
      : opts.pageList

    args.push(`-sPageList=${pageList}`)
  }

  args.push(
    `-dCompatibilityLevel=${opts.compatibilityLevel}`,
    `-sColorConversionStrategy=${opts.colorConversionStrategy}`,
    `-dPDFSETTINGS=/${opts.pdfSettings}`,
    `-dFastWebView=${opts.fastWebView.toString()}`,
    `-dColorImageResolution=${opts.colorImageResolution}`,
    `-dGrayImageResolution=${opts.grayImageResolution}`,
    `-dMonoImageResolution=${opts.monoImageResolution}`,
    '-sOutputFile=./output',
  )

  for (const [i, input] of inputs.entries()) {
    const inputFilename = `./input-${i}`

    gs.FS.writeFile(inputFilename, await readFile(input))
    args.push(inputFilename)
  }

  await gs.callMain(args)

  return gs.FS.readFile('./output', { encoding: 'binary' })
}

/**
 * Optimize PDF and redure file size
 * @param input
 * @param option
 * @returns
 */
export async function optimizePDF (input: InputFile, option: Partial<CompressOptions> = {}): Promise<Uint8Array> {
  return await createPDF([input], option)
}

/**
 * Merge multiple files into single file
 * @param inputs
 * @param option
 * @returns
 */
export async function combinePDF (inputs: InputFile[], option: Partial<CompressOptions> = {}): Promise<Uint8Array> {
  return await createPDF(inputs, option)
}

/**
 * Split PDF into multiple files
 * @param input
 * @param pageLists
 * @param option
 * @returns
 */
export async function splitPdf (input: InputFile, pageLists: PageList[], option: Partial<CompressOptions> = {}): Promise<Uint8Array[]> {
  return await Promise.all(
    pageLists.map(async (pageList) => {
      return await createPDF([input], defu({ pageList }, option))
    }),
  )
}

/**
 * Add encryption password
 * @param input
 * @param userPassword
 * @param ownerPassword
 * @returns
 */
export async function addPassword (input: InputFile, userPassword: string, ownerPassword: string = userPassword): Promise<Uint8Array> {
  return await createPDF([input], {
    ownerPassword,
    userPassword,
  })
}

/**
 * Remove password
 * @param input
 * @param password
 * @returns
 */
export async function removePassword (input: InputFile, password: string): Promise<Uint8Array> {
  return await createPDF([input], { keepPassword: false, password: password })
}

export interface RenderOptions {
  /**
   * Render resolution
   * @default 96
   */
  resolution: number,
  /**
   * Text alpha bits
   * @default 4
   */
  textAlphaBits: 1 | 2 | 3 | 4,
  /**
   * Graphic alpha bits
   * @default 4
   */
  graphicsAlphaBits: 1 | 2 | 3 | 4,
  /**
   * Output format
   * @default 'jpg'
   */
  format: 'jpg' | 'png',
  /**
   * Additional arguments to Ghostscript
   */
  args: string[],
}

/**
 * Convert PDF to image
 * @param input Input buffer
 * @param pageNumber
 * @param options
 * @returns
 */
export async function renderPageAsImage (input: InputFile, pageNumber: number = 1, options: Partial<RenderOptions> = {}): Promise<Uint8Array> {
  const gs   = await useGS({ print () {}, printErr () {} })
  const opts = defu<RenderOptions, [RenderOptions]>(options, {
    format           : 'jpg',
    graphicsAlphaBits: 4,
    textAlphaBits    : 4,
    resolution       : 96,
    args             : [],
  })

  const device = opts.format === 'png' ? 'png16m' : 'jpeg'
  const args   = [
    ...opts.args,
    '-dQUIET',
    '-dNOPAUSE',
    '-dBATCH',
    '-dSAFER',
    `-sDEVICE=${device}`,
    `-sPageList=${pageNumber}`,
    `-r${opts.resolution}`,
    `-dTextAlphaBits=${opts.textAlphaBits}`,
    `-dGraphicsAlphaBits=${opts.graphicsAlphaBits}`,
    '-sOutputFile=./output',
    './input',
  ]

  gs.FS.writeFile('./input', await readFile(input))

  await gs.callMain(args)

  return gs.FS.readFile('./output', { encoding: 'binary' })
}

export interface Info {
  numPages: number,
  pages: Array<{
    page: number,
    width: number,
    height: number,
  }>,
}

/**
 * Extract PDF Meta
 * @param input
 * @param options
 * @returns
 */
export async function getInfo (input: InputFile, options: Pick<CompressOptions, 'password'> = {}): Promise<Info> {
  const info: Info = {
    numPages: 0,
    pages   : [],
  }

  const gs = await useGS({
    printErr (str) {
      const totalpageMatch = str.match(/File has (\d+) pages?/)

      if (totalpageMatch)
        info.numPages = Number.parseInt(totalpageMatch[1])

      const pageMatch = str.match(/Page (\d+) MediaBox: \[([\d .]+)]/)

      if (pageMatch) {
        const mediaBox = pageMatch[2].split(' ')

        info.pages.push({
          page  : Number.parseInt(pageMatch[1]),
          width : Number.parseFloat(mediaBox[2]),
          height: Number.parseFloat(mediaBox[3]),
        })
      }
    },
  })

  const args = [
    '-dQUIET',
    '-dNOPAUSE',
    '-dNODISPLAY',
    '-dBATCH',
    '-dSAFER',
    '-dPDFINFO',
    './input',
  ]

  if (options.password)
    args.splice(-1, 0, `-sPDFPassword=${options.password}`)

  gs.FS.writeFile('./input', await readFile(input))

  await gs.callMain(args)

  return info
}

/**
 * Check document is encrypted using password or not
 * @param input
 * @returns - true if required
 */
export async function isRequirePassword (input: InputFile): Promise<boolean> {
  let result = false

  const gs = await useGS({
    print () {},
    printErr (str) {
      if (str.match('This file requires a password for access'))
        result = true
    },
  })

  const args = [
    '-dQUIET',
    '-dNOPAUSE',
    '-dNODISPLAY',
    '-dBATCH',
    '-dSAFER',
    '-dPDFINFO',
    './input',
  ]

  gs.FS.writeFile('./input', await readFile(input))

  await gs.callMain(args)

  return result
}
