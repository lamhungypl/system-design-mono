import { useEffect, useRef, type ReactNode } from "react"

import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { cn } from "~/lib/utils"

/**
 * PORT: `mathgpt_app/src/components/Common/Modals.tsx` — the shared modal shell every MathGPT dialog
 * is built on. Only the members the Review changes dialog uses are carried over; the enum keeps all
 * of upstream's names so a later real port is a diff rather than a translation.
 */
export enum FooterType {
  SINGLE = "single",
  DOUBLE = "double",
  TRIPLE = "triple",
  FULL_WIDTH_DOUBLE = "full-width-double",
  FULL_WIDTH_SAME_SIZE_DOUBLE = "full-width-same-size-double",
  VERTICAL_DOUBLE = "vertical-double",
  BETWEEN_DOUBLE = "between-double",
  SINGLE_RIGHT = "single-right",
  SECONDARY_SINGLE_LEFT = "secondary-single-left",
  NONE = "none",
}

export type ModalSizeType =
  | "small"
  | "medium"
  | "large"
  | "semiExtraLarge"
  | "extraLarge"

/** Upstream sizes are AhaUI's; these are the nearest widths here. `extraLarge` is the 1392px the
 *  Review changes frame (45938:34996) is drawn at. */
const SIZE_CLASS: Record<ModalSizeType, string> = {
  small: "max-w-sm",
  medium: "max-w-2xl",
  large: "max-w-4xl",
  semiExtraLarge: "max-w-6xl",
  extraLarge: "max-w-[1392px]",
}

export type BaseModalProps = {
  id: string
  "data-testid"?: string
  size?: ModalSizeType
  closable?: boolean
  onHide: () => void
  headerText?: ReactNode
  body: ReactNode
  footerType?: FooterType
  primaryButtonText?: ReactNode
  onClickPrimaryButton?: () => void
  disablePrimaryButton?: boolean
  primaryButtonProps?: { isLoading?: boolean; loadingText?: string }
  secondaryButtonText?: ReactNode
  onClickSecondaryButton?: () => void
  disableSecondaryButton?: boolean
  className?: string
}

export default function Modal({
  id,
  "data-testid": dataTestId,
  size = "medium",
  closable = true,
  onHide,
  headerText,
  body,
  footerType = FooterType.NONE,
  primaryButtonText,
  onClickPrimaryButton,
  disablePrimaryButton,
  primaryButtonProps,
  secondaryButtonText,
  onClickSecondaryButton,
  disableSecondaryButton,
  className,
}: BaseModalProps) {
  // MathGPT mounts a dialog by adding it to the tree (`modalMap`) and unmounts it to close, and the
  // page here does the same. A native <dialog> only restores focus when it is *closed*; unmounting
  // one while open drops focus on <body>, stranding a keyboard user at the top of the page. So the
  // trigger is remembered on mount and refocused on unmount.
  //
  // Captured during the first render, not in an effect: the child <Dialog> calls `showModal()` in
  // its own effect, and child effects run before the parent's, so by then focus is already inside
  // the dialog and the trigger is lost.
  const triggerRef = useRef<Element | null>(null)
  if (triggerRef.current === null && typeof document !== "undefined") {
    triggerRef.current = document.activeElement
  }
  useEffect(
    () => () => {
      const trigger = triggerRef.current
      if (trigger instanceof HTMLElement && document.contains(trigger)) {
        trigger.focus()
      }
    },
    []
  )

  const primary =
    primaryButtonText != null ? (
      <Button
        onClick={onClickPrimaryButton}
        disabled={disablePrimaryButton || primaryButtonProps?.isLoading}
      >
        {primaryButtonProps?.isLoading
          ? (primaryButtonProps.loadingText ?? primaryButtonText)
          : primaryButtonText}
      </Button>
    ) : null

  const secondary =
    secondaryButtonText != null ? (
      <Button
        variant="outline"
        onClick={onClickSecondaryButton}
        disabled={disableSecondaryButton}
      >
        {secondaryButtonText}
      </Button>
    ) : null

  return (
    <Dialog
      open
      onClose={onHide}
      dismissible={closable}
      className={cn(
        "flex max-h-[90vh] w-full flex-col overflow-hidden p-0",
        SIZE_CLASS[size],
        className
      )}
    >
      <div id={id} data-testid={dataTestId} className="flex min-h-0 flex-col">
        <div className="shrink-0 px-6 pt-6">
          {closable ? (
            <DialogHeader onClose={onHide}>
              <DialogTitle className="text-xl">{headerText}</DialogTitle>
            </DialogHeader>
          ) : (
            <DialogTitle className="text-xl">{headerText}</DialogTitle>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-auto px-6 py-4">{body}</div>

        {footerType !== FooterType.NONE && (
          <DialogFooter
            className={cn(
              "mt-0 shrink-0 border-t border-border px-6 py-4",
              footerType === FooterType.SECONDARY_SINGLE_LEFT && "justify-start"
            )}
          >
            {footerType === FooterType.SECONDARY_SINGLE_LEFT ? (
              secondary
            ) : (
              <>
                {secondary}
                {primary}
              </>
            )}
          </DialogFooter>
        )}
      </div>
    </Dialog>
  )
}
