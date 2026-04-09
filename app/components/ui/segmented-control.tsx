import * as React from "react"
import { Toggle } from "@base-ui/react/toggle"
import { ToggleGroup } from "@base-ui/react/toggle-group"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "~/lib/utils"
import {
  Tooltip,
  TooltipPopup,
  TooltipPortal,
  TooltipPositioner,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip"

const segmentedControlVariants = cva(
  "inline-flex items-center rounded-lg bg-muted p-1 text-muted-foreground",
  {
    variants: {
      variant: {
        default: "gap-1",
        icon: "gap-0.5",
      },
      size: {
        default: "h-10",
        sm: "h-9",
        lg: "h-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const segmentedControlItemVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium outline-none transition-all select-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "px-3 data-[pressed]:bg-background data-[pressed]:text-foreground data-[pressed]:shadow-sm",
        icon: "data-[pressed]:bg-background data-[pressed]:text-foreground data-[pressed]:shadow-sm",
      },
      size: {
        default: "h-8",
        sm: "h-7 text-xs",
        lg: "h-9",
      },
    },
    compoundVariants: [
      { variant: "icon", size: "default", className: "size-8" },
      { variant: "icon", size: "sm", className: "size-7" },
      { variant: "icon", size: "lg", className: "size-9" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type SegmentedControlContextValue = VariantProps<
  typeof segmentedControlVariants
>

const SegmentedControlContext =
  React.createContext<SegmentedControlContextValue>({
    variant: "default",
    size: "default",
  })

function SegmentedControl<Value extends string>({
  className,
  variant = "default",
  size = "default",
  ...props
}: ToggleGroup.Props<Value> &
  VariantProps<typeof segmentedControlVariants>) {
  return (
    <SegmentedControlContext.Provider value={{ variant, size }}>
      <TooltipProvider>
        <ToggleGroup
          data-slot="segmented-control"
          className={cn(
            segmentedControlVariants({ variant, size, className })
          )}
          {...props}
        />
      </TooltipProvider>
    </SegmentedControlContext.Provider>
  )
}

function SegmentedControlItem<Value extends string>({
  className,
  tooltip,
  children,
  ...props
}: Toggle.Props<Value> & { tooltip?: string }) {
  const { variant, size } = React.useContext(SegmentedControlContext)

  const button = (
    <Toggle
      data-slot="segmented-control-item"
      className={cn(segmentedControlItemVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </Toggle>
  )

  if (!tooltip) return button

  return (
    <Tooltip>
      <TooltipTrigger render={button} />
      <TooltipPortal>
        <TooltipPositioner sideOffset={6}>
          <TooltipPopup>{tooltip}</TooltipPopup>
        </TooltipPositioner>
      </TooltipPortal>
    </Tooltip>
  )
}

export { SegmentedControl, SegmentedControlItem }
