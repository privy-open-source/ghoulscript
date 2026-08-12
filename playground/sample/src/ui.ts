export function bytes (bytes: number, decimal = 2, k = 1024): string {
  if (bytes === 0)
    return '0 Bytes'

  const sizes = [
    `${bytes === 1 ? 'Byte' : 'Bytes'}`,
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

export async function loadDemoFile (name: string): Promise<Blob> {
  const res = await fetch(`/${name}`)

  return res.blob()
}

export function downloadBlob (data: Uint8Array, filename: string, mimeType = 'application/pdf'): void {
  const url = URL.createObjectURL(new Blob([data], { type: mimeType }))
  const a = document.createElement('a')

  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function renderError (container: HTMLElement | null, message: string): void {
  if (!container)
    return

  container.innerHTML = `<div class="error-msg">${escapeHtml(message)}</div>`
}

export function renderLoading (container: HTMLElement | null, message = 'Processing…'): void {
  if (!container)
    return

  container.innerHTML = `<div class="loading">${message}</div>`
}

export function escapeHtml (str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function setupDropZone (
  dropZone: HTMLElement,
  callback: (file: File) => void,
): void {
  const input = dropZone.querySelector<HTMLInputElement>('input[type="file"]')!

  input.addEventListener('change', () => {
    const file = input.files?.[0]

    if (file)
      callback(file)
  })

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault()
    dropZone.classList.add('drag-over')
  })

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over')
  })

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault()
    dropZone.classList.remove('drag-over')
    const file = e.dataTransfer?.files?.[0]

    if (file)
      callback(file)
  })
}
