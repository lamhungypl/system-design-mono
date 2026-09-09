import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "@radix-ui/react-icons"
import * as React from "react"

import { cn } from "~/hr-port/utils/style"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <div className="relative inline-flex items-center">
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded border border-primary focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none",
        "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        "disabled:cursor-not-allowed disabled:border-[#C7C7C7] disabled:opacity-50 disabled:data-[state=checked]:bg-[#C7C7C7]",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center text-current")}
      >
        <CheckIcon className="h-4 w-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  </div>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
