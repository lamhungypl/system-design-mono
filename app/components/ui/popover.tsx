import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { cn } from "~/lib/utils"

type PopoverPlacement =
  | "top" | "top-start" | "top-end"
  | "bottom" | "bottom-start" | "bottom-end"
  | "left" | "left-start" | "left-end"
  | "right" | "right-start" | "right-end"

interface PopoverProps {
  content: React.ReactNode
  title?: React.ReactNode
  trigger?: "click" | "hover"
  placement?: PopoverPlacement
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactElement
  className?: string
}

function parsePlacement(placement: PopoverPlacement): { side: string; align: string } {
  const [side, align = "center"] = placement.split("-")
  const alignMap: Record<string, string> = { start: "start", end: "end", center: "center" }
  return { side, align: alignMap[align] }
}

function Popover({ content, title, placement = "bottom", open, defaultOpen, onOpenChange, children, className }: PopoverProps) {
  const { side, align } = parsePlacement(placement)

  return (
    <PopoverPrimitive.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={false}>
      <PopoverPrimitive.Trigger render={children} />
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner
          side={side as PopoverPrimitive.Positioner.Props["side"]}
          align={align as PopoverPrimitive.Positioner.Props["align"]}
          sideOffset={8}
        >
          <PopoverPrimitive.Popup
            className={cn(
              "z-50 max-w-xs rounded-xl border border-border bg-card p-0 shadow-md outline-none",
              "animate-in fade-in-0 zoom-in-95 data-[ending-style]:animate-out data-[ending-style]:fade-out-0 data-[ending-style]:zoom-out-95",
              "data-[side=top]:slide-in-from-bottom-2 data-[side=bottom]:slide-in-from-top-2",
              "data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2",
              className,
            )}
          >
            {title && (
              <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                <span className="text-sm font-semibold">{title}</span>
                <PopoverPrimitive.Close className="rounded-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="size-3.5">
                    <path d="M3 3l10 10M13 3L3 13" />
                  </svg>
                </PopoverPrimitive.Close>
              </div>
            )}
            <div className="px-4 py-3 text-sm">{content}</div>
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

export { Popover }
export type { PopoverProps, PopoverPlacement }
