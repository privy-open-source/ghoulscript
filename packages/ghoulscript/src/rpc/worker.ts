/* eslint-disable @typescript-eslint/triple-slash-reference */
/* eslint-env serviceworker */

import type { RPCRequest } from '.'
import { callRPC } from './call'

self.addEventListener('message', (event: MessageEvent<RPCRequest>) => {
  const rpc = event.data
  const id  = rpc.id

  callRPC(rpc.method, rpc.params)
    .then((result) => {
      self.postMessage({
        jsonrpc: '2.0',
        id     : id,
        result : result,
      })
    })
    .catch((error) => {
      self.postMessage({
        jsonrpc: '2.0',
        id     : id,
        error  : error,
      })
    })
})
