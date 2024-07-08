import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries    : ['src/index', 'src/rpc.worker'],
  declaration: true,
  rollup     : { emitCJS: true },
})
