/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { renderPageAsImage } from '../types'
import {
  bytes, renderError, renderLoading, setupDropZone,
} from '../ui'

export function createRenderPanel (): HTMLElement {
  const el     = document.createElement('div')
  el.className = 'card'

  el.innerHTML = `
    <h3>Render PDF Page as Image</h3>
    <div class="drop-zone">
      <input type="file" accept="application/pdf">
      <div class="drop-zone-label">
        Drop a PDF here or <strong>click to browse</strong>
      </div>
    </div>
    <div class="field" style="margin-top:12px">
      <label for="page-num">Page number</label>
      <input type="number" id="page-num" value="1" min="1">
    </div>
    <div class="field">
      <label for="format">Format</label>
      <select id="format">
        <option value="jpg">JPG</option>
        <option value="png">PNG</option>
      </select>
    </div>
    <div class="field">
      <label for="resolution">Resolution (DPI)</label>
      <input type="number" id="resolution" value="96" min="16" max="600" step="16">
    </div>
    <button class="btn" id="render-btn">Render</button>
    <div id="result"></div>
  `

  const dropZone   = el.querySelector<HTMLElement>('.drop-zone') as HTMLElement
  const result     = el.querySelector<HTMLElement>('#result') as HTMLElement
  const pageNum    = el.querySelector<HTMLInputElement>('#page-num') as HTMLInputElement
  const format     = el.querySelector<HTMLSelectElement>('#format') as HTMLSelectElement
  const resolution = el.querySelector<HTMLInputElement>('#resolution') as HTMLInputElement
  const btn        = el.querySelector<HTMLButtonElement>('#render-btn') as HTMLButtonElement

  let currentFile: File | undefined

  setupDropZone(dropZone, (file) => {
    currentFile      = file
    result.innerHTML = ''
  })

  btn.addEventListener('click', async () => {
    if (!currentFile) {
      renderError(result, 'Please select a PDF first')
      return
    }

    renderLoading(result, 'Rendering page…')

    try {
      const page   = Number.parseInt(pageNum.value, 10) || 1
      const fmt    = format.value as 'jpg' | 'png'
      const dpi    = Number.parseInt(resolution.value, 10) || 96
      const output = (await renderPageAsImage(currentFile as unknown as Uint8Array, page, { format: fmt, resolution: dpi })) as Uint8Array

      const mimeType     = fmt === 'png' ? 'image/png' : 'image/jpeg'
      const ext          = fmt
      const url          = URL.createObjectURL(new Blob([output], { type: mimeType }))
      const img          = document.createElement('img')
      img.src            = url
      img.alt            = `Page ${page}`
      img.style.maxWidth = '100%'

      const dlLink       = document.createElement('a')
      dlLink.href        = url
      dlLink.download    = `page-${page}.${ext}`
      dlLink.textContent = `Download .${ext}`
      dlLink.className   = 'btn btn-secondary'
      dlLink.addEventListener('click', () => URL.revokeObjectURL(url))

      const sizeSpan          = document.createElement('span')
      sizeSpan.textContent    = ` ${bytes(output.byteLength)}`
      sizeSpan.style.color    = 'var(--text-muted)'
      sizeSpan.style.fontSize = '0.75rem'

      result.innerHTML = ''
      result.append(img)
      result.append(document.createElement('br'))
      result.append(dlLink)
      result.append(sizeSpan)
    } catch (error) {
      renderError(result, String(error))
    }
  })

  return el
}
