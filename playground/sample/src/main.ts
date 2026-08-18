import './styles.css'
import { createOptimizePanel } from './components/optimize-panel'
import { createCombinePanel } from './components/combine-panel'
import { createSplitPanel } from './components/split-panel'
import { createEncryptPanel } from './components/encrypt-panel'
import { createDecryptPanel } from './components/decrypt-panel'
import { createRenderPanel } from './components/render-panel'
import { createInfoPanel } from './components/info-panel'
import { createLockPanel } from './components/lock-panel'

const tabsContainer   = document.querySelector<HTMLElement>('#tabs') as HTMLElement
const panelsContainer = document.querySelector<HTMLElement>('#panels') as HTMLElement
const timer           = document.querySelector<HTMLElement>('#timer')

const definitions = [
  { label: 'Optimize', create: createOptimizePanel },
  { label: 'Combine', create: createCombinePanel },
  { label: 'Split', create: createSplitPanel },
  { label: 'Encrypt', create: createEncryptPanel },
  { label: 'Decrypt', create: createDecryptPanel },
  { label: 'Render', create: createRenderPanel },
  { label: 'Info', create: createInfoPanel },
  { label: 'Lock Check', create: createLockPanel },
] as const

for (const [index, def] of definitions.entries()) {
  const btn          = document.createElement('button')
  btn.className      = `tab-btn${index === 0 ? ' active' : ''}`
  btn.textContent    = def.label
  btn.dataset.target = def.label

  const panel     = def.create()
  panel.className = `panel${index === 0 ? ' active' : ''}`

  btn.addEventListener('click', () => {
    for (const b of tabsContainer.querySelectorAll('.tab-btn')) b.classList.remove('active')
    for (const p of panelsContainer.querySelectorAll('.panel')) p.classList.remove('active')
    btn.classList.add('active')
    panel.classList.add('active')
  })

  tabsContainer.append(btn)
  panelsContainer.append(panel)
}

setInterval(() => {
  if (timer)
    timer.textContent = new Date().toString()
}, 1000)
