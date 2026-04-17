import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "~/lib/utils"

interface SwitchProps extends SwitchPrimitive.Root.Props {
  size?: "small" | "default"
  checkedChildren?: React.ReactNode
  unCheckedChildren?: React.ReactNode
  loading?: boolean
  className?: string
  children?: React.ReactNode
}

function Switch({ size = "default", checkedChildren, unCheckedChildren, loading, className, children, ...props }: SwitchProps) {
  const trackClass = size === "small"
    ? "h-4 w-7"
    : "h-5 w-9"
  const thumbClass = size === "small"
    ? "size-3 data-[checked]:translate-x-3"
    : "size-4 data-[checked]:translate-x-4"

  const trigger = (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "group relative inline-flex cursor-pointer items-center rounded-full border border-transparent bg-input transition-colors",
        "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        "data-[checked]:bg-primary",
        "disabled:cursor-not-allowed disabled:opacity-50",
        trackClass,
        loading && "opacity-60 pointer-events-none",
        className,
      )}
      {...props}
    >
      {(checkedChildren || unCheckedChildren) && (
        <span className={cn(
          "absolute text-[9px] font-medium text-white transition-opacity",
          size === "small" ? "left-1" : "left-1.5",
          "group-data-[unchecked]:opacity-0"
        )}>
          {checkedChildren}
        </span>
      )}
      <SwitchPrimitive.Thumb
        className={cn(
          "pointer-events-none absolute left-0.5 top-px rounded-full bg-white shadow-sm transition-transform duration-200",
          loading && "flex items-center justify-center",
          thumbClass,
        )}
      >
        {loading && (
          <span className="size-2/3 rounded-full border border-primary/20 border-t-primary animate-spin" />
        )}
      </SwitchPrimitive.Thumb>
      {(checkedChildren || unCheckedChildren) && (
        <span className={cn(
          "absolute text-[9px] font-medium text-muted-foreground transition-opacity",
          size === "small" ? "right-1" : "right-1.5",
          "group-data-[checked]:opacity-0"
        )}>
          {unCheckedChildren}
        </span>
      )}
    </SwitchPrimitive.Root>
  )

  if (!children) return trigger

  return (
    <label className={cn("inline-flex cursor-pointer items-center gap-2 select-none", props.disabled && "cursor-not-allowed opacity-50")}>
      {trigger}
      <span className="text-sm">{children}</span>
    </label>
  )
}

export { Switch }
export type { SwitchProps }
