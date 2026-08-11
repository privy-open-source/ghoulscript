# @privyid/ghostscript
> Ghostscript compiled to WebAssembly

> [!NOTE]
> This is low-level WebAssembly library which part of [@privyid/ghoulscript](https://www.npmjs.com/package/@privyid/ghoulscript).
> This use GS version `10.07.1`

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
mod.FS.mount(mod.NODEFS, { root: __dirname }, working)
mod.FS.chdir(working)

await mod.callMain([
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

### Building from source

The Ghostscript WASM build requires the [Emscripten SDK](https://emscripten.org) and runs inside a container to keep your host clean.

#### Prerequisites

- Docker with BuildKit enabled (`DOCKER_BUILDKIT=1`)
- Git submodule initialised:

  ```bash
  git submodule update --init packages/ghostscript/ghostpdl
  ```

#### Docker build

Builds into `dist/`:

```bash
DOCKER_BUILDKIT=1 docker build \
  --target builder \
  -f Dockerfile \
  . \
  --output dist/
```

Or build to a tarball first, then extract:

```bash
DOCKER_BUILDKIT=1 docker build \
  --target builder \
  -f Dockerfile \
  . \
  -o /tmp/ghostscript-wasm-build.tar

tar -xf /tmp/ghostscript-wasm-build.tar -C packages/ghostscript/
```

The build clones EMSDK 6.0.6 inside the container and runs the same `./build.sh` script that CI uses. Full compilation typically takes **10–30 minutes** depending on CPU cores.

#### Local build (alternative)

If you already have EMSDK 6.0.6 installed:

```bash
source /opt/emsdk/emsdk_env.sh   # or your emsdk activation path
yarn build
```

## Special Thank ❤️

[@jsscheller](https://github.com/jsscheller/ghostscript-wasm) - for build script.

## License

[AGPL-3.0](./LICENSE)
