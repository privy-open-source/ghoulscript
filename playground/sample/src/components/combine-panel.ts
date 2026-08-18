/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { combinePDF, getInfo } from '../types'
import type { Info } from '../types'
import {
  bytes, renderError, renderLoading, setupDropZone,
} from '../ui'

export function createCombinePanel (): HTMLElement {
  const el     = document.createElement('div')
  el.className = 'card'

  el.innerHTML = `
    <h3>Combine PDFs</h3>
    <div class="drop-zone">
      <input type="file" accept="application/pdf" multiple>
      <div class="drop-zone-label">
        Drop <strong>one or more PDFs</strong> here or <strong>click to browse</strong>
      </div>
    </div>
    <div id="result"></div>
  `

  const dropZone = el.querySelector<HTMLElement>('.drop-zone') as HTMLElement
  const result   = el.querySelector<HTMLElement>('#result') as HTMLElement

  setupDropZone(dropZone, async (_file) => {
    const input         = dropZone.querySelector<HTMLInputElement>('input[type="file"]') as HTMLInputElement
    const files: File[] = [...(input.files ?? [])].filter((f) => f.type === 'application/pdf' || f.name.endsWith('.pdf'))

    if (files.length === 0) {
      renderError(result, 'No PDF files selected')
      return
    }

    renderLoading(result, 'Combining PDFs…')

    try {
      const output = (await combinePDF(files as unknown as Uint8Array[])) as Uint8Array
      const info   = (await getInfo(output)) as Info

      const url = URL.createObjectURL(new Blob([output], { type: 'application/pdf' }))

      result.innerHTML = `
        <div class="result">
          <div>Combined: ${info.numPages} pages — ${bytes(output.byteLength)}</div>
          <div style="margin-top:8px"><a href="${url}" download="combined.pdf" class="btn" onclick="URL.revokeObjectURL(this.href)">Download</a></div>
        </div>
      `
    } catch (error) {
      renderError(result, String(error))
    }
  })

  return el
}
