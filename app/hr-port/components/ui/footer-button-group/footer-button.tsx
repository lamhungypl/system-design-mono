import clsx from "clsx"
import { forwardRef } from "react"

import { cn } from "~/hr-port/utils/style"

import LoadingButton, {
  LoadingButtonProps,
} from "../loading-button/loading-button"

export type FooterButtonProps = LoadingButtonProps

const FooterButton = forwardRef<HTMLButtonElement, FooterButtonProps>(
  (props, ref) => {
    const { className, variant, ...rest } = props

    return (
      <LoadingButton
        {...rest}
        ref={ref}
        className={cn(
          "flex-1 rounded-none border-t-transparent border-b-transparent",
          clsx({
            "border-transparent":
              variant && ["outline_secondary", "secondary"].includes(variant),
          }),
          className
        )}
        variant={variant}
      />
    )
  }
)

FooterButton.displayName = "FooterButton"

export default FooterButton
