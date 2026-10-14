import type { SVGProps } from "react"

/** Single-colour social marks (simple outlines, `currentColor`). */
export const socialIcons: Record<string, (p: SVGProps<SVGSVGElement>) => React.ReactElement> = {
  Instagram: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  LinkedIn: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4V21H3V9.5Zm6.5 0h3.8v1.6h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.1c0-1.22-.02-2.78-1.7-2.78-1.7 0-1.96 1.33-1.96 2.7V21h-4V9.5Z" />
    </svg>
  ),
  Vimeo: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M22 7.4c-.1 2-1.5 4.7-4.2 8.1-2.8 3.6-5.1 5.4-7.1 5.4-1.2 0-2.2-1.1-3.1-3.4L6 11.4c-.6-2.3-1.3-3.4-2-3.4-.2 0-.8.4-1.8 1.1L1 7.8c1.1-1 2.2-1.9 3.3-2.9 1.5-1.3 2.6-2 3.3-2 1.8-.2 2.9 1 3.3 3.6.4 2.8.7 4.6.9 5.3.5 2.3 1.1 3.4 1.7 3.4.5 0 1.2-.8 2.2-2.3 1-1.5 1.5-2.7 1.6-3.5.1-1.3-.4-2-1.6-2-.5 0-1.1.1-1.7.4 1.1-3.7 3.3-5.5 6.5-5.4 2.4.1 3.5 1.6 3.4 4.5Z" />
    </svg>
  ),
}
