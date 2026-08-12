import './styles.css'
import { createOptimizePanel } from './components/optimize-panel'
import { createCombinePanel } from './components/combine-panel'
import { createSplitPanel } from './components/split-panel'
import { createEncryptPanel } from './components/encrypt-panel'
import { createDecryptPanel } from './components/decrypt-panel'
import { createRenderPanel } from './components/render-panel'
import { createInfoPanel } from './components/info-panel'
import { createLockPanel } from './components/lock-panel'

const tabsContainer = document.querySelector<HTMLElement>('#tabs')!
const panelsContainer = document.querySelector<HTMLElement>('#panels')!
const timer = document.querySelector<HTMLElement>('#timer')

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

definitions.forEach((def, index) => {
  const btn = document.createElement('button')
  btn.className = `tab-btn${index === 0 ? ' active' : ''}`
  btn.textContent = def.label
  btn.dataset.target = def.label

  const panel = def.create()
  panel.className = `panel${index === 0 ? ' active' : ''}`

  btn.addEventListener('click', () => {
    tabsContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'))
    panelsContainer.querySelectorAll('.panel').forEach(p => p.classList.remove('active'))
    btn.classList.add('active')
    panel.classList.add('active')
  })

  tabsContainer.appendChild(btn)
  panelsContainer.appendChild(panel)
})

setInterval(() => {
  if (timer)
    timer.textContent = new Date().toString()
}, 1000)
