export {
  optimizePDF,
  combinePDF,
  splitPdf,
  addPassword,
  removePassword,
  renderPageAsImage,
  getInfo,
  isRequirePassword,
} from '@privyid/ghoulscript'

export interface CompressOptions {
  password?: string
  pdfSettings: 'screen' | 'ebook' | 'printer' | 'prepress' | 'default'
  fastWebView: boolean
  compatibilityLevel: string
  colorConversionStrategy: 'RGB' | 'CMYK'
  noTransparency: boolean
  ownerPassword?: string
  userPassword?: string
  keepPassword: boolean
  pageList?: Array<number | { start: number; end: number } | [number, number] | string>
  colorImageResolution: number
  grayImageResolution: number
  monoImageResolution: number
  args: string[]
}

export interface RenderOptions {
  resolution: number
  textAlphaBits: 1 | 2 | 3 | 4
  graphicsAlphaBits: 1 | 2 | 3 | 4
  format: 'jpg' | 'png'
  args: string[]
}

export interface Info {
  numPages: number
  pages: Array<{ page: number; width: number; height: number }>
}

export type InputFile = ArrayBufferView | Blob
