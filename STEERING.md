# STEERING

This document captures the steering signals for the `@privyid/ghoulscript` monorepo: project direction, ownership, contribution gates, and decision-making conventions. It is the single source of truth for "how we steer this project."

---

## 1. Project Identity

| Field | Value |
|---|---|
| Name | `@privyid/ghoulscript` (monorepo: `@privyid/ghoulscript-monorepo`) |
| Purpose | PDF utilities powered by Ghostscript compiled to WebAssembly, runnable in browser and Node.js |
| License | AGPL-3.0 |
| Package Manager | Yarn 4.18.0 (Berry, nodeLinker: node-modules) |
| Node Engine | `>=24` |
| Primary Owner | Privy / Open Source team (Ade Novit, ghoulscript maintainers) |
| Current Branch Focus | `chore/bump-ghostscript-10.07.1` |

The monorepo contains:

- `packages/ghostscript/` — Ghostscript source (`ghostpdl` submodule) and WASM build scripts
- `packages/ghoulscript/` — Public API (`src/core.ts`, `src/config.ts`, `src/index.ts`) and RPC layer (`src/rpc/`)
- `playground/sample/` — Vite-powered sample app for manual verification

---

## 2. Repository Steering

### 2.1 Branching Model

- `main` — release-bearing branch; protected
- `chore/*` — dependency bumps, toolchain upgrades, build scripts
- `fix/*` — bug fixes
- `feat/*` — new user-facing functionality
- `renovate/*` — automated Renovate branches (external dependencies)

### 2.2 Versioning & Releases

- Each package is versioned independently and published to npm under the `@privyid` scope.
- Breaking changes to the `ghoulscript` API require a major version bump and an ADR entry.
- Ghostscript upstream bumps (`packages/ghostscript/ghostpdl`) are coordinated: submodule update, then wasm rebuild, then smoke test against `playground/sample`.

### 2.3 Change Risk Tiers

| Tier | Examples | Required gates |
|---|---|---|
| **Critical** | API surface changes, AGPL boundary changes, wasm ABI changes | PR review by ≥2 maintainers, full CI green, manual smoke in `playground/sample` |
| **High** | Ghostscript version bumps, RPC protocol changes | PR review by ≥1 maintainer, CI green, smoke test |
| **Medium** | Dependency upgrades via Renovate | CI green, no manual review required if Renovate-blessed |
| **Low** | Docs, comments, formatting | Husky pre-commit (lint-staged) |

---

## 3. Engineering Steering

### 3.1 Code Style

- TypeScript across all public packages
- ESLint config: `@privyid/eslint-config-persona@1.2.0` (baseline)
- Pre-commit hook runs `eslint --fix` via `lint-staged` on `*.js|*.ts|*.vue`
- Line ending: `.editorconfig` defaults apply
- Attribute EOL: `.gitattributes` controls

### 3.2 Testing Conventions

- Test runner: Vitest (workspace-level)
- `packages/ghoulscript/tests/` — public API tests
- `packages/ghostscript/tests/` — wasm-side smoke tests
- The "narrow test runner to in-repo tests, fix before() hook" pattern (see commit `308944d`) is the convention — do not pull in submodule-resident tests from the Vitest root runner.
- New features ship with tests covering: golden path, edge cases, and a regression fixture if behavior changed.

### 3.3 Build & WASM

- `packages/ghostscript/build.sh` — orchestrates the emscripten/emscripten-driven wasm build
- Build outputs land in `packages/ghostscript/build/` and `packages/ghostscript/out/`
- `ARCH_ALIGN_*` macros are required for wasm builds (see commit `87fc8d1`) — do not strip them during Ghostscript upgrades.
- Ghostscript version pin: tracked in `packages/ghostscript/.gitmodules` and the submodule pointer.

### 3.4 CI Gates (`.github/workflows/ci.yml`)

- Lint
- Type check
- Test (Vitest, scoped to in-repo tests)
- Build (workspaces, topological-dev order)

All four must pass before merge to `main`.

---

## 4. Dependency Steering

### 4.1 Renovate

- Renovate is enabled and configured (`renovate.json`).
- It opens PRs into `renovate/*` branches. These typically require only CI-green, not a deep review.
- Major-version Renovate PRs (e.g., `vite-plugin-dts 4.x`, `vitest 3.x`) **do** warrant a maintainer review because they touch the build chain.

### 4.2 Known Pinned Versions

- `@tsconfig/node24` is **not** used; the project maintains a local `tsconfig.base.json` (see commit `480bf30`).
- Node version is pinned via `.nvmrc`.

---

## 5. Decision Log

Decisions are tracked inline as ADRs via the `manage_adr` tool against the indexed project. Each ADR entry should capture: context, decision, consequences, and rollback plan.

Major decisions worth recording:

- Replace `@tsconfig/node20` with `@tsconfig/node22` (then local base) — *commit `b1e8bcb`, `480bf30`*
- Switch splitPdf to `-dFirstPage` / `-dLastPage` — *commit `f4a22fe`*
- Bump Ghostscript to 10.07.1 — *commits `9cd0bc8` and current branch*

---

## 6. Steering Signals — How We Respond

| Signal | Where we look | Response |
|---|---|---|
| New upstream Ghostscript release | `ghostpdl` submodule, Ghostscript GitHub | Bump submodule, rebuild wasm, smoke test, ADR if ABI impact |
| Renovate PR | `renovate/*` PRs | Auto-merge if patch/minor & CI green; review if major |
| Bug report against playground | `playground/sample/` repro | Reproduce, write failing test, fix, document in commit |
| Security advisory | Ghostscript upstream + deps | Patch immediately, force-publish if CVE-rated |
| API request from downstream | issues / discussions | Open RFC issue, ADR if accepted |

---

## 7. Communication Norms

- **Issues** are the source of truth for bug reports and feature requests.
- **PR descriptions** explain the *why* (commit messages carry the what).
- **Commits** follow Conventional Commits (`feat`, `fix`, `chore`, `test`, `refactor`).
- **No drive-by unrelated changes** in PRs — one concern per PR.

---

## 8. Out of Scope

The following are explicitly **not** steered by this document and should be handled elsewhere:

- License interpretation (see `LICENSE` and AGPL-3.0 upstream guidance)
- Trademark / brand decisions
- Org-level security policy

---

*Last revised: 2026-08-07 — generated as a steering snapshot for the `chore/bump-ghostscript-10.07.1` branch.*