import React from 'react'
import { theme } from '../../theme/tokens'

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'ghost' | 'filled' | 'outline'
  ariaLabel: string
}

export function IconButton({
  children,
  size = 'md',
  variant = 'ghost',
  ariaLabel,
  className = '',
  style,
  ...props
}: IconButtonProps) {
  const sizeStyles = {
    sm: 'w-11 h-11 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-12 h-12 text-base',
  }[size]

  const variantStyles = {
    ghost: {
      background: 'transparent',
      color: theme.colors.textPrimary,
    },
    filled: {
      background: 'rgba(61, 26, 0, 0.08)',
      color: theme.colors.textPrimary,
    },
    outline: {
      background: 'transparent',
      color: theme.colors.textPrimary,
      border: `1.5px solid ${theme.colors.borderMedium}`,
    },
  }[variant]

  return (
    <button
      aria-label={ariaLabel}
      className={`rounded-full flex items-center justify-center transition-all active:scale-95 min-w-[44px] min-h-[44px] ${sizeStyles} ${className}`}
      style={{ ...variantStyles, ...style }}
      {...props}
    >
      {children}
    </button>
  )
}
