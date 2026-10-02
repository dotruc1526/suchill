import { readFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

export const expectedProjectRef = 'kyfqlhpweetsridmqkvl'
export const projectRoot = fileURLToPath(new URL('../../', import.meta.url))

export function validateHostedConfig(values) {
  if (values.SUCHILL_HOSTED_TEST_ALLOW !== '1') throw new Error('Hosted tests require explicit file opt-in')
  if (values.SUCHILL_HOSTED_PROJECT_REF !== expectedProjectRef ||
      values.SUCHILL_HOSTED_URL !== `https://${expectedProjectRef}.supabase.co`) {
    throw new Error('Hosted tests only target the authorized fresh Sử Chill test project')
  }
  if (!/^sb_publishable_[A-Za-z0-9_-]+$/.test(values.SUCHILL_HOSTED_PUBLISHABLE_KEY ?? '') ||
      !/^sb_secret_[A-Za-z0-9_-]+$/.test(values.SUCHILL_HOSTED_SECRET_KEY ?? '')) {
    throw new Error('Hosted tests require separate publishable and trusted secret keys')
  }
  return Object.freeze({ url: values.SUCHILL_HOSTED_URL, projectRef: expectedProjectRef,
    publishableKey: values.SUCHILL_HOSTED_PUBLISHABLE_KEY, secretKey: values.SUCHILL_HOSTED_SECRET_KEY })
}

export async function loadHostedConfig() {
  const filename = '.env.hosted-test.local'
  try { execFileSync('git', ['check-ignore', '-q', '--', filename], { cwd: projectRoot, stdio: 'ignore' }) }
  catch { throw new Error('Hosted credential file must be Git-ignored and untracked') }
  let raw
  try { raw = await readFile(new URL(`../../${filename}`, import.meta.url), 'utf8') }
  catch { throw new Error('Ignored hosted test environment file is not ready') }
  const values = {}
  for (const originalLine of raw.split(/\r?\n/)) {
    const line = originalLine.trim()
    if (!line || line.startsWith('#')) continue
    const match = /^([A-Z][A-Z0-9_]*)=(.*)$/.exec(line)
    if (!match || Object.hasOwn(values, match[1])) throw new Error('Hosted environment syntax is invalid')
    let value = match[2].trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1)
    values[match[1]] = value
  }
  return validateHostedConfig(values)
}
