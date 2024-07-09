/* eslint-disable @typescript-eslint/triple-slash-reference */
/* eslint-env serviceworker */

import type { RPC } from './rpc'
import { callRPC } from './rpc'

self.addEventListener('message', (event: MessageEvent<RPC>) => {
  const rpc = event.data
  const id  = rpc.id

  callRPC(rpc.name, rpc.args)
    .then((result) => {
      self.postMessage({
        id,
        result,
      })
    })
    .catch((error) => {
      self.postMessage({
        id,
        error,
      })
    })
})
