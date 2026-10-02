import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { Button, Card, EmptyState, ErrorState, LoadingState, OfflineState } from '../../components/ui'
import type { AccountSettings, AccountSummary, LearningServices, ServiceErrorCode } from '../../services/next/contracts'
import { theme } from '../../theme/tokens'
import { AccountAccess } from '../auth/AccountAccess'

type ProfileState = { status: 'loading' } | { status: 'error'; error: ServiceErrorCode } | { status: 'unauthorized' }
  | { status: 'ready'; summary: AccountSummary; settings: AccountSettings; services: LearningServices }

export function AccountProfile({ services, onAccountChange }: { services: LearningServices; onAccountChange?: () => void }) {
  const [state, setState] = useState<ProfileState>({ status: 'loading' })
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string>()
  const [saveError, setSaveError] = useState<ServiceErrorCode>()
  const revisionRef = useRef(0)
  const callbackRef = useRef(onAccountChange)
  callbackRef.current = onAccountChange
  const refresh = useCallback(async () => {
    const revision = ++revisionRef.current
    setState({ status: 'loading' }); setSaving(false); setSaveMessage(undefined); setSaveError(undefined)
    try {
      const [summary, settings] = await Promise.all([services.account.getSummary(), services.account.getSettings()])
      if (revisionRef.current !== revision) return
      if (!summary.ok || !settings.ok) {
        const error = !summary.ok ? summary.error : !settings.ok ? settings.error : 'server_error'
        setState(error === 'unauthorized' ? { status: 'unauthorized' } : { status: 'error', error })
      } else setState({ status: 'ready', summary: summary.value, settings: settings.value, services })
    } catch { if (revisionRef.current === revision) setState({ status: 'error', error: 'server_error' }) }
  }, [services])
  useEffect(() => { void refresh(); return () => { revisionRef.current += 1 } }, [refresh])
  const accountChanged = useCallback(() => { void refresh(); callbackRef.current?.() }, [refresh])
  const saveSettings = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (saving || state.status !== 'ready') return
    const fields = new FormData(event.currentTarget)
    const input: AccountSettings = { ...state.settings, soundMuted: fields.has('soundMuted'), reducedMotion: fields.has('reducedMotion'),
      analyticsEnabled: fields.has('analyticsEnabled'), timezone: String(fields.get('timezone') ?? '').trim() }
    try { new Intl.DateTimeFormat('vi-VN', { timeZone: input.timezone }).format() } catch { setSaveError('validation'); return }
    const revision = revisionRef.current
    setSaving(true); setSaveMessage(undefined); setSaveError(undefined)
    try {
      const result = await services.account.updateSettings(input)
      if (revisionRef.current !== revision) return
      setSaving(false)
      if (!result.ok) { setSaveError(result.error); return }
      setState(current => current.status === 'ready' ? { ...current, settings: result.value } : current)
      setSaveMessage('Đã lưu cài đặt theo tài khoản.')
      callbackRef.current?.()
    } catch { if (revisionRef.current === revision) { setSaving(false); setSaveError('server_error') } }
  }
  const ready = state.status === 'ready' && state.services === services ? state : undefined
  return <section data-testid="account-profile" className="space-y-4 px-4 py-4" aria-labelledby="account-profile-heading" style={{ color: theme.colors.textPrimary }}>
    <h1 id="account-profile-heading" className="text-2xl font-bold">CUỐN SỔ HÀNH TRÌNH</h1>
    {state.status === 'loading' || state.status === 'ready' && !ready ? <LoadingState message="Đang tải hồ sơ học tập..." />
      : state.status === 'unauthorized' ? <EmptyState title="Chưa đăng nhập" message="Đăng nhập để xem tiến độ, XP và streak của bạn." />
        : state.status === 'error' ? <>{state.error === 'offline' && <OfflineState />}<ErrorState message="Chưa thể tải hồ sơ học tập." onRetry={() => void refresh()} /></> : null}
    {ready && <>
      <Card>
        <h2 className="text-lg font-bold">{ready.summary.displayName}</h2>
        <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
          {[['Tổng XP', ready.summary.totalXp], ['Bài đã hoàn thành', ready.summary.completedLessons], ['Streak hiện tại', `${ready.summary.currentStreak} ngày`], ['Streak dài nhất', `${ready.summary.longestStreak} ngày`]].map(([label, value]) => <div key={label}><dt style={{ color: theme.colors.textSecondary }}>{label}</dt><dd className="text-lg font-bold">{value}</dd></div>)}
        </dl>
        <p className="mt-3 text-xs">Ngày học tính theo {ready.summary.timezone}. Chỉ hoạt động đã xác nhận được ghi nhận.</p>
      </Card>
      {ready.summary.achievements.length ? <Card><h2 className="font-bold">Danh hiệu</h2><ul className="mt-2 list-disc pl-5">{ready.summary.achievements.map(id => <li key={id}>{id}</li>)}</ul></Card>
        : <EmptyState title="Chưa có danh hiệu" message="Tiếp tục học để xây dựng hành trình của bạn." />}
      <Card>
        <form key={`${ready.summary.userId}:${JSON.stringify(ready.settings)}`} className="space-y-3" onSubmit={event => void saveSettings(event)} aria-label="Cài đặt tài khoản">
          <h2 className="font-bold">Cài đặt học tập</h2>
          {[['soundMuted', 'Tắt âm thanh giao diện'], ['reducedMotion', 'Giảm chuyển động'], ['analyticsEnabled', 'Cho phép thống kê sử dụng để cải thiện bài học']].map(([key, label]) => <label key={key} className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" name={key} defaultChecked={ready.settings[key as 'soundMuted' | 'reducedMotion' | 'analyticsEnabled']} disabled={saving} />{label}</label>)}
          <label className="block space-y-1 text-sm"><span>Múi giờ tài khoản</span><input name="timezone" defaultValue={ready.settings.timezone} required disabled={saving} className="min-h-11 w-full rounded-sm border px-3" style={{ background: theme.colors.cardBg, borderColor: theme.colors.borderMedium }} /></label>
          <p className="text-xs">Đổi múi giờ áp dụng cho hoạt động tiếp theo. Tắt thống kê không ảnh hưởng tiến độ học.</p>
          {saveError && <p role="alert" className="text-sm">{saveError === 'validation' ? 'Múi giờ chưa hợp lệ. Ví dụ: Asia/Ho_Chi_Minh.' : saveError === 'conflict' ? 'Chưa thể đổi múi giờ lúc này. Hãy thử lại sau.' : 'Chưa lưu được cài đặt. Hãy thử lại.'}</p>}
          {saveMessage && <p role="status" className="text-sm">{saveMessage}</p>}
          <Button className="min-h-11 w-full" type="submit" disabled={saving}>{saving ? 'ĐANG LƯU…' : 'LƯU CÀI ĐẶT'}</Button>
        </form>
      </Card>
    </>}
    <AccountAccess services={services} onAccountChange={accountChanged} />
  </section>
}
