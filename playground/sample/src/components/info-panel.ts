/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { getInfo } from '../types'
import type { Info } from '../types'
import {
  renderError,
  renderLoading,
  setupDropZone,
} from '../ui'

export function createInfoPanel (): HTMLElement {
  const el     = document.createElement('div')
  el.className = 'card'

  el.innerHTML = `
    <h3>Get PDF Info</h3>
    <div class="drop-zone">
      <input type="file" accept="application/pdf">
      <div class="drop-zone-label">
        Drop a PDF here or <strong>click to browse</strong>
      </div>
    </div>
    <div class="field" style="margin-top:12px">
      <label for="info-pass">Password (if protected)</label>
      <input type="password" id="info-pass">
    </div>
    <div id="result"></div>
  `

  const dropZone  = el.querySelector<HTMLElement>('.drop-zone') as HTMLElement
  const result    = el.querySelector<HTMLElement>('#result') as HTMLElement
  const passInput = el.querySelector('#info-pass') as HTMLInputElement

  setupDropZone(dropZone, async (file) => {
    renderLoading(result, 'Reading metadata…')
    result.innerHTML = ''

    try {
      const info = (await getInfo(file, passInput.value ? { password: passInput.value } : {})) as Info

      const table     = document.createElement('table')
      table.innerHTML = `
        <thead>
          <tr><th>Page</th><th>Width (pt)</th><th>Height (pt)</th></tr>
        </thead>
        <tbody>
          ${info.pages.map((p: Info['pages'][number]) => `<tr><td>${p.page}</td><td>${p.width}</td><td>${p.height}</td></tr>`).join('')}
        </tbody>
      `

      result.innerHTML = `
        <div class="result">
          <div>Pages: <strong>${info.numPages}</strong></div>
          ${table.outerHTML}
        </div>
      `
    } catch (error) {
      renderError(result, String(error))
    }
  })

  return el
}
