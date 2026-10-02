import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { lazyFeature } from '../../../src/app/LazyFeature'
import '../../../src/index.css'
import { PwaStatus } from '../../../src/features/pwa/PwaStatus'
let attempts = 0
const DeferredScreen = lazyFeature(async () => {
  attempts += 1
  return import('./lazy-screen')
}, { onBack: props => props.onClose() })
Object.assign(window, { lazyQA: { attempts: () => attempts } })
localStorage.setItem('owned-lazy-pending-proof', '[{"operationId":"owned-stable-id","account":"owned-a","xp":"pending"}]')
function Fixture() {
  const [open, setOpen] = useState(false)
  const [tick, setTick] = useState(0)
  const opener = useRef<HTMLButtonElement>(null)
  const restore = useRef(false)
  useEffect(() => {
    if (!open && restore.current) { restore.current = false; opener.current?.focus() }
  }, [open])
  const close = () => { restore.current = true; setOpen(false) }
  return <main className="p-4 space-y-4 max-w-md mx-auto">
    <button id="opener" ref={opener} onClick={() => setOpen(true)}>Mở màn hình tải sau</button>
    <button id="rerender" onClick={() => setTick(value => value + 1)}>Cập nhật {tick}</button>
    <PwaStatus canUpdate={() => !open} />
    {open && <DeferredScreen onClose={close} />}
  </main>
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><Fixture /></React.StrictMode>)
