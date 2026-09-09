import { forwardRef } from "react"

import { Button, ButtonProps } from "~/hr-port/components/base/button"
import { cn } from "~/hr-port/utils/style"

export type IconButtonProps = ButtonProps

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (props, ref) => {
    const { className, disabled, ...rest } = props

    return (
      <Button
        {...rest}
        disabled={disabled}
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn(
          { "text-action-gray hover:bg-none": disabled },
          className
        )}
      />
    )
  }
)
IconButton.displayName = "IconButton"

export default IconButton
