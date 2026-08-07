# Ghoulscript
> PDF Utillities using Ghostscript WASM, work on Browser and NodeJS

## Documentation

[Read documentation here](./packages/ghoulscript/README.md)

## Building from source

The Ghostscript WASM build requires the [Emscripten SDK](https://emscripten.org) and runs inside a container to keep your host clean.

### Prerequisites

- Docker with BuildKit enabled (`DOCKER_BUILDKIT=1`)
- Git submodule initialised:

  ```bash
  git submodule update --init packages/ghostscript/ghostpdl
  ```

### Docker build

Builds `@privyid/ghostscript` into `packages/ghostscript/dist/`:

```bash
DOCKER_BUILDKIT=1 docker build \
  --target builder \
  -f Dockerfile \
  . \
  --output packages/ghostscript/dist/
```

Or build to a tarball first, then extract:

```bash
DOCKER_BUILDKIT=1 docker build \
  --target builder \
  -f Dockerfile \
  . \
  -o /tmp/ghoulscript-wasm-build.tar

tar -xf /tmp/ghoulscript-wasm-build.tar -C packages/ghostscript/
```

The build clones EMSDK 3.1.63 inside the container and runs the same `./build.sh` script that CI uses. Full compilation typically takes **10–30 minutes** depending on CPU cores.

### Local build (alternative)

If you already have EMSDK 3.1.63 installed:

```bash
source /opt/emsdk/emsdk_env.sh   # or your emsdk activation path
yarn workspace @privyid/ghostscript build
```

## License

[AGPL-3.0](./LICENSE)
