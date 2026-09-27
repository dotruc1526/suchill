import React from 'react'
import { theme } from '../../theme/tokens'

type ProgressProps = React.HTMLAttributes<HTMLDivElement> & {
  value: number // 0 to 100
  height?: number
  indicatorColor?: string
}

export function Progress({
  value,
  height = 8,
  indicatorColor = theme.colors.primary,
  className = '',
  style,
  ...props
}: ProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value))

  return (
    <div
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`w-full overflow-hidden rounded-full ${className}`}
      style={{
        height: `${height}px`,
        background: 'rgba(61, 26, 0, 0.1)',
        ...style,
      }}
      {...props}
    >
      <div
        className="h-full rounded-full transition-all duration-300 ease-out"
        style={{
          width: `${clampedValue}%`,
          background: indicatorColor,
        }}
      />
    </div>
  )
}
