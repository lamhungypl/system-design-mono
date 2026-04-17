import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"
import { cn } from "~/lib/utils"

type DrawerPlacement = "left" | "right" | "top" | "bottom"

interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: React.ReactNode
  placement?: DrawerPlacement
  width?: number | string
  height?: number | string
  footer?: React.ReactNode
  closable?: boolean
  mask?: boolean
  children?: React.ReactNode
  className?: string
}

const placementStyles: Record<DrawerPlacement, string> = {
  right: "inset-y-0 right-0 rounded-l-xl border-l",
  left: "inset-y-0 left-0 rounded-r-xl border-r",
  top: "inset-x-0 top-0 rounded-b-xl border-b",
  bottom: "inset-x-0 bottom-0 rounded-t-xl border-t",
}

function Drawer({
  open,
  onClose,
  title,
  placement = "right",
  width = 378,
  height = 320,
  footer,
  closable = true,
  children,
  className,
}: DrawerProps) {
  const isVertical = placement === "left" || placement === "right"
  const sizeStyle = isVertical
    ? { width: typeof width === "number" ? `${width}px` : width }
    : { height: typeof height === "number" ? `${height}px` : height }

  return (
    <DrawerPrimitive.Root open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DrawerPrimitive.Portal>
        <DrawerPrimitive.Backdrop className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] animate-in fade-in-0 data-[ending-style]:animate-out data-[ending-style]:fade-out-0" />
        <DrawerPrimitive.Popup
          className={cn(
            "fixed z-50 flex flex-col bg-card border-border shadow-xl outline-none",
            "animate-in fade-in-0 slide-in-from-right-full data-[side=left]:slide-in-from-left-full data-[side=top]:slide-in-from-top-full data-[side=bottom]:slide-in-from-bottom-full",
            "data-[ending-style]:animate-out data-[ending-style]:fade-out-0 data-[ending-style]:slide-out-to-right-full",
            placementStyles[placement],
            className,
          )}
          style={sizeStyle}
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
            <div className="text-base font-semibold">{title}</div>
            {closable && (
              <DrawerPrimitive.Close
                onClick={onClose}
                className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Close drawer"
              >
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="size-4">
                  <path d="M3 3l10 10M13 3L3 13" />
                </svg>
              </DrawerPrimitive.Close>
            )}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="shrink-0 border-t border-border px-5 py-3">{footer}</div>
          )}
        </DrawerPrimitive.Popup>
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.Root>
  )
}

export { Drawer }
export type { DrawerProps, DrawerPlacement }
