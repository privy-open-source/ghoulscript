import type { GSModule } from '@privyid/ghostscript'
import initGS from '@privyid/ghostscript'
import { defu } from 'defu'
import { getFileURL, useConfig } from './config'
import { joinRelativeURL } from 'ufo'

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
   * Enable Linearization
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
}

async function useGS (moduleOverrides?: Partial<GSModule>) {
  return await initGS(defu<Partial<GSModule>, [Partial<GSModule>]>(moduleOverrides, {
    locateFile (url: string, dir: string) {
      if ((typeof window !== 'undefined' || typeof importScripts === 'function') && useConfig().useCDN)
        return getFileURL(url)

      return joinRelativeURL(dir, url)
    },
  }))
}

async function createPDF (inputs: ArrayBufferView[], options: Partial<CompressOptions> = {}): Promise<Uint8Array> {
  const gs   = await useGS()
  const opts = defu<CompressOptions, [CompressOptions]>(options, {
    pdfSettings            : 'screen',
    compatibilityLevel     : '1.4',
    colorConversionStrategy: 'RGB',
    fastWebView            : true,
    noTransparency         : true,
    keepPassword           : true,
  })

  const args = [
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
    '-sOutputFile=./output',
  )

  for (const [i, input] of inputs.entries()) {
    const inputFilename = `./input-${i}`

    gs.FS.writeFile(inputFilename, input)
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
export async function optimizePDF (input: ArrayBufferView, option: Partial<CompressOptions> = {}) {
  return await createPDF([input], option)
}

/**
 * Merge multiple files into single file
 * @param inputs
 * @param option
 * @returns
 */
export async function combinePDF (inputs: ArrayBufferView[], option: Partial<CompressOptions> = {}) {
  return await createPDF(inputs, option)
}

/**
 * Split PDF into multiple files
 * @param input
 * @param pageLists
 * @param option
 * @returns
 */
export async function splitPdf (input: ArrayBufferView, pageLists: PageList[], option: Partial<CompressOptions> = {}) {
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
export async function addPassword (input: ArrayBufferView, userPassword: string, ownerPassword: string = userPassword) {
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
export async function removePassword (input: ArrayBufferView, password: string) {
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
   * @default 'jpeg'
   */
  format: 'jpg' | 'png',
}

/**
 * Convert PDF to image
 * @param input Input buffer
 * @param pageNumber
 * @param options
 * @returns
 */
export async function renderPageAsImage (input: ArrayBufferView, pageNumber: number = 1, options: Partial<RenderOptions> = {}) {
  const gs   = await useGS()
  const opts = defu<RenderOptions, [RenderOptions]>(options, {
    format           : 'jpg',
    graphicsAlphaBits: 4,
    textAlphaBits    : 4,
    resolution       : 96,
  })

  const device = opts.format === 'png' ? 'png16m' : 'jpeg'
  const args   = [
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

  gs.FS.writeFile('./input', input)

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
export async function getInfo (input: ArrayBufferView, options: Pick<CompressOptions, 'password'> = {}): Promise<Info> {
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

  gs.FS.writeFile('./input', input)

  await gs.callMain(args)

  return info
}
