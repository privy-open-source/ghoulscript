export interface GSModule extends EmscriptenModule {
  version: string,
  callMain: (args: string[]) => Promise<number>,
  FS: typeof FS,
  NODEFS: Emscripten.FileSystemType,
  WORKERFS: Emscripten.FileSystemType,
}

declare const initGS: EmscriptenModuleFactory<GSModule>

export default initGS
