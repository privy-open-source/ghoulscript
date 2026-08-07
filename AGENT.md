# AGENT.md

Operational guide for AI coding agents (and humans) working in this repository. Read this before making non-trivial changes.

---

## 1. What this repo is

`@privyid/ghoulscript` is a monorepo of two packages that wrap Ghostscript (compiled to WebAssembly) as a JS-friendly PDF toolkit:

| Package | Purpose | Audience |
|---|---|---|
| `packages/ghostscript/` (`@privyid/ghostscript`) | Low-level WASM build of Ghostscript (`gsVersion: 10.07.1`) | Power users, build engineers |
| `packages/ghoulscript/` (`@privyid/ghoulscript`) | Public API: `optimizePDF`, `combinePDF`, `splitPdf`, `addPassword`, `removePassword`, `renderPageAsImage`, `getInfo`, `isRequirePassword` | End users, integrators |
| `playground/sample/` | Vite sample app for manual smoke testing | Humans |

Ghostscript source itself lives in the `ghostpdl` submodule (`packages/ghostscript/ghostpdl`) pinned to branch `gs10.07.1`. **Do not edit submodule contents from this repo.** Update via the upstream `ghostscript.com/ghostpdl` repo and bump the submodule pointer.

---

## 2. How the WASM is consumed

The public package instantiates the Ghostscript module lazily via `useGS()` (see `packages/ghoulscript/src/core.ts`). Each public function:

1. Calls `useGS({ print, printErr })` to get a module instance.
2. Writes input bytes to the in-memory FS (`gs.FS.writeFile('./input-…', …)`).
3. Builds a Ghostscript arg array and calls `gs.callMain(args)`.
4. Reads the output bytes back from the FS.

### Two execution modes

Controlled by `configureGS({ useWorker })` in `packages/ghoulscript/src/config.ts`:

- **Worker mode** (default in browser, when `window.Worker` exists) — runs `gs.callMain` inside a Web Worker via JSON-RPC (`src/rpc/`). Args are JSON-serializable; `Buffer`/`Uint8Array` are converted via base64.
- **Local mode** — runs in the same thread. Used in Node and when `configureGS({ useWorker: false })`.

Implication for agents: when adding new public APIs, **only use JSON-serializable types in the function signature**, or document explicitly that the function only works in local mode.

---

## 3. Adding or changing a public API

Every function in `packages/ghoulscript/src/core.ts` is exposed via:

1. **Direct export** from `src/index.ts` (the local-mode path).
2. **JSON-RPC** over the worker, dispatched via the `Commands` type union in `src/rpc/call.ts` (which is derived from `typeof core`).

So: **add the function to `core.ts` first.** The RPC machinery re-derives types automatically. No manual RPC registration needed — `callRPC` looks the method up on the `core` module via a `Map`.

Conventions for new public functions:

- Accept `InputFile = ArrayBufferView | Blob` (see `readFile` helper).
- Return `Promise<Uint8Array>` for binary outputs, or a plain JSON object for metadata.
- Keep options as a single `Partial<XxxOptions>` object so `defu()` can merge with defaults.
- Default-options pattern in `createPDF` is the reference; copy it.

---

## 4. Page-list semantics (gotcha)

`splitPdf` accepts a `PageList`:

```ts
type PageList = Array<number | PageRange | [number, number] | string>
```

There are **two code paths** for ghostscript argument generation in `createPDF`:

- If the list collapses to a single contiguous range → use `-dFirstPage=N` / `-dLastPage=M`. This is **honored by `pdfwrite`** on Ghostscript 10.07+.
- Otherwise → use `-sPageList=…` (comma-joined). This is **only honored by some device families** (e.g., `tiffsep`), not `pdfwrite` on 10.07+.

If you change `normalizePageList`, verify against `playground/sample/` and add a regression test in `packages/ghoulscript/tests/`. See commit `f4a22fe` for context.

---

## 5. Build & test

### Toolchain

- Node `>=24` (pinned via `.nvmrc`)
- Yarn 4.18.0 Berry
- EMSDK `3.1.63` (pinned in `.github/workflows/ci.yml` as `EM_VERSION`)
- `@types/emscripten@1.41.5`

### Commands

From the repo root:

```bash
yarn install --immutable   # CI-equivalent install
yarn build                  # workspaces, topological-dev
yarn test                   # vitest in ghostscript, node --test in ghoulscript
yarn lint                   # eslint --ext .js,.vue,.ts
```

Per-package:

```bash
yarn workspace @privyid/ghostscript build   # runs ./build.sh — full emscripten build
yarn workspace @privyid/ghoulscript test    # node --test
```

### Test scoping

Both packages use in-repo tests only — do not pull submodule tests into the Vitest root runner. (See commit `308944d` for the `before()` hook fix that established this convention.)

`packages/ghoulscript/tests/core.test.js` is a Node `--test` runner. Add new test files alongside with `*.test.js` naming.

---

## 6. Upgrading Ghostscript

Submodule is pinned to `gs10.07.1` (`.gitmodules`). To bump:

1. Check Ghostscript release notes for ABI / API changes (especially `ARCH_ALIGN_*`, `gs_public_*` symbols).
2. Update the submodule pointer — `git submodule set-branch --branch gs<NEW> packages/ghostscript/ghostpdl` and commit the new pointer.
3. Update `gsVersion` in `packages/ghostscript/package.json`.
4. Run `yarn workspace @privyid/ghostscript build` — expect possible build-script patches.
5. If `gsPublic`/`libgs` symbols change, edit `packages/ghostscript/build/*.js` and `packages/ghostscript/build.sh`.
6. Rebuild and re-run the playground sample against a known PDF corpus.
7. ADR entry.

Reference: commit `87fc8d1` (added missing `ARCH_ALIGN_*` macros), commit `9cd0bc8` (10.07.1 bump).

---

## 7. Code style

- TypeScript everywhere in source; ESM (`"type": "module"`).
- ESLint via `@privyid/eslint-config-persona@1.2.0` + `eslint-config-standard-with-typescript`.
- Husky pre-commit runs `eslint --fix` via `lint-staged` on `*.js|*.ts|*.vue`.
- No drive-by reformats. One concern per PR.
- Conventional Commits for messages (`feat`, `fix`, `chore`, `test`, `refactor`).
- Default to writing no comments. Comments only for non-obvious "why" (see `normalizePageList` for a good example).

---

## 8. Repository conventions agents must respect

- **Submodule is read-only from this repo.** Do not stage changes inside `packages/ghostscript/ghostpdl/`.
- **WASM build artifacts** (`packages/ghostscript/build/` and `out/`) are ignored but can be regenerated — never commit them by force.
- **Renovate branches** (`renovate/*`) handle dependency bumps; do not duplicate them manually.
- **Local `tsconfig.base.json`** replaces `@tsconfig/node*` packages. Do not reintroduce the dependency (commit `480bf30`).
- **AGPL-3.0-only** licensing — be cautious about copy-pasting from non-AGPL-compatible sources.

---

## 9. Where to look first

| Question | File |
|---|---|
| What's the public API? | `packages/ghoulscript/src/index.ts` |
| How does a command run? | `packages/ghoulscript/src/core.ts` |
| How does the worker RPC work? | `packages/ghoulscript/src/rpc/index.ts` and `src/rpc/worker.ts` |
| How is the WASM built? | `packages/ghostscript/build.sh` and `packages/ghostscript/build/pre.js` |
| Where are tests? | `packages/ghoulscript/tests/` and `packages/ghostscript/tests/` |
| CI gates? | `.github/workflows/ci.yml` |
| Project steering / process? | `STEERING.md` |
| User-facing docs? | `packages/ghoulscript/README.md` |

---

## 10. Don't

- Don't edit the `ghostpdl` submodule.
- Don't introduce `@tsconfig/node*` dependencies.
- Don't bypass ESLint (`--no-verify` etc.) — fix the lint issue.
- Don't add RPC registration code — the `Commands` type union is derived from `core.ts`.
- Don't pass non-JSON-serializable arguments through the worker boundary without explicit conversion.
- Don't force-push or amend public commits.

---

*Last revised: 2026-08-07 — generated alongside `STEERING.md`.*