export type PublicSupabaseConfig = Readonly<{
  url: string
  publishableKey: string
}>

/** Accept only the two browser-safe Vite variables; never accept a privileged key. */
export function readPublicSupabaseConfig(
  env: Record<string, string | undefined>,
): PublicSupabaseConfig {
  const url = env.VITE_SUPABASE_URL?.trim()
  const publishableKey = env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()

  if (!url || !publishableKey) {
    throw new Error('Missing public Supabase configuration')
  }

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    throw new Error('Invalid public Supabase URL')
  }
  if (parsed.protocol !== 'https:' && !(parsed.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(parsed.hostname))) {
    throw new Error('Invalid public Supabase URL protocol')
  }

  // Fail closed: the browser accepts only a new publishable key or a legacy anon JWT.
  if (/(service[_-]?role|secret)/i.test(publishableKey)) {
    throw new Error('Privileged key cannot be used in browser configuration')
  }
  if (!/^sb_publishable_[A-Za-z0-9_-]+$/.test(publishableKey)) {
    const parts = publishableKey.split('.')
    if (parts.length !== 3 || !parts.every(Boolean)) {
      throw new Error('Only a publishable or anon key is allowed in browser configuration')
    }
    try {
      const decoded: unknown = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
      const role = typeof decoded === 'object' && decoded !== null && 'role' in decoded
        ? decoded.role
        : undefined
      if (role === 'service_role') {
        throw new Error('Privileged key cannot be used in browser configuration')
      }
      if (role !== 'anon') {
        throw new Error('Only a publishable or anon key is allowed in browser configuration')
      }
    } catch (error) {
      if (error instanceof Error && error.message.startsWith('Privileged key')) throw error
      throw new Error('Only a publishable or anon key is allowed in browser configuration')
    }
  }

  return { url: parsed.origin, publishableKey }
}
