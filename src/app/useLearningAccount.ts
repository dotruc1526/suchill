import { useCallback, useEffect, useRef, useState } from 'react'
import type { AccountSummary, AuthSession } from '../services/next/accountContracts'
import type { createLearningRuntime } from '../services/runtime'
import { soundService } from '../services/soundService'
import { readAccountSnapshot } from './accountSnapshot'

export function useLearningAccount(runtime: ReturnType<typeof createLearningRuntime>) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [summary, setSummary] = useState<AccountSummary | null>(null)
  const [pending, setPending] = useState(0)
  const [rejected, setRejected] = useState(0)
  const [syncError, setSyncError] = useState(false)
  const [generation, setGeneration] = useState(0)
  const [loading, setLoading] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [accountError, setAccountError] = useState(false)
  const requestEpoch = useRef(0)
  const activeUserId = useRef<string | null | undefined>(undefined)
  const refresh = useCallback(async () => {
    const epoch = ++requestEpoch.current
    const snapshot = await readAccountSnapshot(runtime.services)
    if (epoch !== requestEpoch.current) return
    if (snapshot.status === 'changed') {
      setSummary(null); setLoading(false); setAccountError(true)
      return
    }
    const next = snapshot.session
    activeUserId.current = next?.userId ?? null
    setSession(next)
    setAccountError(snapshot.status === 'error')
    setSummary(snapshot.status === 'ready' ? snapshot.summary : null)
    setReducedMotion(snapshot.status === 'ready' ? snapshot.settings?.reducedMotion ?? false : false)
    try { soundService.setMuted(snapshot.status === 'ready' ? snapshot.settings?.soundMuted ?? false : true) }
    catch { setSyncError(true) }
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
      const nextId = nextSession?.userId ?? null
      const changed = activeUserId.current !== nextId
      activeUserId.current = nextId
      setSession(nextSession)
      if (changed) {
        setSummary(null)
        setPending(0)
        setRejected(0)
        setReducedMotion(false)
        try { soundService.setMuted(true) } catch { setSyncError(true) }
        setGeneration(value => value + 1)
      }
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
    const actorId = session?.userId
    try {
      if (!actorId || await runtime.currentUser() !== actorId) return
      await runtime.queue.discardRejected(actorId)
      setGeneration(value => value + 1)
      await sync()
    } catch { setSyncError(true) }
  }
  return { session, summary, pending, rejected, discardRejected, syncError, accountError, generation, loading, reducedMotion, refresh, sync }
}
