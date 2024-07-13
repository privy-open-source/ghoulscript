import * as core from './core'

export type Core = typeof core

export type Commands = keyof Core

export type CommandArgs<C extends Commands> = Parameters<Core[C]>

export type CommandResult<C extends Commands> = ReturnType<Core[C]>

export interface RPC <C extends Commands = any> {
  id: number,
  name: C,
  args: CommandArgs<C>,
}

export interface RPCResult<C extends Commands = any> {
  id: number,
  result: CommandResult<C>,
  error?: undefined,
}

let worker: Worker

export async function useWorkerRPC () {
  if (!worker)
    worker = new Worker(new URL('rpc.worker.mjs', import.meta.url), { type: 'module' })

  return worker
}

export function setWorkerRPC (worker_: Worker) {
  worker = worker_
}

export async function callWorkerRPC<C extends Commands, A extends CommandArgs<C>> (name: C, args: A) {
  const id     = Date.now()
  const worker = await useWorkerRPC()

  return await new Promise<CommandResult<C>>((resolve, reject) => {
    const onMessage = (event: MessageEvent<RPCResult<C>>) => {
      if (event.data.id === id) {
        cleanUp()

        if (event.data.error)
          reject(event.data.error)
        else
          resolve(event.data.result)
      }
    }

    const onError = (error: ErrorEvent) => {
      cleanUp()
      reject(error)
    }

    const cleanUp = () => {
      worker.removeEventListener('message', onMessage)
      worker.removeEventListener('error', onError)
    }

    worker.addEventListener('message', onMessage)
    worker.addEventListener('error', onError)

    worker.postMessage({
      id  : id,
      name: name,
      args: args,
    })
  })
}

export async function callRPC<C extends Commands> (name: C, args: CommandArgs<C>): Promise<CommandResult<C>> {
  return await (core[name] as (...args: any[]) => Promise<any>)(...args)
}
