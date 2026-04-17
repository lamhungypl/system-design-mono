import { Progress as ProgressPrimitive } from "@base-ui/react/progress"
import { cn } from "~/lib/utils"

type ProgressStatus = "normal" | "success" | "exception" | "active"

interface ProgressProps {
  percent?: number
  status?: ProgressStatus
  showInfo?: boolean
  strokeColor?: string
  trailColor?: string
  strokeWidth?: number
  size?: "small" | "default" | "large"
  type?: "line" | "circle"
  width?: number
  className?: string
}

const statusColor: Record<ProgressStatus, string> = {
  normal: "bg-primary",
  success: "bg-green-500",
  exception: "bg-red-500",
  active: "bg-primary",
}

const statusTextColor: Record<ProgressStatus, string> = {
  normal: "text-foreground",
  success: "text-green-600 dark:text-green-400",
  exception: "text-red-600 dark:text-red-400",
  active: "text-foreground",
}

function ProgressLine({
  percent = 0,
  status = "normal",
  showInfo = true,
  strokeColor,
  trailColor,
  strokeWidth,
  size = "default",
  className,
}: ProgressProps) {
  const trackHeight = strokeWidth
    ? `${strokeWidth}px`
    : size === "small" ? "4px" : size === "large" ? "10px" : "6px"

  const clampedPercent = Math.min(100, Math.max(0, percent))

  return (
    <ProgressPrimitive.Root
      value={clampedPercent}
      className={cn("flex items-center gap-3", className)}
    >
      <ProgressPrimitive.Track
        className="flex-1 overflow-hidden rounded-full"
        style={{ height: trackHeight, backgroundColor: trailColor ?? undefined }}
        data-slot="progress-track"
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full rounded-full transition-all duration-500",
            statusColor[status],
            status === "active" && "animate-pulse",
          )}
          style={{ width: `${clampedPercent}%`, ...(strokeColor ? { backgroundColor: strokeColor } : {}) }}
        />
      </ProgressPrimitive.Track>
      {showInfo && (
        <span className={cn("w-10 shrink-0 text-right text-xs tabular-nums", statusTextColor[status])}>
          {status === "success" ? "✓" : status === "exception" ? "✗" : `${clampedPercent}%`}
        </span>
      )}
    </ProgressPrimitive.Root>
  )
}

function ProgressCircle({ percent = 0, status = "normal", showInfo = true, strokeColor, width = 80, strokeWidth = 6, className }: ProgressProps) {
  const clampedPercent = Math.min(100, Math.max(0, percent))
  const r = 50 - strokeWidth / 2
  const circumference = 2 * Math.PI * r
  const strokeDashoffset = circumference - (clampedPercent / 100) * circumference

  const colorMap: Record<ProgressStatus, string> = {
    normal: strokeColor ?? "oklch(0.488 0.243 264.376)",
    success: "#22c55e",
    exception: "#ef4444",
    active: strokeColor ?? "oklch(0.488 0.243 264.376)",
  }

  return (
    <ProgressPrimitive.Root value={clampedPercent} className={cn("relative inline-flex", className)}>
      <svg width={width} height={width} viewBox="0 0 100 100" className="-rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-muted" />
        <circle
          cx="50" cy="50" r={r} fill="none"
          stroke={colorMap[status]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      {showInfo && (
        <span className={cn("absolute inset-0 flex items-center justify-center text-xs font-medium tabular-nums", statusTextColor[status])}>
          {status === "success" ? "✓" : status === "exception" ? "✗" : `${clampedPercent}%`}
        </span>
      )}
    </ProgressPrimitive.Root>
  )
}

function Progress({ type = "line", ...props }: ProgressProps) {
  if (type === "circle") return <ProgressCircle {...props} />
  return <ProgressLine {...props} />
}

export { Progress }
export type { ProgressProps, ProgressStatus }
