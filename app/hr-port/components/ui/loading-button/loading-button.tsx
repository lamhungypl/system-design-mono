import { Loader2 } from "lucide-react"
import { forwardRef } from "react"

import { Button, ButtonProps } from "~/hr-port/components/base/button"

export type LoadingButtonProps = {
  loading?: boolean
} & ButtonProps

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  (props, ref) => {
    const { children, loading, disabled, ...rest } = props

    return (
      <Button {...rest} ref={ref} disabled={disabled || loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
      </Button>
    )
  }
)
LoadingButton.displayName = "IconButton"

export default LoadingButton
