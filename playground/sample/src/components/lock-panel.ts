import { isRequirePassword } from '../types'
import {
  renderError, renderLoading, setupDropZone,
} from '../ui'

export function createLockPanel (): HTMLElement {
  const el     = document.createElement('div')
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

  const dropZone = el.querySelector<HTMLElement>('.drop-zone') as HTMLElement
  const result   = el.querySelector<HTMLElement>('#result') as HTMLElement

  setupDropZone(dropZone, async (file) => {
    renderLoading(result, 'Checking…')

    try {
      const locked = await isRequirePassword(file)

      result.innerHTML = ''

      const wrapper           = document.createElement('div')
      wrapper.className       = 'result'
      wrapper.style.textAlign = 'center'
      wrapper.style.padding   = '24px'

      const badge       = document.createElement('span')
      badge.className   = `status-badge ${locked ? 'true' : 'false'}`
      badge.textContent = locked ? 'REQUIRES PASSWORD' : 'NOT LOCKED'

      const nameEl           = document.createElement('div')
      nameEl.style.marginTop = '8px'
      nameEl.style.fontSize  = '0.75rem'
      nameEl.style.color     = 'var(--text-muted)'
      nameEl.textContent     = file.name

      wrapper.append(badge)
      wrapper.append(nameEl)
      result.append(wrapper)
    } catch (error) {
      renderError(result, String(error))
    }
  })

  return el
}
