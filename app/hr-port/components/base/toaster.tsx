import { VariantProps } from "class-variance-authority"

import {
  ErrorIcon,
  SuccessIcon,
  WarningIcon,
} from "~/hr-port/assets/svgs/icons/Icon"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  toastVariants,
  ToastViewport,
} from "~/hr-port/components/base/toast"
import { useToast } from "~/hr-port/hooks/lib/use-toast"

type ToastVariant = NonNullable<VariantProps<typeof toastVariants>["variant"]>

export function Toaster() {
  const { toasts } = useToast()
  const icons: Record<ToastVariant, React.ComponentType> = {
    success: SuccessIcon,
    warning: WarningIcon,
    default: SuccessIcon,
    destructive: ErrorIcon,
  }

  return (
    <ToastProvider duration={3000}>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        const safeVariant: ToastVariant = props.variant ?? "success"
        const Icon = icons[safeVariant]

        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && (
                <ToastTitle>
                  <Icon /> {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
