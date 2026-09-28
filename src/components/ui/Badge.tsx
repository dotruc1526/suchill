import React from 'react'
import { theme } from '../../theme/tokens'

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral'
  size?: 'sm' | 'md'
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  style,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: {
      background: 'rgba(61, 26, 0, 0.08)',
      color: theme.colors.textPrimary,
      border: `1px solid ${theme.colors.borderLight}`,
    },
    primary: {
      background: 'rgba(139, 26, 26, 0.12)',
      color: theme.colors.primary,
      border: `1px solid rgba(139, 26, 26, 0.25)`,
    },
    secondary: {
      background: 'rgba(30, 45, 90, 0.12)',
      color: theme.colors.secondary,
      border: `1px solid rgba(30, 45, 90, 0.25)`,
    },
    success: {
      background: theme.colors.correct.bg,
      color: theme.colors.correct.text,
      border: `1px solid ${theme.colors.correct.border}`,
    },
    warning: {
      background: 'rgba(196, 52, 26, 0.12)',
      color: theme.colors.accentRed,
      border: `1px solid rgba(196, 52, 26, 0.25)`,
    },
    error: {
      background: theme.colors.incorrect.bg,
      color: theme.colors.incorrect.text,
      border: `1px solid ${theme.colors.incorrect.border}`,
    },
    neutral: {
      background: 'rgba(61, 26, 0, 0.08)',
      color: theme.colors.textSecondary,
      border: `1px solid ${theme.colors.borderLight}`,
    },
  }[variant]

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-semibold',
  }[size]

  return (
    <span
      className={`inline-flex items-center gap-1 font-sans rounded-sm ${sizeStyles} ${className}`}
      style={{ ...variantStyles, ...style }}
      {...props}
    >
      {children}
    </span>
  )
}
