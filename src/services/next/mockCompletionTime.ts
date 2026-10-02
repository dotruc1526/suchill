export function localDate(instant: string, timezone: string): string {
  const date = new Date(instant)
  if (!Number.isFinite(date.getTime())) throw new Error('Invalid clock')
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date)
  const field = (type: string) => parts.find(item => item.type === type)!.value
  return `${field('year')}-${field('month')}-${field('day')}`
}
export function streakSummary(days: Set<string>, today: string) {
  const sorted = [...days].filter(day => day <= today).sort()
  const number = (day: string) => Date.parse(`${day}T00:00:00Z`) / 86_400_000
  let current = 0; let longest = 0; let last: string | undefined
  for (const day of sorted) {
    current = last && number(day) - number(last) === 1 ? current + 1 : 1
    longest = Math.max(longest, current); last = day
  }
  if (!last || number(today) - number(last) > 1) current = 0
  return { current, longest }
}
