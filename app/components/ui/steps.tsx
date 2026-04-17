import { cn } from "~/lib/utils"

type StepStatus = "wait" | "process" | "finish" | "error"
type StepsDirection = "horizontal" | "vertical"

interface StepItem {
  title: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  status?: StepStatus
  disabled?: boolean
}

interface StepsProps {
  current?: number
  items: StepItem[]
  direction?: StepsDirection
  size?: "default" | "small"
  onChange?: (step: number) => void
  className?: string
}

const statusIconClass: Record<StepStatus, string> = {
  wait: "border-border bg-background text-muted-foreground",
  process: "border-primary bg-primary text-primary-foreground",
  finish: "border-primary bg-primary text-primary-foreground",
  error: "border-destructive bg-destructive text-destructive-foreground",
}

function StepIcon({ status, index, icon, size }: { status: StepStatus; index: number; icon?: React.ReactNode; size?: "default" | "small" }) {
  const sizeClass = size === "small" ? "size-6 text-xs" : "size-8 text-sm"
  return (
    <span className={cn("flex shrink-0 items-center justify-center rounded-full border-2 font-semibold transition-colors", sizeClass, statusIconClass[status])}>
      {icon ? (
        <span className="[&_svg]:size-4">{icon}</span>
      ) : status === "finish" ? (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
          <path d="M3 8.5L6.5 12 13 5" />
        </svg>
      ) : status === "error" ? (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="size-3.5">
          <path d="M4 4l8 8M12 4l-8 8" />
        </svg>
      ) : (
        index + 1
      )}
    </span>
  )
}

function Steps({ current = 0, items, direction = "horizontal", size = "default", onChange, className }: StepsProps) {
  function getStatus(i: number, item: StepItem): StepStatus {
    if (item.status) return item.status
    if (i < current) return "finish"
    if (i === current) return "process"
    return "wait"
  }

  if (direction === "vertical") {
    return (
      <ol className={cn("flex flex-col", className)}>
        {items.map((item, i) => {
          const status = getStatus(i, item)
          const isLast = i === items.length - 1
          return (
            <li key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <StepIcon status={status} index={i} icon={item.icon} size={size} />
                {!isLast && <div className="my-1 w-0.5 flex-1 bg-border" />}
              </div>
              <div className={cn("pb-6 min-w-0", isLast && "pb-0")}>
                <div
                  className={cn(
                    "text-sm font-medium leading-snug",
                    status === "process" ? "text-foreground" : status === "error" ? "text-destructive" : "text-muted-foreground",
                    onChange && !item.disabled && "cursor-pointer hover:text-primary",
                    size === "small" && "text-xs",
                  )}
                  onClick={() => onChange && !item.disabled && onChange(i)}
                >
                  {item.title}
                </div>
                {item.description && <div className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{item.description}</div>}
              </div>
            </li>
          )
        })}
      </ol>
    )
  }

  return (
    <ol className={cn("flex items-start", className)}>
      {items.map((item, i) => {
        const status = getStatus(i, item)
        const isLast = i === items.length - 1
        return (
          <li key={i} className={cn("flex flex-1 items-start gap-2", isLast && "flex-none")}>
            <div className="flex flex-col items-center gap-1">
              <StepIcon status={status} index={i} icon={item.icon} size={size} />
              <div
                className={cn(
                  "text-xs font-medium text-center",
                  status === "process" ? "text-foreground" : status === "error" ? "text-destructive" : "text-muted-foreground",
                  onChange && !item.disabled && "cursor-pointer hover:text-primary",
                  size === "small" && "text-[10px]",
                )}
                onClick={() => onChange && !item.disabled && onChange(i)}
              >
                {item.title}
              </div>
              {item.description && <div className="text-[10px] text-muted-foreground text-center">{item.description}</div>}
            </div>
            {!isLast && (
              <div className="mt-4 h-0.5 flex-1 bg-border" />
            )}
          </li>
        )
      })}
    </ol>
  )
}

export { Steps }
export type { StepsProps, StepItem, StepStatus }
