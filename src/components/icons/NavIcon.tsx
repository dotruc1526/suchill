import type { ReactElement, SVGProps } from 'react'

export type NavIconProps = SVGProps<SVGSVGElement> & { size?: number }
export type NavIcon = (props: NavIconProps) => ReactElement

function IconBase({ children, size = 20, ...props }: NavIconProps) {
  return (
    <svg
      {...props}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}

export function BookOpenIcon(props: NavIconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 7v14" />
      <path d="M3 5.5A2.5 2.5 0 0 1 5.5 3H12v18H5.5A2.5 2.5 0 0 1 3 18.5z" />
      <path d="M12 3h6.5A2.5 2.5 0 0 1 21 5.5v13a2.5 2.5 0 0 1-2.5 2.5H12z" />
    </IconBase>
  )
}

export function BrainIcon(props: NavIconProps) {
  return (
    <IconBase {...props}>
      <path d="M9 4.5A3.5 3.5 0 0 0 5.5 8v.4A3.5 3.5 0 0 0 4 15a4 4 0 0 0 5 5" />
      <path d="M15 4.5A3.5 3.5 0 0 1 18.5 8v.4A3.5 3.5 0 0 1 20 15a4 4 0 0 1-5 5" />
      <path d="M9 4.5V20" />
      <path d="M15 4.5V20" />
      <path d="M9 9H7" />
      <path d="M15 9h2" />
      <path d="M9 14H6.5" />
      <path d="M15 14h2.5" />
    </IconBase>
  )
}

export function MessageCircleIcon(props: NavIconProps) {
  return (
    <IconBase {...props}>
      <path d="M21 11.5a8.5 8.5 0 0 1-12.2 7.6L3 21l1.9-5.5A8.5 8.5 0 1 1 21 11.5z" />
    </IconBase>
  )
}

export function UserRoundIcon(props: NavIconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </IconBase>
  )
}

export function FlameIcon(props: NavIconProps) {
  return (
    <IconBase {...props}>
      <path d="M8.5 14.5A3.5 3.5 0 0 0 12 21a5 5 0 0 0 5-5c0-2.8-1.6-4.5-3.3-6.3-1-1.1-2.1-2.2-2.7-3.7-.4 2.6-1.8 4-3 5.2A6 6 0 0 0 6 16" />
      <path d="M12 21a2.4 2.4 0 0 0 2.4-2.4c0-1.4-.8-2.3-1.6-3.1-.5-.5-1-1.1-1.3-1.8-.2 1.3-.9 2-1.5 2.6a3 3 0 0 0-1 2.3A3 3 0 0 0 12 21" />
    </IconBase>
  )
}

export function HandIcon(props: NavIconProps) {
  return (
    <IconBase {...props}>
      <path d="M8 11V5.5a1.5 1.5 0 0 1 3 0V9" />
      <path d="M11 9V4a1.5 1.5 0 0 1 3 0v5" />
      <path d="M14 9V5.5a1.5 1.5 0 0 1 3 0v6.2" />
      <path d="M8 10.5 6.7 9.2a1.5 1.5 0 0 0-2.1 2.1l3.8 4A5 5 0 0 0 12 17h.5A4.5 4.5 0 0 0 17 12.5" />
    </IconBase>
  )
}

export function StarIcon(props: NavIconProps) {
  return (
    <IconBase {...props}>
      <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />
    </IconBase>
  )
}

export function TrophyIcon(props: NavIconProps) {
  return (
    <IconBase {...props}>
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="M7 4h10v5a5 5 0 0 1-10 0z" />
      <path d="M7 6H4v2a3 3 0 0 0 3 3" />
      <path d="M17 6h3v2a3 3 0 0 1-3 3" />
    </IconBase>
  )
}
