import { isRequirePassword } from '../types'
import { renderError, renderLoading, setupDropZone } from '../ui'

export function createLockPanel (): HTMLElement {
  const el = document.createElement('div')
  el.className = 'card'

  el.innerHTML = `
    <h3>Check Password Lock</h3>
    <div class="drop-zone">
      <input type="file" accept="application/pdf">
      <div class="drop-zone-label">
        Drop a PDF here or <strong>click to browse</strong>
      </div>
    </div>
    <div id="result"></div>
  `

  const dropZone = el.querySelector<HTMLElement>('.drop-zone')!
  const result = el.querySelector<HTMLElement>('#result')!

  setupDropZone(dropZone, async (file) => {
    renderLoading(result, 'Checking…')

    try {
      const locked = await isRequirePassword(file)

      result.innerHTML = `
        <div class="result" style="text-align:center;padding:24px">
          <span class="status-badge ${locked ? 'true' : 'false'}">${locked ? 'REQUIRES PASSWORD' : 'NOT LOCKED'}</span>
          <div style="margin-top:8px;font-size:0.75rem;color:var(--text-muted)">${file.name}</div>
        </div>
      `
    } catch (err) {
      renderError(result, String(err))
    }
  })

  return el
}
