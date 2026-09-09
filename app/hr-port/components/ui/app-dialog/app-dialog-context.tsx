import { X } from "lucide-react"
import React from "react"

import {
  DialogClose,
  DialogHeader,
  DialogTitle,
} from "~/hr-port/components/base/dialog"
import { createSafeContext } from "~/hr-port/features/common/utils/context"
import { cn } from "~/hr-port/utils/style"

type AppDialogComponentContext = {
  description: string
  title: string
}

export const [AppDialogComponentProvider, useAppDialogComponent] =
  createSafeContext<AppDialogComponentContext>("AppDialogComponentContext")

export const AppDialogHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof DialogHeader>
>((props, ref) => {
  const { className, ...rest } = props
  return (
    <DialogHeader
      ref={ref}
      className={cn("dialog-padding", className)}
      {...rest}
    ></DialogHeader>
  )
})
export const AppDialogTitle = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof DialogTitle>
>((props, ref) => {
  const { className, ...rest } = props

  const { title } = useAppDialogComponent()
  return (
    <div className="flex h-[60px] items-center justify-between">
      <DialogTitle ref={ref} {...rest} className={cn("font-bold", className)}>
        {title}
      </DialogTitle>
      <DialogClose>
        <X />
      </DialogClose>
    </div>
  )
})
