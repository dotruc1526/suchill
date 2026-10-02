import React from 'react'
import { theme } from '../../theme/tokens'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  style,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-sans font-bold rounded-sm transition-all active:scale-[0.97] flex items-center justify-center gap-2'
  
  const variantStyles = {
    primary: { background: theme.colors.primary, color: theme.colors.primaryText },
    secondary: { background: theme.colors.secondary, color: theme.colors.primaryText },
    outline: {
      background: 'transparent',
      color: theme.colors.textSecondary,
      border: `1.5px solid ${theme.colors.borderMedium}`,
    },
  }[variant]

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'min-h-11 min-w-11 px-4 py-2.5 text-sm',
    lg: 'w-full py-3.5 text-sm tracking-wider',
  }[size]

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${className}`}
      style={{ ...variantStyles, ...style }}
      {...props}
    >
      {children}
    </button>
  )
}
