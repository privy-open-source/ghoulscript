/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { optimizePDF } from '../types'
import {
  bytes, renderError, renderLoading, setupDropZone,
} from '../ui'

export function createOptimizePanel (): HTMLElement {
  const el = document.createElement('div')

  el.className = 'card'
  el.innerHTML = `
    <h3>Optimize PDF</h3>
    <div class="drop-zone">
      <input type="file" accept="application/pdf">
      <div class="drop-zone-label">
        Drop a PDF here or <strong>click to browse</strong>
      </div>
    </div>
    <div id="result"></div>
  `

  const dropZone = el.querySelector<HTMLElement>('.drop-zone') as HTMLElement
  const result   = el.querySelector<HTMLElement>('#result') as HTMLElement

  setupDropZone(dropZone, async (file) => {
    renderLoading(result, 'Optimizing PDF…')

    try {
      const start   = performance.now()
      const output  = await optimizePDF(file)
      const elapsed = ((performance.now() - start) / 1000).toFixed(2)

      const savings = file.size - output.byteLength
      const pct     = Math.round(savings / file.size * 100)

      const url = URL.createObjectURL(new Blob([output], { type: 'application/pdf' }))

      result.innerHTML = `
        <div class="result">
          <div>${bytes(file.size)} &rarr; ${bytes(output.byteLength)} (${pct > 0 ? '−' : '+'}${Math.abs(pct)}%)</div>
          <div style="color:var(--text-muted);font-size:0.75rem;margin-top:4px">${elapsed}s</div>
          <div style="margin-top:8px"><a href="${url}" download="optimized.pdf" class="btn" onclick="URL.revokeObjectURL(this.href)">Download optimized PDF</a></div>
        </div>
      `
    } catch (error) {
      renderError(result, String(error))
    }
  })

  return el
}
