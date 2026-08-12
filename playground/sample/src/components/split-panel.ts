import { splitPdf } from '../types'
import { bytes, renderError, renderLoading, setupDropZone } from '../ui'

export function createSplitPanel (): HTMLElement {
  const el = document.createElement('div')
  el.className = 'card'

  el.innerHTML = `
    <h3>Split PDF</h3>
    <div class="drop-zone">
      <input type="file" accept="application/pdf">
      <div class="drop-zone-label">
        Drop a PDF here or <strong>click to browse</strong>
      </div>
    </div>
    <div class="field" style="margin-top:12px">
      <label for="page-ranges">Page ranges (e.g. 1-3, 5, 7-9)</label>
      <input type="text" id="page-ranges" placeholder="1-3, 5, 7-9">
    </div>
    <button class="btn btn-secondary" id="split-btn">Split</button>
    <div id="result"></div>
  `

  const dropZone = el.querySelector<HTMLElement>('.drop-zone')!
  const result = el.querySelector<HTMLElement>('#result')!
  const rangesInput = el.querySelector<HTMLInputElement>('#page-ranges')!
  const splitBtn = el.querySelector<HTMLButtonElement>('#split-btn')!

  let currentFile: File | null = null

  setupDropZone(dropZone, (file) => {
    currentFile = file
    result.innerHTML = ''
  })

  splitBtn.addEventListener('click', async () => {
    if (!currentFile) {
      renderError(result, 'Please select a PDF first')
      return
    }

    const raw = rangesInput.value.trim()
    if (!raw) {
      renderError(result, 'Enter page ranges')
      return
    }

    const pageLists = raw.split(',').map(s => s.trim())

    renderLoading(result, 'Splitting PDF…')

    try {
      const outputs = await splitPdf(currentFile as unknown as Uint8Array, pageLists as never[], {})

      const links = outputs.map((output: Uint8Array, i: number) => {
        const url = URL.createObjectURL(new Blob([output], { type: 'application/pdf' }))

        return `<a href="${url}" download="split-${i + 1}.pdf" class="btn" onclick="URL.revokeObjectURL(this.href)">Split ${i + 1} (${bytes(output.byteLength)})</a>`
      }).join('')

      result.innerHTML = `<div class="result"><output-links>${links}</output-links></div>`
    } catch (err) {
      renderError(result, String(err))
    }
  })

  return el
}
