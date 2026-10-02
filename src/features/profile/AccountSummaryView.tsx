import { Button, Card } from '../../components/ui'
import { theme } from '../../theme/tokens'
import type { SummaryState } from './summaryController'
export function AccountSummaryView({ state, onRetry }: { state: SummaryState; onRetry: () => void }) {
  return <section aria-label="Số liệu đã xác nhận" className="space-y-3" style={{ color: theme.colors.textPrimary }}>
    {state.status === 'loading' && <p role="status">Đang tải số liệu hồ sơ…</p>}
    {state.status === 'empty' && <p role="status">Chưa có dữ liệu tài khoản.</p>}
    {state.status === 'error' && <div role="alert"><p>{state.error === 'unauthorized' ? 'Chưa có phiên tài khoản hợp lệ.' : 'Chưa tải được số liệu hồ sơ.'}</p><Button variant="outline" onClick={onRetry}>TẢI LẠI HỒ SƠ</Button></div>}
    {state.value && <Card>
      <h2 className="text-xl font-bold break-words">{state.value.displayName || 'Người học'}</h2>
      {state.status !== 'ready' && <p>Số liệu từ lần xác nhận gần nhất.</p>}
      <dl className="grid grid-cols-2 gap-3 py-3">
        <div><dt>XP đã xác nhận</dt><dd data-testid="confirmed-xp" className="text-2xl font-bold">{state.value.totalXp}</dd></div>
        <div><dt>Chuỗi ngày hiện tại</dt><dd>{state.value.currentStreak} ngày</dd></div>
        <div><dt>Bài bắt buộc hoàn thành</dt><dd>{state.value.requiredLessonCount}</dd></div>
        <div><dt>Chuỗi ngày dài nhất</dt><dd>{state.value.longestStreak} ngày</dd></div>
      </dl>
      <h3 className="font-bold">Danh hiệu</h3>
      {state.value.achievements.length ? <ul>{state.value.achievements.map(item => <li key={item.id}>{item.title}</li>)}</ul> : <p>Chưa có danh hiệu đã xác nhận.</p>}
    </Card>}
  </section>
}
