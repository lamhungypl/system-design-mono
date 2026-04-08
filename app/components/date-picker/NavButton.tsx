import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cn } from "~/lib/utils"

export function NavButton({
  onClick,
  "aria-label": ariaLabel,
  children,
  muted = false,
  disabled = false,
}: {
  onClick: () => void
  "aria-label": string
  children: React.ReactNode
  muted?: boolean
  disabled?: boolean
}) {
  return (
    <ButtonPrimitive
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-md transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        muted
          ? "text-muted-foreground/40 hover:bg-muted hover:text-muted-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        disabled && "pointer-events-none opacity-40",
      )}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {children}
    </ButtonPrimitive>
  )
}
