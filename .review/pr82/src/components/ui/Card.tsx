import React from 'react'

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  accentColor?: string
  accentPosition?: 'top' | 'left'
}

export function Card({
  children,
  accentColor,
  accentPosition = 'left',
  className = '',
  style,
  ...props
}: CardProps) {
  const borderStyle = accentColor
    ? accentPosition === 'top'
      ? { borderTop: `3px solid ${accentColor}` }
      : { borderLeft: `4px solid ${accentColor}` }
    : {}

  return (
    <div
      className={`paper-card rounded-lg p-4 ${className}`}
      style={{ ...borderStyle, ...style }}
      {...props}
    >
      {children}
    </div>
  )
}

