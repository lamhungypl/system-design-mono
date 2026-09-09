import * as TabsPrimitive from "@radix-ui/react-tabs"
import * as React from "react"

import { cn } from "~/hr-port/utils/style"

const SegmentedControl = TabsPrimitive.Root

const SegmentedControlList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center bg-muted text-muted-foreground",
      className
    )}
    {...props}
  />
))
SegmentedControlList.displayName = "SegmentedControlList"

const SegmentedControlTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center px-3 py-1.5 text-sm font-normal whitespace-nowrap ring-offset-background transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:bg-[#F19100] data-[state=active]:text-white data-[state=active]:shadow-sm",
      "data-[state=inactive]:bg-[#F2F2F2] data-[state=inactive]:text-[#BFBFBF]",

      className
    )}
    {...props}
  />
))
SegmentedControlTrigger.displayName = "SegmentedControlTrigger"

export { SegmentedControl, SegmentedControlList, SegmentedControlTrigger }
