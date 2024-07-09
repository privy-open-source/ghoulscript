import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    {
      input : 'src/',
      outDir: 'dist/',
      format: 'esm',
    },
    {
      input      : 'src/',
      outDir     : 'dist/',
      format     : 'cjs',
      ext        : 'cjs',
      declaration: false,
    },
  ],
  declaration: true,
  rollup     : { emitCJS: true },
})
