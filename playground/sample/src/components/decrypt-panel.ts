/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { removePassword, isRequirePassword } from '../types'
import {
  renderError, renderLoading, setupDropZone,
} from '../ui'

export function createDecryptPanel (): HTMLElement {
  const el     = document.createElement('div')
  el.className = 'card'

  el.innerHTML = `
    <h3>Decrypt PDF</h3>
    <div class="drop-zone">
      <input type="file" accept="application/pdf">
      <div class="drop-zone-label">
        Drop a PDF here or <strong>click to browse</strong>
      </div>
    </div>
    <div class="field" style="margin-top:12px">
      <label for="decrypt-pass">Password</label>
      <input type="password" id="decrypt-pass" placeholder="123456">
    </div>
    <button class="btn" id="decrypt-btn">Remove password</button>
    <div id="result"></div>
  `

  const dropZone  = el.querySelector<HTMLElement>('.drop-zone') as HTMLElement
  const result    = el.querySelector<HTMLElement>('#result') as HTMLElement
  const passInput = el.querySelector<HTMLInputElement>('#decrypt-pass') as HTMLInputElement
  const btn       = el.querySelector<HTMLButtonElement>('#decrypt-btn') as HTMLButtonElement

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

    const password = passInput.value
    if (!password) {
      renderError(result, 'Enter the password')
      return
    }

    renderLoading(result, 'Removing password…')

    try {
      const output = (await removePassword(currentFile as unknown as Uint8Array, password)) as Uint8Array
      const locked = (await isRequirePassword(output)) as boolean

      const url = URL.createObjectURL(new Blob([output], { type: 'application/pdf' }))

      result.innerHTML = `
        <div class="result">
          <div>Decrypted &mdash; ${locked ? '<span class="status-badge true">Still requires password</span>' : '<span class="status-badge false">No password required</span>'}</div>
          <div style="margin-top:8px"><a href="${url}" download="decrypted.pdf" class="btn" onclick="URL.revokeObjectURL(this.href)">Download</a></div>
        </div>
      `
    } catch (error) {
      renderError(result, String(error))
    }
  })

  return el
}
