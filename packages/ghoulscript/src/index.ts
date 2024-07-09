import { useConfig } from './config'
import type {
  CommandArgs,
  CommandResult,
  Commands,
} from './rpc'
import {
  callRPC,
  callWorkerRPC,
} from './rpc'
import type * as core from './core'

export {
  configureGS,
} from './config'

export {
  setWorkerRPC,
} from './rpc'

async function call <C extends Commands> (name: C, args: CommandArgs<C>): Promise<CommandResult<C>> {
  return useConfig().useWorker
    ? callWorkerRPC(name, args)
    : callRPC(name, args)
}

export const optimizePDF: typeof core.optimizePDF = async (...args: CommandArgs<'optimizePDF'>): CommandResult<'optimizePDF'> => {
  return await call('optimizePDF', args)
}

export const combinePDF: typeof core.combinePDF = async (...args: CommandArgs<'combinePDF'>): CommandResult<'combinePDF'> => {
  return await call('combinePDF', args)
}

export const splitPdf: typeof core.splitPdf =  async (...args: CommandArgs<'splitPdf'>): CommandResult<'splitPdf'> => {
  return await call('splitPdf', args)
}

export const addPassword: typeof core.addPassword = async (...args: CommandArgs<'addPassword'>): CommandResult<'addPassword'> => {
  return await call('addPassword', args)
}

export const removePassword: typeof core.removePassword = async (...args: CommandArgs<'removePassword'>): CommandResult<'removePassword'> => {
  return await call('removePassword', args)
}

export const renderPageAsImage: typeof core.renderPageAsImage = async (...args: CommandArgs<'renderPageAsImage'>): CommandResult<'renderPageAsImage'> => {
  return await call('renderPageAsImage', args)
}

export const getInfo: typeof core.getInfo = async (...args: CommandArgs<'getInfo'>): CommandResult<'getInfo'> => {
  return await call('getInfo', args)
}
