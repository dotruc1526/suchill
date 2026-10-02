import type { Result } from '../../../services/next/backendContracts.ts'

/** One user action owns one stable ID, including retries and overlapping clicks. */
export class CompletionOperation<T> {
  readonly operationId: string
  private inFlight?: Promise<Result<T>>
  private confirmed?: Result<T>
  private readonly execute: (operationId: string) => Promise<Result<T>>

  constructor(execute: (operationId: string) => Promise<Result<T>>, operationId: string = globalThis.crypto.randomUUID()) {
    this.execute = execute
    this.operationId = operationId
  }

  run(): Promise<Result<T>> {
    if (this.confirmed) return Promise.resolve(this.confirmed)
    if (this.inFlight) return this.inFlight
    this.inFlight = Promise.resolve().then(() => this.execute(this.operationId))
      .catch((): Result<T> => ({ ok: false, error: 'server_error' }))
      .then(result => {
        if (result.ok) this.confirmed = result
        this.inFlight = undefined
        return result
      })
    return this.inFlight
  }
}
