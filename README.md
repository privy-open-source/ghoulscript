# Ghoulscript

> PDF utilities for the browser and Node.js, powered by Ghostscript compiled to WebAssembly.
> Merge, split, compress, render, and password-protect PDFs — all without a server.

## Packages

| Package | Description |
|---|---|
| [`@privyid/ghoulscript`](./packages/ghoulscript/) | Public API — `optimizePDF`, `combinePDF`, `splitPdf`, `renderPageAsImage`, etc. |
| [`@privyid/ghostscript`](./packages/ghostscript/) | Low-level Ghostscript WASM (`gs 10.07.1`) — for power users who need raw control. |

## Quick Start

```bash
yarn add @privyid/ghoulscript
```

```ts
import { optimizePDF, combinePDF, renderPageAsImage } from '@privyid/ghoulscript'

// Compress a PDF for web viewing
const compressed = await optimizePDF(buffer, { pdfSettings: 'screen' })

// Merge two PDFs
const merged = await combinePDF([bufA, bufB])

// Render page 3 as a JPEG
const jpg = await renderPageAsImage(buffer, 3, { format: 'jpg', resolution: 150 })
```

Works in both **browser** (Web Worker) and **Node.js** (same API, no worker).

## Documentation

Full API reference and options table: [packages/ghoulscript/README.md](./packages/ghoulscript/README.md)

## Contributing

See [STEERING.md](./STEERING.md) for project conventions, commit style, and the development workflow.

## License

[AGPL-3.0](./LICENSE)
