import React from 'react'
import { theme } from '../../theme/tokens'

type ChoiceOptionProps = {
  label: string
  isSelected?: boolean
  correct?: boolean
  revealed?: boolean
  disabled?: boolean
  onClick?: () => void
}

export function ChoiceOption({
  label,
  isSelected = false,
  correct,
  revealed = false,
  disabled = false,
  onClick,
}: ChoiceOptionProps) {
  let bg: string = theme.colors.cardBg
  let border: string = theme.colors.borderMedium
  let textColor: string = theme.colors.textPrimary
  let opacity = 1

  if (revealed || isSelected) {
    if (correct === false) {
      bg = theme.colors.incorrect.bg
      border = theme.colors.incorrect.border
      textColor = theme.colors.incorrect.text
    } else {
      bg = theme.colors.correct.bg
      border = theme.colors.correct.border
      textColor = theme.colors.correct.text
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-sm p-3.5 text-left font-sans text-sm font-medium transition-all active:scale-[0.98]"
      style={{
        background: bg,
        color: textColor,
        border: `1.5px solid ${border}`,
        boxShadow: isSelected ? '0 0 0 2px rgba(61,26,0,0.1)' : '1px 2px 0 rgba(61,26,0,0.06)',
        opacity,
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="leading-snug">{label}</span>
        {isSelected && correct === false && (
          <span className="font-bold text-base shrink-0" style={{ color: theme.colors.incorrect.text }}>✗</span>
        )}
        {isSelected && correct !== false && (
          <span className="font-bold text-base shrink-0" style={{ color: theme.colors.correct.text }}>✓</span>
        )}
      </div>
    </button>
  )
}

