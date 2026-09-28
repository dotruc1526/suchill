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

  if (revealed && correct === true) {
    bg = theme.colors.correct.bg
    border = theme.colors.correct.border
    textColor = theme.colors.correct.text
  } else if (revealed && correct === false) {
    bg = theme.colors.incorrect.bg
    border = theme.colors.incorrect.border
    textColor = theme.colors.incorrect.text
  } else if (isSelected) {
    bg = theme.colors.selected.bg
    border = theme.colors.selected.border
    textColor = theme.colors.selected.text
  }

  const showIncorrect = revealed && isSelected && correct === false
  const showCorrect = revealed && isSelected && correct === true

  if (disabled) {
    opacity = 0.65
  }

  /*
   * Narrative/reflection choices pass only `isSelected`; they must stay neutral.
   * Correct/incorrect visuals are shown only after `revealed` and explicit correctness.
   */
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-sm p-3.5 text-left font-sans text-sm font-medium transition-all active:scale-[0.98]"
      style={{
        background: bg,
        color: textColor,
        border: `1.5px solid ${border}`,
        boxShadow: isSelected ? theme.shadows.selected : theme.shadows.card,
        opacity,
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="leading-snug">{label}</span>
        {showIncorrect && (
          <span className="font-bold text-base shrink-0" style={{ color: theme.colors.incorrect.text }}>✗</span>
        )}
        {showCorrect && (
          <span className="font-bold text-base shrink-0" style={{ color: theme.colors.correct.text }}>✓</span>
        )}
      </div>
    </button>
  )
}
