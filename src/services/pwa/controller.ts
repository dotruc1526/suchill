import { OFFLINE_QUEUE_LOCK } from '../offline/queue.ts'
import { activateWorker, workerVersion } from './workerProtocol.ts'

export type PwaSnapshot = { offline: boolean; supported: boolean; status: 'idle' | 'waiting' | 'updating' | 'error'; waitingVersion?: string; manualSupported: boolean; reloadNeeded: boolean }
export type PwaRuntime = {
  secure: boolean; worker?: ServiceWorkerContainer; locks?: LockManager; online(): boolean; cleanLocation(): boolean
  onWindow(type: 'online' | 'offline' | 'focus', listener: () => void): void; reload(): void; channel(): MessageChannel; timeout: number
}
function browserRuntime(): PwaRuntime {
  const available = typeof window !== 'undefined' && typeof navigator !== 'undefined'
  return { secure: available && globalThis.isSecureContext, worker: available ? navigator.serviceWorker : undefined,
    locks: available ? navigator.locks : undefined, online: () => !available || navigator.onLine !== false,
    cleanLocation: () => available && !window.location.search && !window.location.hash,
    onWindow: (type, listener) => { if (available) window.addEventListener(type, listener) },
    reload: () => { if (available) window.location.reload() }, channel: () => new MessageChannel(), timeout: 10_000 }
}

/** Owns worker lifecycle only; it never reads, rewrites, clears or syncs account storage. */
export function createPwaController(runtime: PwaRuntime = browserRuntime()) {
  const supported = Boolean(runtime.secure && runtime.worker)
  let snapshot: PwaSnapshot = { offline: !runtime.online(), supported, status: 'idle', manualSupported: supported && Boolean(runtime.locks?.request), reloadNeeded: false }
  let registration: ServiceWorkerRegistration | undefined, starting: Promise<void> | undefined, listening = false
  let reloading = false
  let waiting: ServiceWorker | undefined, reloadTarget: ServiceWorker | undefined, activating = false, inspection = 0
  const listeners = new Set<() => void>(), observed = new WeakSet<ServiceWorkerRegistration>(), workers = new WeakSet<ServiceWorker>()
  const update = (changes: Partial<PwaSnapshot>) => {
    const next = { ...snapshot, ...changes }
    if (JSON.stringify(snapshot) === JSON.stringify(next)) return
    snapshot = next
    for (const listener of listeners) { try { listener() } catch { /* A consumer cannot stop lifecycle tracking. */ } }
  }
  const inspect = async () => {
    if (activating) return
    const ticket = ++inspection, candidate = registration?.waiting
    if (!candidate) {
      if (reloadTarget && runtime.worker?.controller === reloadTarget) {
        waiting = reloadTarget; update({ status: 'waiting' }); return
      }
      waiting = undefined; reloadTarget = undefined; update({ status: 'idle', waitingVersion: undefined }); return
    }
    if (candidate.state !== 'installed') return
    try {
      const version = await workerVersion(candidate, runtime.channel, runtime.timeout)
      if (ticket !== inspection || activating || registration?.waiting !== candidate || candidate.state !== 'installed') return
      waiting = candidate; update({ status: 'waiting', waitingVersion: version })
    } catch {
      if (ticket === inspection && !activating && registration?.waiting === candidate) {
        waiting = undefined; update({ status: 'error', waitingVersion: undefined })
      }
    }
  }
  const watchWorker = (worker: ServiceWorker | null) => {
    if (!worker || workers.has(worker)) return
    workers.add(worker)
    worker.addEventListener('statechange', () => { setTimeout(() => { void inspect() }, 0) })
  }
  const watch = (value: ServiceWorkerRegistration) => {
    if (observed.has(value)) return
    observed.add(value); watchWorker(value.installing)
    value.addEventListener('updatefound', () => { watchWorker(value.installing); void inspect() })
  }
  const checkForUpdate = () => {
    update({ offline: !runtime.online() })
    if (!runtime.online() || !registration || activating) return
    void registration.update().then(inspect).catch(() => { if (!activating) update({ status: 'error' }) })
  }
  const available = (candidate: ServiceWorker) => registration?.waiting === candidate && candidate.state === 'installed'
    || reloadTarget === candidate && runtime.worker?.controller === candidate
  const safe = (canUpdate: () => boolean) => { try { return runtime.cleanLocation() && canUpdate() } catch { return false } }
  const queueLock = async <T>(callback: () => Promise<T>): Promise<T> => {
    const abort = new AbortController()
    const timer = setTimeout(() => abort.abort(), runtime.timeout)
    try {
      return await runtime.locks!.request(OFFLINE_QUEUE_LOCK, { signal: abort.signal }, async () => {
        clearTimeout(timer) // Never interrupt a progress write or an acquired lock.
        return callback()
      })
    } finally { clearTimeout(timer) }
  }
  return {
    markReloadNeeded() { update({ reloadNeeded: true }) },
    async reloadSafely(canReload: () => boolean): Promise<boolean> {
      if (activating || reloading || !snapshot.reloadNeeded || !runtime.locks || !safe(canReload) || !runtime.online()) return false
      reloading = true
      try {
        return await queueLock(async () => {
          if (!safe(canReload) || !runtime.online()) return false
          runtime.reload() // Only the document is replaced; durable pending/session bytes are untouched.
          return true
        })
      } catch { return false }
      finally { reloading = false }
    },
    getSnapshot: () => snapshot,
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener) } },
    async start(enabled: boolean): Promise<void> {
      if (!enabled || !supported || !runtime.worker) return
      if (starting) return starting
      starting = (async () => {
        try {
          if (!listening) {
            listening = true
            runtime.onWindow('online', checkForUpdate); runtime.onWindow('offline', () => update({ offline: true }))
            runtime.onWindow('focus', checkForUpdate)
            runtime.worker!.addEventListener('controllerchange', () => { if (!activating) void inspect() })
          }
          registration ??= await runtime.worker!.register('/sw.js', { scope: '/', updateViaCache: 'none' })
          watch(registration); await inspect()
        } catch { update({ status: 'error' }) }
      })().finally(() => { starting = undefined })
      return starting
    },
    async activate(canUpdate: () => boolean): Promise<boolean> {
      const candidate = waiting, version = snapshot.waitingVersion
      if (activating || reloading || !runtime.locks || !runtime.worker || !candidate || !version || snapshot.status !== 'waiting'
        || !safe(canUpdate) || !available(candidate)) return false
      activating = true; ++inspection; update({ status: 'updating' })
      try {
        return await queueLock(async () => {
          // Wait for in-flight progress writes/sync, then recheck the current screen and exact worker.
          if (!safe(canUpdate) || !available(candidate) || snapshot.waitingVersion !== version) {
            update({ status: 'waiting' }); return false
          }
          if (reloadTarget !== candidate) {
            await activateWorker(runtime.worker!, candidate, version, runtime.timeout)
            reloadTarget = candidate
          }
          if (runtime.worker!.controller !== candidate) { update({ status: 'waiting' }); return false }
          if (!safe(canUpdate)) { update({ status: 'waiting' }); return false }
          // Reload under the same lock. Durable queue bytes and SDK/Auth storage remain untouched.
          runtime.reload(); update({ status: 'idle', waitingVersion: undefined }); waiting = undefined; reloadTarget = undefined
          return true
        })
      } catch { update({ status: 'error' }); return false }
      finally { activating = false }
    },
  }
}
export const pwaController = createPwaController()
