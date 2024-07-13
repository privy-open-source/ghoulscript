import { optimizePDF } from '@privyid/ghoulscript'

const input = document.querySelector<HTMLInputElement>('#input')
const timer = document.querySelector<HTMLSpanElement>('#timer')
const log   = document.querySelector<HTMLSpanElement>('#log')

function bytes (bytes: number, decimal = 2, k = 1024) {
  if (bytes === 0)
    return '0 Bytes'

  const sizes = [
    `${bytes > 1 ? 'Bytes' : 'Byte'}`,
    'KB',
    'MB',
    'GB',
    'TB',
    'PB',
    'EB',
    'ZB',
    'YB',
  ]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(decimal))} ${sizes[i]}`
}

input?.addEventListener('change', async () => {
  const file = input?.files?.[0]

  if (file) {
    try {
      const start = performance.now()

      const result = await optimizePDF(file) as Uint8Array
      const diff   = Math.round((result.byteLength - file.size) / file.size * 100)

      if (log)
        log.textContent = `Result: ${bytes(file.size)} => ${bytes(result.byteLength)} (${diff}%), Duration: ${Math.round((performance.now() - start) / 1000)}s`

      window.open(URL.createObjectURL(new Blob([result], { type: 'application/pdf' })), '_blank')
    } catch (error) {
      console.error(error)
    }
  }
})

setInterval(() => {
  if (timer)
    timer.textContent = `${new Date().toString()}`
}, 1000)
