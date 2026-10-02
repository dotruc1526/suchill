import React from 'react'
import { theme } from '../../theme/tokens'

type ChoiceOptionBaseProps = {
  label: string
  isSelected?: boolean
  disabled?: boolean
  onClick?: () => void
}

type ChoiceOptionProps = ChoiceOptionBaseProps & (
  | { type: 'knowledge'; correct: boolean; revealed?: boolean }
  | { type: 'narrative' | 'reflection'; correct?: never; revealed?: never }
)

export function ChoiceOption(props: ChoiceOptionProps) {
  const { label, isSelected = false, disabled = false, onClick } = props
  const isKnowledge = props.type === 'knowledge'
  const isRevealed = isKnowledge && props.revealed === true
  const isCorrect = isKnowledge && props.correct
  let bg: string = theme.colors.cardBg
  let border: string = theme.colors.borderMedium
  let textColor: string = theme.colors.textPrimary
  let opacity = 1

  if (isRevealed && isCorrect) {
    bg = theme.colors.correct.bg
    border = theme.colors.correct.border
    textColor = theme.colors.correct.text
  } else if (isRevealed && isSelected) {
    bg = theme.colors.incorrect.bg
    border = theme.colors.incorrect.border
    textColor = theme.colors.incorrect.text
  } else if (isSelected) {
    bg = theme.colors.selected.bg
    border = theme.colors.selected.border
    textColor = theme.colors.selected.text
  }

  const feedback = isRevealed && (isCorrect || isSelected)
    ? isCorrect
      ? { icon: '✓', label: 'Đúng', color: theme.colors.correct.text }
      : { icon: '✗', label: 'Sai', color: theme.colors.incorrect.text }
    : null

  if (disabled) {
    opacity = 0.65
  }

  /*
   * The discriminated `type` prevents narrative/reflection choices from carrying
   * correctness. Knowledge feedback appears only after reveal.
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
        {feedback && (
          <span className="flex shrink-0 items-center gap-1 font-bold" style={{ color: feedback.color }}>
            <span aria-hidden="true" className="text-base">{feedback.icon}</span>
            <span className="text-xs">{feedback.label}</span>
          </span>
        )}
      </div>
    </button>
  )
}
