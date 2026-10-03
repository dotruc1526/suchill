import test from 'node:test'
import assert from 'node:assert/strict'
import { createPwaController, type PwaRuntime } from '../../src/services/pwa/controller.ts'
import { OfflineQueue, OFFLINE_QUEUE_LOCK } from '../../src/services/offline/queue.ts'

const v1 = '11111111111111111111', v2 = '22222222222222222222', v3 = '33333333333333333333'
const turn = () => new Promise<void>(resolve => setTimeout(resolve, 0))
class Worker extends EventTarget {
  state = 'installed'; version: string; answer = true; ports: MessagePort[] = []
  messages: Array<{ type: string; version?: string }> = []; activation = () => {}
  constructor(version: string) { super(); this.version = version }
  postMessage(message: { type: string; version?: string }, ports: MessagePort[] = []) {
    this.messages.push(message)
    if (message.type === 'GET_VERSION') { this.ports.push(ports[0]); if (this.answer) ports[0].postMessage({ version: this.version }) }
    if (message.type === 'ACTIVATE_UPDATE') this.activation()
  }
  respond() { this.ports.at(-1)?.postMessage({ version: this.version }) }
  activations() { return this.messages.filter(message => message.type === 'ACTIVATE_UPDATE') }
}
function fixture({ secure = true, locks = true, version = v2, timeout = 100 } = {}) {
  const oldWorker = new Worker(v1), waiting = new Worker(version)
  const registration = Object.assign(new EventTarget(), { waiting: waiting as Worker | null, installing: null as Worker | null,
    async update() { updates += 1; return registration } })
  const container = Object.assign(new EventTarget(), { controller: oldWorker as Worker | null,
    async register(url: string, options: unknown) {
      registrations.push({ url, options })
      if (registrationErrors > 0) { registrationErrors -= 1; throw new Error('Fixture registration failure') }
      return registration
    } })
  let registrations: unknown[] = [], updates = 0, reloads = 0, registrationErrors = 0
  let online = true, clean = true, lockTail = Promise.resolve(), insideLock = false
  const lockNames: string[] = [], events = new Map<string, Set<() => void>>()
  const manager = { request<T>(name: string, options: { signal?: AbortSignal } | (() => Promise<T>), cb?: () => Promise<T>) {
    const callback = typeof options === 'function' ? options : cb!
    const signal = typeof options === 'function' ? undefined : options.signal
    lockNames.push(name)
    const result = lockTail.then(async () => { if (signal?.aborted) throw new DOMException('Aborted', 'AbortError'); insideLock = true; try { return await callback() } finally { insideLock = false } })
    lockTail = result.then(() => undefined, () => undefined)
    if (!signal) return result
    return new Promise<T>((resolve, reject) => {
      const abort = () => reject(new DOMException('Aborted', 'AbortError'))
      if (signal.aborted) { abort(); return }
      signal.addEventListener('abort', abort, { once: true })
      result.then(resolve, reject).finally(() => signal.removeEventListener('abort', abort))
    })
  } }
  waiting.activation = () => {
    assert.equal(insideLock, true, 'Activation must remain inside the canonical queue lock.')
    waiting.state = 'activated'; registration.waiting = null; container.controller = waiting
    container.dispatchEvent(new Event('controllerchange'))
  }
  const runtime: PwaRuntime = { secure, worker: container as unknown as ServiceWorkerContainer,
    locks: locks ? manager as unknown as LockManager : undefined, timeout,
    online: () => online, cleanLocation: () => clean,
    onWindow(type, listener) { if (!events.has(type)) events.set(type, new Set()); events.get(type)!.add(listener) },
    reload() { assert.equal(insideLock, true, 'Reload must happen before the queue lock is released.'); reloads += 1 },
    channel: () => new MessageChannel() }
  const controller = createPwaController(runtime)
  return { controller, runtime, container, registration, waiting, manager, registrations, lockNames, events,
    reloads: () => reloads, updates: () => updates, failRegistration() { registrationErrors += 1 },
    setOnline(value: boolean) { online = value }, setClean(value: boolean) { clean = value },
    event(type: string) { events.get(type)?.forEach(listener => listener()) } }
}

test('production gating and insecure contexts never register or attach lifecycle listeners', async () => {
  const disabled = fixture(), insecure = fixture({ secure: false })
  await disabled.controller.start(false); await insecure.controller.start(true)
  assert.equal(disabled.registrations.length, 0); assert.equal(disabled.events.size, 0)
  assert.equal(insecure.registrations.length, 0); assert.equal(insecure.controller.getSnapshot().supported, false)
})

test('start is idempotent and waiting metadata never automatically activates or reloads', async () => {
  const f = fixture()
  await Promise.all([f.controller.start(true), f.controller.start(true)])
  const snapshot = f.controller.getSnapshot()
  assert.deepEqual(snapshot, { offline: false, supported: true, status: 'waiting', waitingVersion: v2, manualSupported: true, reloadNeeded: false })
  assert.equal(f.controller.getSnapshot(), snapshot, 'Unchanged snapshot must have stable identity for useSyncExternalStore.')
  assert.deepEqual(f.registrations, [{ url: '/sw.js', options: { scope: '/', updateViaCache: 'none' } }])
  assert.equal(f.waiting.activations().length, 0); assert.equal(f.reloads(), 0)
  await f.controller.start(true)
  assert.equal(f.registrations.length, 1)
  for (const listeners of f.events.values()) assert.equal(listeners.size, 1)
})

test('registration failure is nonthrowing and a user retry reuses listeners while recovering', async () => {
  const f = fixture(); f.failRegistration()
  await f.controller.start(true)
  assert.equal(f.controller.getSnapshot().status, 'error')
  await f.controller.start(true)
  assert.equal(f.controller.getSnapshot().status, 'waiting')
  assert.equal(f.registrations.length, 2)
  for (const listeners of f.events.values()) assert.equal(listeners.size, 1)
})

test('unsafe Home predicate, callback URL or missing Web Locks cannot activate an update', async () => {
  const f = fixture(); await f.controller.start(true)
  assert.equal(await f.controller.activate(() => false), false)
  f.setClean(false)
  assert.equal(await f.controller.activate(() => true), false)
  assert.equal(f.lockNames.length, 0); assert.equal(f.waiting.activations().length, 0)
  const legacy = fixture({ locks: false }); await legacy.controller.start(true)
  assert.equal(legacy.controller.getSnapshot().manualSupported, false)
  assert.equal(await legacy.controller.activate(() => true), false)
  assert.equal(legacy.waiting.activations().length, 0)
})

test('the safe predicate is rechecked after waiting for an in-flight queue write', async () => {
  const f = fixture(); await f.controller.start(true)
  let release!: () => void, safe = true
  const write = f.manager.request(OFFLINE_QUEUE_LOCK, () => new Promise<void>(resolve => { release = resolve }))
  await turn()
  const activation = f.controller.activate(() => safe)
  assert.equal(f.controller.getSnapshot().status, 'updating')
  safe = false; release(); await write
  assert.equal(await activation, false)
  assert.equal(f.waiting.activations().length, 0); assert.equal(f.reloads(), 0)
  assert.equal(f.controller.getSnapshot().status, 'waiting')
  assert.deepEqual(f.lockNames, [OFFLINE_QUEUE_LOCK, OFFLINE_QUEUE_LOCK])
})

test('a replaced waiting worker cannot receive activation after the lock wait', async () => {
  const f = fixture(); await f.controller.start(true)
  let release!: () => void
  const write = f.manager.request(OFFLINE_QUEUE_LOCK, () => new Promise<void>(resolve => { release = resolve }))
  await turn()
  const activation = f.controller.activate(() => true)
  const replacement = new Worker(v3); f.registration.waiting = replacement
  release(); await write
  assert.equal(await activation, false)
  assert.equal(f.waiting.activations().length, 0); assert.equal(replacement.activations().length, 0)
  await f.controller.start(true)
  assert.equal(f.controller.getSnapshot().waitingVersion, v3)
})

test('activation and reload wait for actual OfflineQueue persistence and preserve its exact bytes', async () => {
  const f = fixture(); await f.controller.start(true)
  const original = Object.getOwnPropertyDescriptor(globalThis, 'navigator')
  let raw: string | null = null, release!: () => void, bytesAtReload: string | null = null
  const storage = { getItem: () => raw, setItem: (_key: string, value: string) => { raw = value } }
  const operation = { userId: 'fixture-user', kind: 'save_lesson_checkpoint' as const,
    input: { operationId: 'fixture-operation', lessonId: 'fixture-lesson', completedBlockIds: [] } }
  try {
    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { locks: f.manager } })
    const queue = new OfflineQueue(storage, () => true)
    const write = queue.dispatch(operation, () => new Promise(resolve => { release = () => resolve({ ok: false, error: 'offline' }) }))
    await turn()
    const reload = f.runtime.reload
    f.runtime.reload = () => { bytesAtReload = raw; reload() }
    const activation = f.controller.activate(() => true)
    await turn()
    assert.equal(f.waiting.activations().length, 0); assert.equal(raw, null)
    release(); assert.deepEqual(await write, { ok: false, error: 'offline' })
    const persisted = raw
    assert.equal(await activation, true)
    assert.equal(bytesAtReload, persisted); assert.equal(raw, persisted)
    assert.deepEqual(queue.list('fixture-user'), [operation])
    assert.equal(f.reloads(), 1); assert.equal(f.waiting.activations()[0].version, v2)
  } finally { if (original) Object.defineProperty(globalThis, 'navigator', original); else Reflect.deleteProperty(globalThis, 'navigator') }
})

test('becoming unsafe after activation defers only this exact controller reload until a later safe action', async () => {
  const f = fixture(); await f.controller.start(true)
  let safe = true
  const activate = f.waiting.activation
  f.waiting.activation = () => { activate(); safe = false }
  assert.equal(await f.controller.activate(() => safe), false)
  assert.equal(f.controller.getSnapshot().status, 'waiting'); assert.equal(f.reloads(), 0)
  assert.equal(f.waiting.activations().length, 1)
  safe = true
  assert.equal(await f.controller.activate(() => safe), true)
  assert.equal(f.waiting.activations().length, 1); assert.equal(f.reloads(), 1)
})

test('foreign controller changes never satisfy activation and timeout clears the updating spinner', async () => {
  const f = fixture({ timeout: 20 }); await f.controller.start(true)
  f.waiting.activation = () => { f.container.controller = new Worker(v3); f.container.dispatchEvent(new Event('controllerchange')) }
  assert.equal(await f.controller.activate(() => true), false)
  assert.equal(f.controller.getSnapshot().status, 'error'); assert.equal(f.reloads(), 0)
})

test('controller changes in another tab or normal activation never automatically reload this tab', async () => {
  const f = fixture(); await f.controller.start(true)
  f.container.controller = new Worker(v3); f.registration.waiting = null
  f.container.dispatchEvent(new Event('controllerchange')); await turn()
  assert.equal(f.controller.getSnapshot().status, 'idle'); assert.equal(f.reloads(), 0)
  assert.equal(f.waiting.activations().length, 0)
})

test('malformed or silent waiting metadata is bounded and cannot grant a manual activation', async () => {
  for (const silent of [false, true]) {
    const f = fixture({ version: 'unsafe-version', timeout: 20 }); f.waiting.answer = !silent
    await f.controller.start(true)
    assert.equal(f.controller.getSnapshot().status, 'error')
    assert.equal(await f.controller.activate(() => true), false)
    assert.equal(f.waiting.activations().length, 0)
  }
})

test('waiting worker replaced during metadata exchange cannot overwrite the current target version', async () => {
  const f = fixture(); f.waiting.answer = false
  const starting = f.controller.start(true)
  await turn()
  const replacement = new Worker(v3); f.registration.waiting = replacement
  f.registration.dispatchEvent(new Event('updatefound'))
  await turn(); f.waiting.respond(); await starting
  assert.equal(f.controller.getSnapshot().waitingVersion, v3)
  assert.equal(f.waiting.activations().length, 0)
})

test('online/offline/focus updates snapshot and checks for new builds without activating; unsubscribe works', async () => {
  const f = fixture(); await f.controller.start(true)
  let notifications = 0
  const stop = f.controller.subscribe(() => { notifications += 1 })
  f.setOnline(false); f.event('offline'); f.event('focus')
  assert.equal(f.controller.getSnapshot().offline, true); assert.equal(f.updates(), 0)
  f.setOnline(true); f.event('online')
  assert.equal(f.controller.getSnapshot().offline, false); assert.equal(f.updates(), 1)
  assert.equal(f.waiting.activations().length, 0); assert.equal(f.reloads(), 0)
  stop(); const recorded = notifications
  f.setOnline(false); f.event('offline')
  assert.equal(notifications, recorded)
})

test('native lazy-import recovery reloads only from online clean safe Home under the queue lock', async () => {
  const f = fixture(); f.controller.markReloadNeeded()
  assert.equal(await f.controller.reloadSafely(() => false), false)
  f.setClean(false); assert.equal(await f.controller.reloadSafely(() => true), false)
  f.setClean(true); f.setOnline(false); assert.equal(await f.controller.reloadSafely(() => true), false)
  f.setOnline(true); assert.equal(await f.controller.reloadSafely(() => true), true)
  assert.equal(f.reloads(), 1); assert.equal(f.waiting.activations().length, 0)
  assert.deepEqual(f.lockNames, [OFFLINE_QUEUE_LOCK])
})
test('lazy recovery rechecks safe Home after queued persistence and refuses a concurrent second reload', async () => {
  const f = fixture(); f.controller.markReloadNeeded()
  let release!: () => void, safe = true
  const write = f.manager.request(OFFLINE_QUEUE_LOCK, () => new Promise<void>(resolve => { release = resolve }))
  await turn()
  const reload = f.controller.reloadSafely(() => safe)
  assert.equal(await f.controller.reloadSafely(() => safe), false)
  safe = false; release(); await write
  assert.equal(await reload, false); assert.equal(f.reloads(), 0)
})
test('lock wait timeout cancels only our queued request and never an existing progress operation', async () => {
  const f = fixture({ timeout: 20 }); f.controller.markReloadNeeded()
  let release!: () => void, ended = false
  const write = f.manager.request(OFFLINE_QUEUE_LOCK, () => new Promise<void>(resolve => { release = () => { ended = true; resolve() } }))
  await turn()
  const reload = f.controller.reloadSafely(() => true)
  assert.equal(await reload, false)
  assert.equal(ended, false); assert.equal(f.reloads(), 0)
  release(); await write
  assert.equal(f.reloads(), 0)
})
