import { useId, useState, type InputHTMLAttributes } from 'react'
import { Button } from '../../components/ui'
import { theme } from '../../theme/tokens'

type Props = InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; error?: string }

export function AuthField({ label, hint, error, type = 'text', id, ...input }: Props) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const [visible, setVisible] = useState(false)
  const password = type === 'password'
  const describedBy = [hint && `${fieldId}-hint`, error && `${fieldId}-error`].filter(Boolean).join(' ') || undefined
  return <div className="min-w-0 space-y-1 text-sm">
    <label htmlFor={fieldId} className="block">{label}{input.required ? ' (bắt buộc)' : ''}</label>
    <div className="flex min-w-0 gap-2">
      <input {...input} id={fieldId} type={password && visible ? 'text' : type}
        aria-describedby={describedBy} aria-invalid={Boolean(error) || undefined}
        className="min-h-11 min-w-0 w-full rounded-sm border px-3 text-base focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ minHeight: theme.layout.touchTarget, background: theme.colors.cardBg, color: theme.colors.textPrimary,
          borderColor: theme.colors.borderMedium, outlineColor: theme.colors.primary }} />
      {password && <Button type="button" variant="outline" size="sm" disabled={input.disabled}
        aria-label={`${visible ? 'Ẩn' : 'Hiện'} ${label.toLowerCase()}`} aria-pressed={visible}
        onClick={() => setVisible(value => !value)}>{visible ? 'ẨN' : 'HIỆN'}</Button>}
    </div>
    {hint && <p id={`${fieldId}-hint`} className="text-sm" style={{ color: theme.colors.textMuted }}>{hint}</p>}
    {error && <p id={`${fieldId}-error`} role="alert">{error}</p>}
  </div>
}
