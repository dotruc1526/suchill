import type { AccountService, AccountSettings, AccountSummary, AuthService, AuthSession } from '../services/next/accountContracts.ts'

type AccountSource = { auth: AuthService; account: AccountService }
export type AccountSnapshot =
  | { status: 'ready'; session: AuthSession | null; summary: AccountSummary | null; settings: AccountSettings | null }
  | { status: 'error'; session: AuthSession | null }
  | { status: 'changed' }

/** Commit preferences and rewards only from one uninterrupted account read. */
export async function readAccountSnapshot(source: AccountSource): Promise<AccountSnapshot> {
  let actor: string | null | undefined, generation = 0
  let unsubscribe = () => {}
  let session: AuthSession | null = null
  try {
    unsubscribe = source.auth.subscribe(session => {
      const next = session?.userId ?? null
      if (actor !== undefined && actor !== next) generation += 1
      actor = next
    })
    const initial = await source.auth.getSession()
    if (!initial.ok) return { status: 'error', session: null }
    session = initial.value
    const userId = session?.userId ?? null
    if (actor !== undefined && actor !== userId) return { status: 'changed' }
    actor = userId
    const epoch = generation
    const [summary, settings] = session
      ? await Promise.all([source.account.getSummary(), source.account.getSettings()])
      : [null, null]
    const final = await source.auth.getSession()
    if (epoch !== generation || !final.ok || (final.value?.userId ?? null) !== userId) return { status: 'changed' }
    if (!session) return { status: 'ready', session: null, summary: null, settings: null }
    if (!summary?.ok || !settings?.ok || summary.value.userId !== userId) return { status: 'error', session }
    return { status: 'ready', session, summary: summary.value, settings: settings.value }
  } catch {
    return { status: 'error', session: null }
  } finally {
    unsubscribe()
  }
}
