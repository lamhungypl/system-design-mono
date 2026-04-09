import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

import { cn } from "~/lib/utils"

function TooltipProvider(props: TooltipPrimitive.Provider.Props) {
  return <TooltipPrimitive.Provider {...props} />
}

function Tooltip(props: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root {...props} />
}

function TooltipTrigger(props: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger {...props} />
}

function TooltipPortal(props: TooltipPrimitive.Portal.Props) {
  return <TooltipPrimitive.Portal {...props} />
}

function TooltipPositioner({
  className,
  sideOffset = 8,
  ...props
}: TooltipPrimitive.Positioner.Props) {
  return (
    <TooltipPrimitive.Positioner
      data-slot="tooltip-positioner"
      sideOffset={sideOffset}
      className={cn("outline-none", className)}
      {...props}
    />
  )
}

function TooltipPopup({
  className,
  ...props
}: TooltipPrimitive.Popup.Props) {
  return (
    <TooltipPrimitive.Popup
      data-slot="tooltip-popup"
      className={cn(
        "rounded-md bg-primary px-2.5 py-1 text-xs text-primary-foreground",
        "animate-in fade-in-0 zoom-in-95 data-[ending-style]:animate-out data-[ending-style]:fade-out-0 data-[ending-style]:zoom-out-95",
        "data-[side=top]:slide-in-from-bottom-2 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2",
        className
      )}
      {...props}
    />
  )
}

function TooltipArrow({
  className,
  ...props
}: TooltipPrimitive.Arrow.Props) {
  return (
    <TooltipPrimitive.Arrow
      data-slot="tooltip-arrow"
      className={cn(
        "data-[side=bottom]:top-[-4px] data-[side=left]:right-[-4px] data-[side=right]:left-[-4px] data-[side=top]:bottom-[-4px]",
        "[&>path:first-child]:fill-primary",
        className
      )}
      {...props}
    />
  )
}

export {
  Tooltip,
  TooltipArrow,
  TooltipPopup,
  TooltipPortal,
  TooltipPositioner,
  TooltipProvider,
  TooltipTrigger,
}
