/* eslint-disable @typescript-eslint/triple-slash-reference */
/* eslint-env serviceworker */

import type { RPC } from './rpc'
import { callRPC } from './rpc'
import { configureGS } from './config'

self.addEventListener('message', (event: MessageEvent<RPC>) => {
  const rpc    = event.data
  const id     = rpc.id
  const config = rpc.config

  configureGS(config)

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
