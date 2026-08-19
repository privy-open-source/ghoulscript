/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { addPassword, isRequirePassword } from '../types'
import {
  renderError,
  renderLoading,
  setupDropZone,
} from '../ui'

export function createEncryptPanel (): HTMLElement {
  const el     = document.createElement('div')
  el.className = 'card'

  el.innerHTML = `
    <h3>Encrypt PDF</h3>
    <div class="drop-zone">
      <input type="file" accept="application/pdf">
      <div class="drop-zone-label">
        Drop a PDF here or <strong>click to browse</strong>
      </div>
    </div>
    <div class="field" style="margin-top:12px">
      <label for="user-pass">User password</label>
      <input type="password" id="user-pass">
    </div>
    <div class="field">
      <label for="owner-pass">Owner password (optional)</label>
      <input type="password" id="owner-pass">
    </div>
    <button class="btn" id="encrypt-btn">Encrypt</button>
    <div id="result"></div>
  `

  const dropZone  = el.querySelector<HTMLElement>('.drop-zone') as HTMLElement
  const result    = el.querySelector<HTMLElement>('#result') as HTMLElement
  const userPass  = el.querySelector<HTMLInputElement>('#user-pass') as HTMLInputElement
  const ownerPass = el.querySelector<HTMLInputElement>('#owner-pass') as HTMLInputElement
  const btn       = el.querySelector<HTMLButtonElement>('#encrypt-btn') as HTMLButtonElement

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

    const password = userPass.value
    if (!password) {
      renderError(result, 'Enter a user password')
      return
    }

    renderLoading(result, 'Encrypting PDF…')

    try {
      const output = (await addPassword(currentFile as unknown as Uint8Array, password, ownerPass.value || undefined)) as Uint8Array
      const locked = (await isRequirePassword(output)) as boolean

      const url = URL.createObjectURL(new Blob([output], { type: 'application/pdf' }))

      result.innerHTML = `
        <div class="result">
          <div>Encrypted &mdash; ${locked ? '<span class="status-badge true">Requires password</span>' : '<span class="status-badge false">Not locked</span>'}</div>
          <div style="margin-top:8px"><a href="${url}" download="encrypted.pdf" class="btn" onclick="URL.revokeObjectURL(this.href)">Download</a></div>
        </div>
      `
    } catch (error) {
      renderError(result, String(error))
    }
  })

  return el
}
