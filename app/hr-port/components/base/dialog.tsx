import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cva, VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import * as React from "react"

import { cn } from "~/hr-port/utils/style"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 cursor-pointer bg-black/80 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

/**
 * @description
 * style based on shadcn/ui's dialog (center) and shadcn/ui's sheet (top, bottom, left, right)
 */
const dialogVariants = cva(
  "fixed z-50 flex flex-col gap-4 bg-white p-6 shadow-lg transition ease-in-out data-[state=closed]:animate-out data-[state=closed]:duration-100 data-[state=open]:animate-in data-[state=open]:duration-100",
  {
    variants: {
      position: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: cn(
          "inset-y-0 right-0 h-full w-3/4 border-l",
          "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
        ),
        center: cn(
          "top-[50%] left-[50%] w-full max-w-lg translate-x-[-50%] translate-y-[-50%]",
          "rounded-lg data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
        ),
        full: "w-full",
      },
    },
    defaultVariants: {
      position: "center",
    },
  }
)

type DialogContentProps = {
  /**
   * @description  use to show close button outside of dialog header
   */
  standaloneCloseButton?: boolean
} & React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> &
  VariantProps<typeof dialogVariants>

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>((props, ref) => {
  const {
    className,
    children,
    position = "center",
    standaloneCloseButton,
    ...rest
  } = props

  return (
    <DialogPrimitive.Content
      ref={ref}
      {...rest}
      className={cn(dialogVariants({ position }), className)}
    >
      {children}

      {standaloneCloseButton && (
        <DialogPrimitive.Close className="absolute top-4 right-4 z-[51] rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X />
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  )
})
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
))
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-row justify-end space-x-2 group-data-[collapsible=collapsed]:invisible",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg leading-none font-semibold tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
