"use client"

import { cn } from "~/lib/utils"

type TagColor = "default" | "primary" | "success" | "warning" | "error" | "processing"

const colorStyles: Record<TagColor, string> = {
  default: "bg-muted text-foreground border-border",
  primary: "bg-primary/10 text-primary border-primary/30 dark:bg-primary/20",
  success: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-800/60",
  warning: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60",
  error: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/60",
  processing: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60",
}

interface TagProps {
  color?: TagColor | string
  closable?: boolean
  onClose?: (e: React.MouseEvent) => void
  bordered?: boolean
  icon?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

function Tag({ color = "default", closable, onClose, bordered = true, icon, className, children }: TagProps) {
  const isPreset = Object.keys(colorStyles).includes(color as TagColor)
  const presetColor = isPreset ? colorStyles[color as TagColor] : "bg-muted text-foreground border-border"
  const customStyle = !isPreset ? { backgroundColor: `${color}20`, color, borderColor: `${color}50` } : {}

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium transition-colors",
        bordered ? "border" : "border-transparent",
        presetColor,
        className,
      )}
      style={customStyle}
    >
      {icon && <span className="[&_svg]:size-3">{icon}</span>}
      {children}
      {closable && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Remove tag"
          className="ml-0.5 rounded-sm opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-none"
        >
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="size-3">
            <path d="M2 2l8 8M10 2L2 10" />
          </svg>
        </button>
      )}
    </span>
  )
}

export { Tag }
export type { TagProps, TagColor }
