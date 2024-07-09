import {
  configureGS,
  optimizePDF,
} from '@privyid/ghoulscript'

configureGS({ useCDN: false })

const input = document.querySelector<HTMLInputElement>('#input')
const timer = document.querySelector<HTMLSpanElement>('#timer')
const log   = document.querySelector<HTMLSpanElement>('#log')

input?.addEventListener('change', async () => {
  if (input.files) {
    const start = performance.now()
    const file  = input.files[0]
    const buff  = await file.arrayBuffer() as ArrayBuffer

    const result = await optimizePDF(new Uint8Array(buff)) as Uint8Array
    const diff   = Math.round((result.byteLength - buff.byteLength) / buff.byteLength * 100)

    if (log)
      log.textContent = `Result: ${buff.byteLength} => ${result.byteLength} (${diff}%), Duration: ${Math.round((performance.now() - start) / 1000)}s`
  }
})

setInterval(() => {
  if (timer)
    timer.textContent = `${new Date().toString()}`
}, 1000)
