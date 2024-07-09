# @privyid/ghostscript
> Ghostscript compiled to WebAssembly

> [!NOTE]
> This is low-level WebAssembly library which part of [@privyid/ghoulscript](https://www.npmjs.com/package/@privyid/ghoulscript).
> This use GS version `10.03.1`

## Installation

```bash
yarn add @privyid/ghostscript
```

## How to Use

```ts
import Module from '@privyid/ghostscript'

const mod     = await Module()
const working = '/working'

mod.FS.mkdir(working)
mod.FS.mount(mod.NODEFS, { root: _dirname }, working)
mod.FS.chdir(working)

await callMain([
  '-q',
  '-dSAFER',
  '-dBATCH',
  '-dNOPAUSE',
  '-sDEVICE=png16m',
  '-dGraphicsAlphaBits=4',
  '-sOutputFile=out/sammple.png',
  'sample.pdf',
])
```

## Development

- Clone this repo
- Install [Emcripten SDK](https://emscripten.org/docs/getting_started/downloads.html)
- Run `yarn build`
- Run `yarn test`


## Special Thank ❤️

[@jsscheller](https://github.com/jsscheller/ghostscript-wasm) - for build script.

## License

[AGPL-3.0](./LICENSE)
