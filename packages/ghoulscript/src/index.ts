import type {
  CommandArgs,
  CommandResult,
  Commands,
} from './rpc.js'
import {
  callRPC,
  callWorkerRPC,
} from './rpc.js'

interface GSConfig {
  useWebWorker: boolean,
}

const config: GSConfig = { useWebWorker: typeof window !== 'undefined' }

export function configureGS (config_: Partial<GSConfig>) {
  Object.assign(config, config_)
}

async function call <C extends Commands> (name: C, args: CommandArgs<C>): Promise<CommandResult<C>> {
  return config.useWebWorker
    ? await callWorkerRPC(name, args)
    : await callRPC(name, args)
}

export async function optimizePDF (...args: CommandArgs<'optimizePDF'>): CommandResult<'optimizePDF'> {
  return await call('optimizePDF', args)
}

export async function combinePDF (...args: CommandArgs<'combinePDF'>): CommandResult<'combinePDF'> {
  return await call('combinePDF', args)
}

export async function splitPdf (...args: CommandArgs<'splitPdf'>): CommandResult<'splitPdf'> {
  return await call('splitPdf', args)
}

export async function addPassword (...args: CommandArgs<'addPassword'>): CommandResult<'addPassword'> {
  return await call('addPassword', args)
}

export async function removePassword (...args: CommandArgs<'removePassword'>): CommandResult<'removePassword'> {
  return await call('removePassword', args)
}

export async function renderPageAsImage (...args: CommandArgs<'renderPageAsImage'>): CommandResult<'renderPageAsImage'> {
  return await call('renderPageAsImage', args)
}

export async function getInfo (...args: CommandArgs<'getInfo'>): CommandResult<'getInfo'> {
  return await call('getInfo', args)
}
