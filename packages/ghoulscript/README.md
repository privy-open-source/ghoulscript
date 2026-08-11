# @privyid/ghoulscript
> Compress, merge, split, and render PDFs with Ghostscript in the browser and Node.js

## Installation

```bash
yarn add @privyid/ghoulscript
```

## How to Use

### Browser

```ts
import { optimizePDF } from '@privyid/ghoulscript'

const input = document.querySelector<HTMLInputElement>('#file')

input?.addEventListener('change', async () => {
  if (input.files) {
    const file    = input.files[0]
    const output  = await optimizePDF(file)
    const blob    = new Blob([output], { type: 'application/pdf' })
    const url     = URL.createObjectURL(blob)

    window.open(url, '_blank')
  }
})
```

### NodeJS

```ts
import fs from 'node:fs/promises'
import { resolve } from 'node:path'
import { optimizePDF } from '@privyid/ghoulscript'

const buffer = await fs.readFile(resolve(__dirname, './sample.pdf'))
const output = await optimizePDF(buffer)

await fs.writeFile(resolve(__dirname, './sample.compressed.pdf'), output)
```

## Utilities

### optimizePDF (input: InputFile, options?: Partial<CompressOptions>)

Compress and optimize a PDF for web viewing.

```ts
import { optimizePDF } from '@privyid/ghoulscript'

const buffer = await fs.readFile(resolve(__dirname, './sample.pdf'))
const output = await optimizePDF(buffer, { password: '******' })

await fs.writeFile(resolve(__dirname, './sample.compressed.pdf'), output)
```

#### CompressOptions

| Option                    | Type                                                          | Default    | Description                                                    |
|---------------------------|---------------------------------------------------------------|------------|----------------------------------------------------------------|
| `password`                | `string`                                                      | —          | Password required to open the PDF                              |
| `pdfSettings`             | `'screen' \| 'ebook' \| 'printer' \| 'prepress' \| 'default'` | `'screen'` | Lower quality presets produce smaller files                    |
| `fastWebView`             | `boolean`                                                     | `true`     | Enable Fast Web View (linearization)                           |
| `compatibilityLevel`      | `string`                                                      | `'1.4'`    | PDF compatibility version                                      |
| `colorConversionStrategy` | `'RGB' \| 'CMYK'`                                             | `'RGB'`    | Output color space                                             |
| `noTransparency`          | `boolean`                                                     | `true`     | Flatten transparency (reduces size)                            |
| `keepPassword`            | `boolean`                                                     | `true`     | Preserve existing password if present; set `false` to strip it |
| `userPassword`            | `string`                                                      | —          | Set a user (viewing) password                                  |
| `ownerPassword`           | `string`                                                      | —          | Set an owner (full access) password                            |
| `colorImageResolution`    | `number`                                                      | `300`      | Downsample color images to this DPI                            |
| `grayImageResolution`     | `number`                                                      | `300`      | Downsample grayscale images to this DPI                        |
| `monoImageResolution`     | `number`                                                      | `300`      | Downsample monochrome images to this DPI                       |
| `pageList`                | `PageList`                                                    | —          | Select specific pages to keep (see [Page List](#page-list))    |
| `args`                    | `string[]`                                                    | —          | Extra Ghostscript arguments passed verbatim                    |

### combinePDF (files: InputFile[], options?: Partial<CompressOptions>)

Combine multiple PDF files into a single PDF.

```ts
import { combinePDF } from '@privyid/ghoulscript'

const bufferA = await fs.readFile(resolve(__dirname, './sample-1.pdf'))
const bufferB = await fs.readFile(resolve(__dirname, './sample-2.pdf'))
const output  = await combinePDF([bufferA, bufferB])

await fs.writeFile(resolve(__dirname, './sample.combine.pdf'), output)
```

### splitPdf (input: InputFile, pageLists: PageList[], options?: Partial<CompressOptions>)

Split a single PDF into multiple files.

```ts
import { splitPdf } from '@privyid/ghoulscript'

const buffer  = await fs.readFile(resolve(__dirname, './sample.pdf'))
const outputs = await splitPdf(buffer, ['1-5', '5-12'])

await fs.writeFile(resolve(__dirname, './sample.part1.pdf'), outputs[0])
await fs.writeFile(resolve(__dirname, './sample.part2.pdf'), outputs[1])
```

### addPassword (input: InputFile, userPassword: string, ownerPassword?: string)

Apply a user password (and optional owner password) to a PDF.

```ts
import { addPassword } from '@privyid/ghoulscript'

const buffer = await fs.readFile(resolve(__dirname, './sample.pdf'))
const output = await addPassword(buffer, '123456', '112233')

await fs.writeFile(resolve(__dirname, './sample.protected.pdf'), output)
```

Equivalent to calling `optimizePDF` with `userPassword` and `ownerPassword`.

### removePassword (input: InputFile, oldPassword: string)

Remove password protection from a PDF.

```ts
import { removePassword } from '@privyid/ghoulscript'

const buffer = await fs.readFile(resolve(__dirname, './sample.protected.pdf'))
const output = await removePassword(buffer, '123456')

await fs.writeFile(resolve(__dirname, './sample.unprotected.pdf'), output)
```

Equivalent to calling `optimizePDF` with `keepPassword: false` and `password`.

### renderPageAsImage (input: InputFile, page?: number, options?: Partial<RenderOptions>)

Render a PDF page to a JPEG or PNG image.

```ts
import { renderPageAsImage } from '@privyid/ghoulscript'

const buffer = await fs.readFile(resolve(__dirname, './sample.pdf'))
const output = await renderPageAsImage(buffer, 5, { format: 'jpg' })

await fs.writeFile(resolve(__dirname, './sample.jpg'), output)
```

#### RenderOptions

| Option              | Type                  | Default | Description                    |
|---------------------|-----------------------|---------|--------------------------------|
| `resolution`        | `number`              | `96`    | Output DPI                     |
| `textAlphaBits`     | `1` · `2` · `3` · `4` | `4`     | Text anti-aliasing quality     |
| `graphicsAlphaBits` | `1` · `2` · `3` · `4` | `4`     | Graphics anti-aliasing quality |
| `format`            | `'jpg'` · `'png'`     | `'jpg'` | Output image format            |
| `args`              | `string[]`            | —       | Extra Ghostscript arguments    |

### getInfo (input: InputFile, options?: { password?: string })

Extract page count and dimensions from a PDF.

```ts
import { getInfo } from '@privyid/ghoulscript'

const buffer = await fs.readFile(resolve(__dirname, './sample.pdf'))
const info   = await getInfo(buffer)

console.log(info)
/*
{
  numPages: 5,
  pages: [
    { page: 1, width: 612,  height: 792  },
    { page: 2, width: 612,  height: 792  },
    { page: 3, width: 612,  height: 792  },
  ]
}
*/
```

Returns `{ numPages: number, pages: Array<{ page, width, height }> }`.

### isRequirePassword (input: InputFile)

Check whether a PDF is password-protected.

```ts
import { isRequirePassword } from '@privyid/ghoulscript'

const bufferA = await fs.readFile(resolve(__dirname, './sample.pdf'))
const bufferB = await fs.readFile(resolve(__dirname, './sample.protected.pdf'))

console.log(await isRequirePassword(bufferA)) // false
console.log(await isRequirePassword(bufferB)) // true
```

## Worker Configuration

The library runs Ghostscript inside a Web Worker in the browser by default. To run synchronously on the main thread instead:

```ts
import { configureGS } from '@privyid/ghoulscript'

configureGS({ useWorker: false })
```

## Page List

Each item in `splitPdf`'s page list can be written in any of these forms:

| Form     | Example                                    |
|----------|--------------------------------------------|
| `number` | `3` — single page                          |
| tuple    | `[1, 5]` — pages 1 through 5               |
| object   | `{ start: 1, end: 5 }` — pages 1 through 5 |
| string   | `'1-5'` — pages 1 through 5                |

## License

[AGPL-3.0](./LICENSE)
