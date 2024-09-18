# @privyid/ghoulscript
> Compress, merge, split, and render pages to image using Ghostscript

## Installation

```bash
yarn add @privyid/ghoulscript
```

## How to Use

### Using on Browser (Vite)

```ts
import { optimizePDF } from '@privyid/ghoulscript'

const input = document.querySelector('input[type="file"]')

input.addEventListener('change', async () => {
  if (input.files) {
    const file      = input.files[0]
    const output    = await optimizePDF(file)
    const outputURL = URL.createObjectURL(new Blob([output], { type: 'application/pdf' }))

    window.open(outputURL, '_blank')
  }
})
```

### Using on NodeJS
```ts
import fs from 'node:fs/promises'
import { resolve } from 'node:path'
import { optimizePDF } from '@privyid/ghoulscript'

const buffer = await fs.readFile(resolve(__dirname, './sample.pdf'))
const output = await optimizePDF(buffer)

await fs.writeFile(resolve(__dirname, './sample.compressed.pdf'), output)
```

## Utilities

### optimizePDF (file: Buffer, options?: CompressOptions)

Compress and optimize PDF for Web Viewer.

```ts
import { optimizePDF } from '@privyid/ghoulscript'

const buffer = await fs.readFile(resolve(__dirname, './sample.pdf'))
const output = await optimizePDF(buffer, { password: '******' })

await fs.writeFile(resolve(__dirname, './sample.compressed.pdf'), output)
```

#### CompressOptions

| Options                   |    Type    | Default  | Description                                                                        |
|---------------------------|:----------:|:--------:|------------------------------------------------------------------------------------|
| `password`                |  `String`  |    -     | Document protection password                                                       |
| `pdfSettings`             |  `String`  | `screen` | Preset setting, valid value is `screen`, `ebook`, `printer`, `prepress`, `default` |
| `fastWebView`             | `Boolean`  |  `true`  | Enable Fast Web View (Linearization)                                               |
| `compatibilityLevel`      |  `String`  |  `1.4`   | Compability version                                                                |
| `colorConversionStrategy` |  `String`  |  `RGB`   | Color conversion strategy, valid value is `RGB`, `CMYK`                            |
| `noTransparency`          | `Boolean`  |  `true`  | Remove transparency                                                                |
| `keepPassword`            | `Boolean`  |  `true`  | Keep document password if document have a password protection                      |
| `userPassword`            |  `String`  |    -     | Set User Password to document                                                      |
| `ownerPassword`           |  `String`  |    -     | Set Owner Password to document                                                     |
| `colorImageResolution`    |  `Number`  |   300    | Color image resolution                                                             |
| `grayImageResolution`     |  `Number`  |   300    | Gray image resolution                                                              |
| `monoImageResolution`     |  `Number`  |   300    | Mono image resolution                                                              |
| `args`                    | `String[]` |    -     | Additional arguments                                                               |

### combinePDF (files: Buffer[], options?: CompressOptions)

Combine multiple PDF files into single PDF

```ts
import { combinePDF } from '@privyid/ghoulscript'

const bufferA = await fs.readFile(resolve(__dirname, './sample-1.pdf'))
const bufferB = await fs.readFile(resolve(__dirname, './sample-2.pdf'))
const output  = await combinePDF([bufferA, bufferB])

await fs.writeFile(resolve(__dirname, './sample.combine.pdf'), output)
```

### splitPdf (file: Buffer, pageList: PageList[], options?: CompressOptions)

Split single PDF into multiple files

```ts
import { splitPdf } from '@privyid/ghoulscript'

const buffer  = await fs.readFile(resolve(__dirname, './sample.pdf'))
const outputs = await splitPdf(buffer, ['1-5', '5-12'])

await fs.writeFile(resolve(__dirname, './sample.part1.pdf'), outputs[0])
await fs.writeFile(resolve(__dirname, './sample.part2.pdf'), outputs[1])
```

### addPassword (file: Buffer, userPassword: string, ownerPassword?: string)

Set new User Password and Owner Password

```ts
import { addPassword } from '@privyid/ghoulscript'

const buffer = await fs.readFile(resolve(__dirname, './sample.pdf'))
const output = await addPassword(buffer, '123456', '112233')

await fs.writeFile(resolve(__dirname, './sample.protected.pdf'), output)
```

It's equal to compressPDF's `userPassword` and `ownerPassword` options

### removePassword (file: Buffer, oldPassword: string)

Remove existing encrypted PDF

```ts
import { removePassword } from '@privyid/ghoulscript'

const buffer = await fs.readFile(resolve(__dirname, './sample.protected.pdf'))
const output = await removePassword(buffer, '123456')

await fs.writeFile(resolve(__dirname, './sample.unprotected.pdf'), output)
```

It's equal to compressPDF's `keepPassword: false`

### renderPageAsImage (file: Buffer, page: number = 1, options?: RenderOptions)

Convert specific page to image

```ts
import { renderPageAsImage } from '@privyid/ghoulscript'

const buffer = await fs.readFile(resolve(__dirname, './sample.pdf'))
const output = await renderPageAsImage(buffer, 5, { format: 'jpg' })

await fs.writeFile(resolve(__dirname, './sample.jpg'), output)
```

#### RenderOptions

| Options             |    Type    | Default | Description                                  |
|---------------------|:----------:|:-------:|----------------------------------------------|
| `resolution`        |  `Number`  |  `96`   | Render resolution                            |
| `textAlphaBits`     |  `Number`  |   `4`   | Text alpha bits, valid value is `1`-`4`      |
| `graphicsAlphaBits` |  `Number`  |   `4`   | Graphic alpha bits, valid value is `1`-`4`   |
| `format`            |  `String`  |  `jpg`  | Render format, valid value is `jpg` or `png` |
| `args`              | `String[]` |    -    | Additional arguments                         |

### getInfo (file: Buffer, options?: { password: string })

Extract pages info

```ts
import { getInfo } from '@privyid/ghoulscript'

const buffer = await fs.readFile(resolve(__dirname, './sample.pdf'))
const info   = await getInfo(buffer)

console.log(info)
/*
{
  numPages: 5,
  pages: [
    {
      page: 1,
      width: 612,
      height: 792,
    },
    {
      page: 2,
      width: 612,
      height: 792,
    },
    {
      page: 3,
      width: 612,
      height: 792,
    },
  ]
}
*/
```

### isRequirePassword (file: Buffer)

Check document is require password or not to open.

```ts
import { isRequirePassword } from '@privyid/ghoulscript'

const bufferA = await fs.readFile(resolve(__dirname, './sample.pdf'))
const bufferB = await fs.readFile(resolve(__dirname, './sample.protected.pdf'))

console.log(await isRequirePassword(bufferA)) // false
console.log(await isRequirePassword(bufferB)) // true
```

## License

[AGPL-3.0](./LICENSE)
