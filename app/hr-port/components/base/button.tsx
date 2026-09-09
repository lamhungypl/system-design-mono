import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "~/hr-port/utils/style"
const buttonVariants = cva(
  cn(
    "inline-flex cursor-pointer items-center justify-center rounded-lg text-xs font-semibold whitespace-nowrap transition-colors",
    "focus-visible:border-primary focus-visible:outline-none",
    "disabled:pointer-events-none disabled:opacity-50"
  ),
  {
    variants: {
      variant: {
        destructive:
          "text-destructive-foreground bg-destructive hover:bg-destructive/90",
        success: "bg-action-green text-primary-foreground",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        outline_primary: "border border-primary text-primary",
        outline_secondary: "border border-[#5F656A] text-[#5F656A]",
        primary: "border border-primary bg-primary text-primary-foreground",
        secondary: "border border-primary/20 bg-primary/20 text-primary",
        action: "border border-[#F19100] bg-[#F19100] text-[#FFFFFF]",
        action_secondary:
          "border border-[#BB7305] bg-[#FFF0CE] text-[#BC7100C7]",
        action_outline: "border border-[#BB7305] text-[#BB7305]",
        input: cn(
          "border border-input font-normal text-foreground",
          "focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0",
          "disabled:border-[#F4F4F4] disabled:bg-[#F4F4F4]"
        ),
      },
      size: {
        default: "min-h-9 px-4 py-[10px]",
        sm: "min-h-8 rounded-md px-3 text-xs",
        lg: "min-h-10 rounded-md px-8",
        icon: "min-h-6 min-w-6",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        type="button"
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
