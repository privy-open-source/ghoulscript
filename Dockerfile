# ==============================================================================
# Ghostscript WASM Build — Multi-stage Dockerfile
#
# Builds @privyid/ghostscript (Ghostscript 10.07.1 compiled to WASM) inside a
# container using Emscripten 3.1.63.
#
# Requirements:
#   - BuildKit enabled (DOCKER_BUILDKIT=1)
#   - Git submodule must be initialised before build:
#       git submodule update --init packages/ghostscript/ghostpdl
#
# Build the WASM package:
#   DOCKER_BUILDKIT=1 docker build --target builder -f Dockerfile . \
#     --output packages/ghostscript/dist/
#
# Or build into a tarball and extract:
#   DOCKER_BUILDKIT=1 docker build --target builder -f Dockerfile . \
#     -o /tmp/ghoulscript-wasm-build.tar
#   tar -xf /tmp/ghoulscript-wasm-build.tar -C packages/ghostscript/
#
# Variables (with defaults):
#   EMSDK_TAG    — emsdk release tag (default: 3.1.63)
#   GS_BRANCH    — ghostpdl branch to checkout (default: gs10.07.1)
# ==============================================================================

# ── Stage 1: builder ───────────────────────────────────────────────────────────
FROM node:24-alpine AS builder

ARG EMSDK_TAG=3.1.63

# System deps for emsdk and the Ghostscript build
RUN apk add --no-cache \
      git bash python3 make cmake g++ gcc autoconf automake libtool \
      pkgconfig nasm perl

# Clone and activate a pinned Emscripten release
RUN git clone --depth 1 --branch ${EMSDK_TAG} \
      https://github.com/emscripten-core/emsdk.git /opt/emsdk

RUN cd /opt/emsdk \
 && ./emsdk install ${EMSDK_TAG} \
 && ./emsdk activate ${EMSDK_TAG}

ENV PATH="/opt/emsdk:/opt/emsdk/upstream/emscripten:${PATH}"
ENV EMSDK="/opt/emsdk"

# build.sh sets ROOT=$PWD and cd's into $ROOT/ghostpdl — so we must run it
# from the ghostscript package directory.  The build context is the monorepo
# root; we COPY the ghostscript package contents into the right location.
WORKDIR /workspace/packages/ghostscript

# Package metadata + build scripts (paths from the repo-root build context)
COPY packages/ghostscript/package.json ./
COPY packages/ghostscript/LICENSE     ./
COPY packages/ghostscript/build.sh    ./
COPY packages/ghostscript/build/      ./build/

# Validate submodule presence before running the build
RUN if [ ! -d "ghostpdl" ]; then \
      echo "ERROR: ghostpdl submodule is missing from the build context." >&2; \
      echo "Run: git submodule update --init packages/ghostscript/ghostpdl" >&2; \
      exit 1; \
    fi

# Run the upstream build script (reads ghostpdl/, writes dist/ next to package.json)
RUN bash build.sh

# ── Stage 2: runner ───────────────────────────────────────────────────────────
# Tiny image for downstream consumers that want to bundle the built dist/
FROM alpine:3.24 AS runner

RUN apk add --no-cache nodejs tini

COPY --from=builder /workspace/packages/ghostscript/dist /dist

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node"]
