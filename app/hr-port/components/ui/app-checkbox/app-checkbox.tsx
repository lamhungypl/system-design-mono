import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import * as React from "react"

import { AppCheckIcon } from "~/hr-port/assets/svgs/icons/Icon"
import { cn } from "~/hr-port/utils/style"

const AppCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded border",
      "focus-visible:border-primary focus-visible:outline-none",
      "data-[state=checked]:border-primary data-[state=checked]:bg-primary",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <AppCheckIcon />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
AppCheckbox.displayName = "AppCheckbox"

export { AppCheckbox }
