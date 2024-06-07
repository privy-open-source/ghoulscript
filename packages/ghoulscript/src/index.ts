import useGS from '@privyid/ghostscript'
import { defu } from 'defu'

interface PageRange {
  start: number,
  end: number,
}

type PageList = Array<number | PageRange | [number, number] | string>

interface CompressOptions {
  password?: string,
  pdfSettings: 'screen' | 'ebook' | 'printer' | 'prepress' | 'default',
  fastWebView: boolean,
  compatibilityLevel: string,
  colorConversionStrategy: 'RGB' | 'CMYK',
  noTransparency: boolean,
  ownerPassword?: string,
  userPassword?: string,
  keepPassword: boolean,
  pageList?: PageList,
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

export async function optimizePDF (input: ArrayBufferView, option: Partial<CompressOptions> = {}) {
  return await createPDF([input], option)
}

export async function combinePDF (inputs: ArrayBufferView[], option: Partial<CompressOptions> = {}) {
  return await createPDF(inputs, option)
}

export async function splitPdf (input: ArrayBufferView, pageLists: PageList[], option: Partial<CompressOptions> = {}) {
  return await Promise.all(
    pageLists.map(async (pageList) => {
      return await createPDF([input], defu({ pageList }, option))
    }),
  )
}

export async function addPassword (input: ArrayBufferView, userPassword: string, ownerPassword: string = userPassword) {
  return await createPDF([input], {
    ownerPassword,
    userPassword,
  })
}

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

interface Info {
  numPages: number,
  pages: Array<{
    page: number,
    width: number,
    height: number,
  }>,
}

export async function getInfo (input: ArrayBufferView, options: Pick<CompressOptions, 'password'> = {}): Promise<Info> {
  const info: Info = {
    numPages: 0,
    pages   : [],
  }

  const gs = await useGS({
    printErr (str) {
      const totalpageMatch = str.match(/File has (\d+) pages/)

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
