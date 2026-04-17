import { cn } from "~/lib/utils"

type BadgeStatus = "default" | "processing" | "success" | "warning" | "error"

interface BadgeProps {
  count?: number
  dot?: boolean
  overflowCount?: number
  status?: BadgeStatus
  text?: React.ReactNode
  color?: string
  size?: "default" | "small"
  showZero?: boolean
  offset?: [number, number]
  children?: React.ReactNode
  className?: string
}

const statusStyles: Record<BadgeStatus, string> = {
  default: "bg-muted-foreground",
  processing: "bg-primary animate-pulse",
  success: "bg-green-500",
  warning: "bg-amber-500",
  error: "bg-red-500",
}

function Badge({
  count,
  dot,
  overflowCount = 99,
  status,
  text,
  color,
  size = "default",
  showZero = false,
  offset,
  children,
  className,
}: BadgeProps) {
  // Standalone status badge (no children)
  if (status !== undefined) {
    return (
      <span className={cn("inline-flex items-center gap-1.5", className)}>
        <span className={cn("size-2 rounded-full", statusStyles[status])} style={color ? { backgroundColor: color } : undefined} />
        {text && <span className="text-sm text-foreground">{text}</span>}
      </span>
    )
  }

  // Standalone count / dot badge
  if (!children) {
    if (dot) return <span className={cn("inline-block size-2 rounded-full bg-destructive", className)} style={color ? { backgroundColor: color } : undefined} />
    const label = count !== undefined ? (count > overflowCount ? `${overflowCount}+` : count) : null
    if (!showZero && label === 0) return null
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full bg-destructive text-white font-medium leading-none",
          size === "small" ? "min-w-4 h-4 text-[10px] px-1" : "min-w-5 h-5 text-xs px-1.5",
          className,
        )}
        style={color ? { backgroundColor: color } : undefined}
      >
        {label}
      </span>
    )
  }

  // Wrapper badge (overlaid on children)
  const showBadge = dot || count !== undefined
  const displayCount = count !== undefined ? (count > overflowCount ? `${overflowCount}+` : count) : null
  const hidden = !dot && !showZero && displayCount === 0

  return (
    <span className={cn("relative inline-flex", className)}>
      {children}
      {showBadge && !hidden && (
        <span
          className={cn(
            "absolute z-10 flex items-center justify-center rounded-full bg-destructive text-white font-medium leading-none ring-2 ring-background",
            dot ? "size-2 -top-0.5 -right-0.5" : size === "small" ? "min-w-4 h-4 text-[10px] px-1 -top-1 -right-1" : "min-w-5 h-5 text-xs px-1.5 -top-1.5 -right-1.5",
          )}
          style={{
            ...(color ? { backgroundColor: color } : {}),
            ...(offset ? { top: offset[1], right: -offset[0] } : {}),
          }}
        >
          {!dot && displayCount}
        </span>
      )}
    </span>
  )
}

export { Badge }
export type { BadgeProps, BadgeStatus }
