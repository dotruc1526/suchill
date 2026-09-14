import React from 'react'

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
    primary: { background: '#8B1A1A', color: '#F5E6D0' },
    secondary: { background: '#1E2D5A', color: '#F5E6D0' },
    outline: { background: 'transparent', color: '#7A4020', border: '1.5px solid rgba(61,26,0,0.2)' },
  }[variant]

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
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

