import { createHash } from 'node:crypto'

// RFC4122 UUIDv5 namespace reserved for this offline authoring candidate.
const namespace = Buffer.from('4b82d6e35e6d55c18099e4d916d67a6f1', 'hex')
export function candidateUuid(table, domainId) {
  if (typeof table !== 'string' || typeof domainId !== 'string' || !table || !domainId.trim()) throw new Error('Missing authored identity')
  const bytes = createHash('sha1').update(namespace).update(`${table}:${domainId}`).digest().subarray(0, 16)
  bytes[6] = (bytes[6] & 0x0f) | 0x50
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = bytes.toString('hex')
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`
}

export function rowCollector() {
  const tables = new Map(), identities = new Map()
  const id = (table, domainId) => {
    const value = candidateUuid(table, domainId), key = `${table}:${domainId}`
    if (identities.has(value) && identities.get(value) !== key) throw new Error('UUID collision')
    identities.set(value, key)
    return value
  }
  const add = (table, row) => {
    const rows = tables.get(table) ?? []
    if (row.id && rows.some(item => item.id === row.id)) throw new Error(`Duplicate ${table} identity`)
    rows.push(row); tables.set(table, rows)
  }
  return { id, add, tables, identities }
}
