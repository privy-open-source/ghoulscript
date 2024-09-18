
import type {
  CommandArgs,
  CommandResult,
  Commands,
} from './call'
import useRef from 'sref'
import { v7 as uuid } from 'uuid'

export interface RPCRequest <C extends Commands = any> {
  jsonrpc: '2.0',
  id: number | string,
  method: C,
  params: CommandArgs<C>,
}

export interface RPCResponse<C extends Commands = any> {
  jsonrpc: '2.0',
  id: number | string,
  result: CommandResult<C>,
  error?: undefined,
}

const worker    = useRef<Worker>()
const isLoading = useRef(false)

export async function useWorkerRPC () {
  if (isLoading.value)
    await isLoading.toBe(false)

  if (!worker.value) {
    isLoading.value = true

    try {
      const { default: RpcWorker } = await import('./worker?worker')

      worker.value = new RpcWorker({ name: 'rpc-worker' })
    } finally {
      isLoading.value = false
    }
  }

  return worker.value
}

export function setWorkerRPC (worker_: Worker) {
  worker.value = worker_
}

export async function callWorkerRPC<C extends Commands, A extends CommandArgs<C>> (method: C, params: A) {
  const id     = uuid()
  const worker = await useWorkerRPC()

  return await new Promise<CommandResult<C>>((resolve, reject) => {
    const onMessage = (event: MessageEvent<RPCResponse<C>>) => {
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
      jsonrpc: '2.0',
      id     : id,
      method : method,
      params : params,
    })
  })
}
