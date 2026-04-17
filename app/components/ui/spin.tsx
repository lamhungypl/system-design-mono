import { cn } from "~/lib/utils"

type SpinSize = "small" | "default" | "large"

interface SpinProps {
  spinning?: boolean
  size?: SpinSize
  tip?: string
  delay?: number
  className?: string
  children?: React.ReactNode
}

const sizeStyles: Record<SpinSize, string> = {
  small: "size-4 border-2",
  default: "size-6 border-2",
  large: "size-8 border-[3px]",
}

function SpinIndicator({ size = "default", className }: { size?: SpinSize; className?: string }) {
  return (
    <span
      aria-label="Loading"
      role="status"
      className={cn(
        "inline-block rounded-full border-primary/20 border-t-primary animate-spin",
        sizeStyles[size],
        className,
      )}
    />
  )
}

function Spin({ spinning = true, size = "default", tip, className, children }: SpinProps) {
  if (!children) {
    if (!spinning) return null
    return (
      <span className={cn("inline-flex flex-col items-center gap-2", className)}>
        <SpinIndicator size={size} />
        {tip && <span className="text-sm text-muted-foreground">{tip}</span>}
      </span>
    )
  }

  return (
    <div className={cn("relative", className)}>
      {children}
      {spinning && (
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[inherit] bg-background/60 backdrop-blur-[1px]">
          <SpinIndicator size={size} />
          {tip && <span className="mt-2 text-sm text-muted-foreground">{tip}</span>}
        </div>
      )}
    </div>
  )
}

export { Spin, SpinIndicator }
export type { SpinProps, SpinSize }
