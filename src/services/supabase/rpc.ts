import type { Result, ServiceErrorCode } from '../next/contracts.ts'
import { failure, success } from '../next/contracts.ts'

export type RpcResponse = { data: unknown; error: { code?: string; message?: string } | null }
export type RpcPort = (name: string, args: Record<string, unknown>) => PromiseLike<RpcResponse>
export type LearningRpc = ReturnType<typeof createLearningRpc>

export function databaseError(code?: string): ServiceErrorCode {
  if (['42501', '28000', 'PGRST301', 'PGRST302'].includes(code ?? '')) return 'unauthorized'
  if (code === 'P0002') return 'not_found'
  if (['22023', '22P02', '23514', '23503'].includes(code ?? '')) return 'validation'
  if (['40001', '23505', '23P01'].includes(code ?? '')) return 'conflict'
  return 'server_error'
}

/** All table/RPC knowledge remains inside this adapter, including error translation. */
export function createLearningRpc(port: RpcPort, online = () => typeof navigator === 'undefined' || navigator.onLine !== false) {
  async function call<T>(name: string, args: Record<string, unknown>): Promise<Result<T>> {
    if (!online()) return failure('offline')
    try {
      const response = await port(name, args)
      if (response.error) return failure(databaseError(response.error.code))
      if (response.data === undefined) return failure('server_error')
      return success(response.data as T)
    } catch {
      return failure(online() ? 'server_error' : 'offline')
    }
  }
  return {
    read: <T>(kind: string, id?: string, secondaryId?: string) => call<T>('learning_read', {
      p_kind: kind, p_id: id ?? null, p_secondary_id: secondaryId ?? null,
    }),
    command: <T>(kind: string, input: object) => call<T>('learning_command', { p_kind: kind, p_input: input }),
  }
}
