import { failure, type Result } from '../next/contracts.ts'

export type PendingKind = 'save_lesson_checkpoint' | 'save_episode_checkpoint' | 'record_choice' | 'save_video_position'
  | 'submit_practice' | 'submit_scored' | 'complete_block' | 'complete_lesson' | 'complete_daily_review'
export type PendingOperation = { userId: string; kind: PendingKind; input: Record<string, unknown>; error?: string }
export type QueueStorage = Pick<Storage, 'getItem' | 'setItem'>
const key = 'suchill.pending.v1'
const kinds: PendingKind[] = ['save_lesson_checkpoint', 'save_episode_checkpoint', 'record_choice', 'save_video_position', 'submit_practice', 'submit_scored', 'complete_block', 'complete_lesson', 'complete_daily_review']
const allowed = new Set(['operationId', 'lessonId', 'blockId', 'currentBlockId', 'completedBlockIds', 'storyVersionId', 'currentSceneId', 'visitedSceneIds', 'sceneId', 'choiceId', 'replay', 'expectedRevision', 'positionSeconds', 'watchedRanges', 'questionSetId', 'attemptId', 'answers', 'method'])
const identity = (operation: PendingOperation) => `${operation.userId}:${operation.input.operationId}`

function valid(value: unknown): value is PendingOperation {
  if (!value || typeof value !== 'object') return false
  const item = value as PendingOperation
  return typeof item.userId === 'string' && Boolean(item.userId) && kinds.includes(item.kind) &&
    Boolean(item.input) && typeof item.input === 'object' && !Array.isArray(item.input) &&
    typeof item.input.operationId === 'string' && Boolean(item.input.operationId) && Object.keys(item.input).every(field => allowed.has(field))
}

export class OfflineQueue {
  private listeners = new Set<() => void>()
  private serial: Promise<unknown> = Promise.resolve()
  private storage: QueueStorage
  private online: () => boolean
  constructor(storage: QueueStorage, online = () => typeof navigator === 'undefined' || navigator.onLine !== false) {
    this.storage = storage
    this.online = online
  }
  subscribe(listener: () => void) { this.listeners.add(listener); return () => { this.listeners.delete(listener) } }
  list(userId: string): PendingOperation[] { return this.read().filter(item => item.userId === userId) }
  async discardRejected(userId: string): Promise<void> {
    await this.lock(async () => this.write(this.read().filter(item => item.userId !== userId ||
      !['validation', 'conflict', 'not_found', 'unauthorized'].includes(item.error ?? ''))))
  }
  private read(): PendingOperation[] {
    const raw: unknown = JSON.parse(this.storage.getItem(key) ?? '[]')
    if (!Array.isArray(raw) || raw.length > 200 || !raw.every(valid)) throw new Error('Invalid offline queue')
    return raw
  }
  private write(items: PendingOperation[]) {
    if (items.length > 200) throw new Error('Offline queue full')
    const value = JSON.stringify(items)
    if (value.length > 500_000) throw new Error('Offline queue full')
    this.storage.setItem(key, value)
    this.listeners.forEach(listener => listener())
  }
  private lock<T>(action: () => Promise<T>): Promise<T> {
    const execute = async (): Promise<T> => typeof navigator !== 'undefined' && navigator.locks
      ? await navigator.locks.request(key, action) : await action()
    const next = this.serial.then(execute, execute)
    this.serial = next.catch(() => undefined)
    return next
  }
  async dispatch<T>(operation: PendingOperation, send: () => Promise<Result<T>>): Promise<Result<T>> {
    if (!valid(operation)) return failure('validation')
    const snapshot = structuredClone(operation)
    try {
      return await this.lock(async () => {
        const items = this.read()
        const previous = items.find(item => identity(item) === identity(snapshot))
        if (previous && JSON.stringify([previous.kind, previous.input]) !== JSON.stringify([snapshot.kind, snapshot.input])) return failure('conflict')
        const first = items.find(item => item.userId === snapshot.userId)
        // New online work must not overtake a durable prerequisite for its owner.
        if (this.online() && (!first || identity(first) === identity(snapshot))) {
          let result: Result<T>
          try { result = await send() } catch { result = failure('server_error') }
          if (result.ok) {
            if (previous) this.write(this.read().filter(item => identity(item) !== identity(snapshot)))
            return result
          }
          if (!['offline', 'server_error'].includes(result.error)) {
            if (previous) this.write(this.read().map(item => identity(item) === identity(snapshot) ? { ...item, error: result.error } : item))
            return result
          }
        }
        if (!previous) this.write([...items, snapshot])
        return failure('offline')
      })
    } catch { return failure('server_error') }
  }
  async sync(userId: string, send: (operation: PendingOperation) => Promise<Result<unknown>>, currentUser: () => Promise<string>): Promise<void> {
    if (!this.online() || !userId) return
    await this.lock(async () => {
      for (const item of this.read().filter(operation => operation.userId === userId)) {
        if (!this.online() || await currentUser() !== userId) break
        let result: Result<unknown>
        try { result = await send(item) } catch { result = failure('server_error') }
        if (await currentUser() !== userId) break
        if (result.ok) this.write(this.read().filter(operation => identity(operation) !== identity(item)))
        else {
          this.write(this.read().map(operation => identity(operation) === identity(item) ? { ...operation, error: result.error } : operation))
          // Preserve order: a failed prerequisite cannot be bypassed by its completion.
          break
        }
      }
    })
  }
}
