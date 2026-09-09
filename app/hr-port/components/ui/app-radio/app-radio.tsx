import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import * as React from "react"

import { AppDotFillIcon } from "~/hr-port/assets/svgs/icons/Icon"
import { cn } from "~/hr-port/utils/style"

const AppRadio = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("flex gap-4", className)}
      {...props}
      ref={ref}
    />
  )
})
AppRadio.displayName = "AppRadio"

const AppRadioItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "flex aspect-square h-4 w-4 items-center justify-center text-primary shadow",
        "rounded-full border border-[#bfbfbf] data-[state=checked]:border-primary",
        "focus:outline-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <AppDotFillIcon className="" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
AppRadioItem.displayName = "AppRadioItem"

export { AppRadio, AppRadioItem }
