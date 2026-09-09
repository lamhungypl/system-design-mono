import clsx from "clsx"
import { PropsWithChildren } from "react"

import { Button, ButtonProps } from "~/hr-port/components/base/button"
import { cn } from "~/hr-port/utils/style"

export type PaginationButtonProps = {
  disabled?: boolean
  isActive?: boolean
  onClick: () => void
} & ButtonProps

export default function PaginationButton({
  isActive,
  onClick,
  children,
  disabled,
  ...rest
}: PropsWithChildren<PaginationButtonProps>) {
  return (
    <Button
      {...rest}
      variant="outline_secondary"
      className={cn(
        "h-8 w-8 rounded border-[#E8E8E8] p-0 text-[#212B36]",
        clsx({
          "border-primary bg-primary/20 text-primary": isActive,
        })
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  )
}
