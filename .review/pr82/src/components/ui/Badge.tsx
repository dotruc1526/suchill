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
      background: theme.colors.surfaceMuted,
      color: theme.colors.textPrimary,
      border: `1px solid ${theme.colors.borderLight}`,
    },
    primary: {
      background: theme.colors.primarySoft,
      color: theme.colors.primary,
      border: `1px solid ${theme.colors.primaryBorder}`,
    },
    secondary: {
      background: theme.colors.secondarySoft,
      color: theme.colors.secondary,
      border: `1px solid ${theme.colors.secondaryBorder}`,
    },
    success: {
      background: theme.colors.correct.bg,
      color: theme.colors.correct.text,
      border: `1px solid ${theme.colors.correct.border}`,
    },
    warning: {
      background: theme.colors.accentSoft,
      color: theme.colors.accentRed,
      border: `1px solid ${theme.colors.accentBorder}`,
    },
    error: {
      background: theme.colors.incorrect.bg,
      color: theme.colors.incorrect.text,
      border: `1px solid ${theme.colors.incorrect.border}`,
    },
    neutral: {
      background: theme.colors.surfaceMuted,
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
