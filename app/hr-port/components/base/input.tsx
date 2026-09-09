import * as React from "react"

import { cn } from "~/hr-port/utils/style"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:border-[#F4F4F4] disabled:bg-[#F4F4F4] disabled:opacity-50",
          className
        )}
        onChange={(e) => {
          const maxLength = props.maxLength
          const value = e.target.value
          if (maxLength !== undefined && value.length > maxLength) {
            e.target.value = value.slice(0, maxLength)
          }
          props.onChange?.(e)
        }}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
