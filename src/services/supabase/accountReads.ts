import type { SupabaseClient } from '@supabase/supabase-js'
import { failure, type Result } from '../next/backendContracts.ts'
import type { LearningRpc } from './rpc.ts'

/** A read belongs to its initiating session, including A → B → A transitions. */
export function createAccountReader(client: Pick<SupabaseClient, 'auth'>, rpc: LearningRpc) {
  return async <T>(kind: string, id?: string, secondaryId?: string): Promise<Result<T>> => {
    let subject: string | null | undefined
    let generation = 0
    let unsubscribe: (() => void) | undefined
    const observe = (next: string | null) => {
      if (subject !== undefined && next !== subject) generation++
      subject = next
    }
    try {
      const { data } = client.auth.onAuthStateChange((_event, session) => observe(session?.user.id ?? null))
      unsubscribe = () => data.subscription.unsubscribe()
      const actor = await client.auth.getSession()
      if (actor.error || !actor.data.session) return failure('unauthorized')
      const userId = actor.data.session.user.id
      observe(userId)
      const started = generation
      const result = await rpc.read<T>(kind, id, secondaryId)
      const current = await client.auth.getSession()
      observe(current.data.session?.user.id ?? null)
      if (current.error || current.data.session?.user.id !== userId || generation !== started) return failure('unauthorized')
      if (!result.ok || !result.value) return result
      const value = result.value as Record<string, unknown>
      const owner = kind === 'profile' ? value.id : kind === 'resume'
        ? (value.progress as { userId?: string } | null)?.userId : value.userId
      if (owner !== undefined && owner !== userId) return failure('unauthorized')
      return result
    } catch { return failure('server_error') }
    finally { unsubscribe?.() }
  }
}
