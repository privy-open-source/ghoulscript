#!/bin/bash
set -euo pipefail

OUT_DIR="$PWD/out"
ROOT="$PWD"
EMCC_FLAGS_DEBUG="-Os -g3"
EMCC_FLAGS_RELEASE="-Oz -flto"

export CPPFLAGS="-I$OUT_DIR/include"
export LDFLAGS="-L$OUT_DIR/lib"
export PKG_CONFIG_PATH="$OUT_DIR/pkgconfig"
export EM_PKG_CONFIG_PATH="$PKG_CONFIG_PATH"
export CFLAGS="$EMCC_FLAGS_RELEASE"
export CXXFLAGS="$CFLAGS"

mkdir -p "$OUT_DIR"

cd "$ROOT/ghostpdl"

emconfigure ./autogen.sh \
  CCAUX=gcc CFLAGSAUX= CPPFLAGSAUX= \
  --host="wasm32-unknown-linux" \
  --prefix="$OUT_DIR" \
  --disable-threading \
  --disable-cups \
  --disable-dbus \
  --disable-gtk \
  --with-drivers=FILES \
  --with-arch_h="$ROOT/build/arch_wasm.h"

export GS_LDFLAGS="\
  -lnodefs.js -lworkerfs.js \
  --pre-js "$ROOT/build/pre.js" \
  --post-js "$ROOT/build/post.js" \
  --closure 1 \
  -s STACK_SIZE=131072 \
  -s EXPORT_ES6=1 \
  -s BINARYEN_EXTRA_PASSES=\"--pass-arg=max-func-params@39\" \
  -s WASM_BIGINT=1 \
  -s INITIAL_MEMORY=67108864 \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s EXPORTED_RUNTIME_METHODS='[\"callMain\",\"FS\",\"NODEFS\",\"WORKERFS\",\"ENV\"]' \
  -s INCOMING_MODULE_JS_API='[\"noInitialRun\",\"noFSInit\",\"locateFile\",\"preRun\",\"instantiateWasm\",\"print\",\"printErr\"]' \
  -s NO_DISABLE_EXCEPTION_CATCHING=1 \
  -s MODULARIZE=1 \
  -s EMULATE_FUNCTION_POINTER_CASTS=1 \
"

emmake make \
  XE=".js" \
  LDFLAGS="$LDFLAGS $GS_LDFLAGS" \
  -j install

# Copy to dist
mkdir -p "$ROOT/dist"
cd "$ROOT/dist"
cp $ROOT/ghostpdl/bin/gs.* .
cp $ROOT/build/gs.cjs .

# Apply version & create d.ts
node "$ROOT/build/post-build.js"

# Cleanup
cd "$ROOT/ghostpdl"
git clean -xdf
git checkout .

echo "Done!"
