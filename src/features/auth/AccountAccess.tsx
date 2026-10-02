import { useState } from 'react'
import { Button, Card, ErrorState, LoadingState } from '../../components/ui'
import type { LearningServices } from '../../services/next/backendContracts'
import { AccessCredentialsForm, type AccessMode } from './AccessCredentialsForm'
import { AccountSecurity } from './AccountSecurity'
import { accountAccessError, useAccountAccess } from './useAccountAccess'

export function AccountAccess({ services, onAccountChange }: { services: LearningServices; onAccountChange?: () => void }) {
  const [mode, setMode] = useState<AccessMode>('signIn')
  const access = useAccountAccess(services, onAccountChange)
  const { state, busy } = access
  if (state.status === 'loading' || state.status === 'ready' && state.services !== services) return <LoadingState message="Đang kiểm tra tài khoản..." />
  if (state.status === 'error') return <ErrorState message={accountAccessError(state.error)} onRetry={access.retry} />
  const changeMode = (next: AccessMode) => { setMode(next); access.clearNotice() }
  return <Card data-testid="account-access">
    <div className="min-w-0 space-y-3">
      <h2 className="text-lg font-bold">Tài khoản học tập</h2>
      <div role="status" aria-atomic="true" className="text-sm">
        {busy ? 'Đang xử lý yêu cầu tài khoản…' : access.message}
      </div>
      {access.error && <p role="alert" className="text-sm">{accountAccessError(access.error, access.errorAction)}</p>}
      {state.session ? <>
        <p className="break-words text-sm">Đang đăng nhập: {state.session.displayName}</p>
        <Button variant="outline" className="w-full" disabled={busy} onClick={() => void access.signOut()}>
          {busy ? 'ĐANG XỬ LÝ…' : 'ĐĂNG XUẤT'}
        </Button>
        <AccountSecurity auth={services.auth} session={state.session} busy={busy} onSubmit={access.security} onSessionChange={access.acceptSession} />
      </> : <>
        <p className="text-sm">Đăng nhập để tiếp tục đúng vị trí và lưu XP, streak trên các thiết bị.</p>
        <AccessCredentialsForm key={mode} mode={mode} busy={busy} onSubmit={fields => access.credentials(mode, fields)} />
        {mode !== 'forgotPassword' && <Button variant="outline" className="w-full" disabled={busy}
          onClick={() => changeMode(mode === 'signIn' ? 'signUp' : 'signIn')}>
          {mode === 'signIn' ? 'CHƯA CÓ TÀI KHOẢN? ĐĂNG KÝ' : 'ĐÃ CÓ TÀI KHOẢN? ĐĂNG NHẬP'}
        </Button>}
        {mode === 'signIn' && services.auth.requestPasswordReset && <Button variant="outline" className="w-full" disabled={busy}
          onClick={() => changeMode('forgotPassword')}>QUÊN MẬT KHẨU?</Button>}
        {mode === 'forgotPassword' && <Button variant="outline" className="w-full" disabled={busy}
          onClick={() => changeMode('signIn')}>QUAY LẠI ĐĂNG NHẬP</Button>}
      </>}
    </div>
  </Card>
}
