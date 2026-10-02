import type { SVGProps } from "react";

export function DauTriIcon({ size = 20, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return <svg {...props} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 3 6 1 11 14-2 2L4 9zM3 21l5-5M3 16l5 5M21 3l-6 1-4 5M15 13l5-4 1-6M16 16l5 5M16 21l5-5" />
  </svg>;
}
