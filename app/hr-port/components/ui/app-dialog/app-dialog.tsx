import { X } from "lucide-react"
import { ComponentProps, ReactNode, useCallback, useRef } from "react"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "~/hr-port/components/base/dialog"
import { AppDialogOpenProps } from "~/hr-port/components/ui/app-dialog/types"
import useGetDevice from "~/hr-port/hooks/use-get-device"
import { cn } from "~/hr-port/utils/style"

import { useAppDialogContext } from "./hooks/use-app-dialog-context"
import { AppDialogProvider } from "./providers/app-dialog-provider"

export type AppDialogProps = {
  children?: ReactNode
  description?: ReactNode
  noOverlay?: boolean
  overrideContent?: ReactNode
  slotProps?: {
    content?: ComponentProps<"div">
    description?: ComponentProps<typeof DialogDescription>
    dialogContent?: ComponentProps<typeof DialogContent>
    header?: ComponentProps<typeof DialogHeader>
    overlay?: ComponentProps<typeof DialogOverlay>
    title?: ComponentProps<typeof DialogTitle>
  }
  title: string | ReactNode
  trigger?: ReactNode
} & AppDialogOpenProps &
  Pick<
    ComponentProps<typeof DialogContent>,
    "position" | "standaloneCloseButton"
  >

const AppDialog = (props: AppDialogProps) => {
  return (
    <AppDialogProvider>
      <AppDialogInner {...props} />
    </AppDialogProvider>
  )
}

const AppDialogInner = (props: AppDialogProps) => {
  const {
    position = "center",
    title,
    description,
    open,
    setOpen,
    children,
    trigger,
    slotProps,
    standaloneCloseButton,
    noOverlay = false,
  } = props

  const dialogHeaderRef = useRef<HTMLDivElement>(null)

  const { largeMobileAndSmaller } = useGetDevice()
  const { customOnClose } = useAppDialogContext()

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (customOnClose && !open) {
        customOnClose()
      } else {
        setOpen(open)
      }
    },
    [customOnClose, setOpen]
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogPortal>
        {!noOverlay && (
          <DialogOverlay
            onClick={() => onOpenChange(false)}
            {...slotProps?.overlay}
          />
        )}

        <DialogContent
          {...slotProps?.dialogContent}
          standaloneCloseButton={standaloneCloseButton}
          position={position}
          className={cn(
            "group p-0 pt-3 sm:max-w-[700px]",
            "data-[collapsible=collapsed]:w-0",
            {
              "w-[100vw]": largeMobileAndSmaller,
            },
            slotProps?.dialogContent?.className
          )}
          onInteractOutside={(e) => {
            e.preventDefault()
          }}
        >
          <DialogHeader
            {...slotProps?.header}
            ref={dialogHeaderRef}
            className={cn("dialog-padding", slotProps?.header?.className)}
          >
            <div className="flex h-[60px] items-center justify-between gap-4">
              <DialogTitle
                {...slotProps?.title}
                className={cn("font-bold", slotProps?.title?.className)}
              >
                {title}
              </DialogTitle>
              <DialogClose data-testid="close-button">
                <X />
              </DialogClose>
            </div>
          </DialogHeader>
          <div
            {...slotProps?.content}
            className={cn(
              "dialog-padding overflow-auto",
              {
                "dialog-content-padding": true,
              },
              slotProps?.content?.className
            )}
          >
            {!!description && (
              <DialogDescription {...slotProps?.description}>
                {description}
              </DialogDescription>
            )}
            {children}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}

export default AppDialog
