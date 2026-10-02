import { useCallback, useEffect, useRef, useState } from 'react'
import type { AccountSummary, AuthSession } from '../services/next/accountContracts'
import type { createLearningRuntime } from '../services/runtime'
import { soundService } from '../services/soundService'

export function useLearningAccount(runtime: ReturnType<typeof createLearningRuntime>) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [summary, setSummary] = useState<AccountSummary | null>(null)
  const [pending, setPending] = useState(0)
  const [rejected, setRejected] = useState(0)
  const [syncError, setSyncError] = useState(false)
  const [generation, setGeneration] = useState(0)
  const [loading, setLoading] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)
  const requestEpoch = useRef(0)
  const refresh = useCallback(async () => {
    const epoch = ++requestEpoch.current
    const current = await runtime.services.auth.getSession()
    if (epoch !== requestEpoch.current) return
    const next = current.ok ? current.value : null
    setSession(next)
    const account = next ? await runtime.services.account.getSummary() : null
    const settings = next ? await runtime.services.account.getSettings() : null
    const finalSession = await runtime.services.auth.getSession()
    if (epoch !== requestEpoch.current || !finalSession.ok || finalSession.value?.userId !== next?.userId) return
    setSummary(account?.ok ? account.value : null)
    if (settings?.ok) { soundService.setMuted(settings.value.soundMuted); setReducedMotion(settings.value.reducedMotion) }
    try {
      const items = next ? runtime.queue.list(next.userId) : []
      setPending(items.length)
      setRejected(items.filter(item => ['validation', 'conflict', 'not_found', 'unauthorized'].includes(item.error ?? '')).length)
    } catch { setSyncError(true) }
    setLoading(false)
  }, [runtime])
  const sync = useCallback(async () => {
    try { await runtime.sync(); setSyncError(false) } catch { setSyncError(true) }
    await refresh()
  }, [runtime, refresh])
  useEffect(() => {
    let active = true
    void refresh().then(() => { if (active) void sync() })
    const unsubscribe = runtime.services.auth.subscribe(nextSession => {
      // Do not issue Supabase requests inside its auth callback lock.
      requestEpoch.current += 1
      setSession(nextSession)
      setSummary(null)
      setPending(0)
      setRejected(0)
      setGeneration(value => value + 1)
      setTimeout(() => { if (active) { void refresh(); void sync() } }, 0)
    })
    const updateQueue = () => { if (active) void refresh() }
    const unsubscribeQueue = runtime.queue.subscribe(updateQueue)
    window.addEventListener('online', sync)
    window.addEventListener('storage', updateQueue)
    return () => {
      active = false; requestEpoch.current += 1; unsubscribe(); unsubscribeQueue()
      window.removeEventListener('online', sync); window.removeEventListener('storage', updateQueue)
    }
  }, [runtime, refresh, sync])
  const discardRejected = async () => {
    const userId = await runtime.currentUser()
    if (userId) await runtime.queue.discardRejected(userId)
    await sync()
  }
  return { session, summary, pending, rejected, discardRejected, syncError, generation, loading, reducedMotion, refresh, sync }
}
