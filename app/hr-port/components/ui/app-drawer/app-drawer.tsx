import { X } from "lucide-react"
import { ComponentProps, ReactNode } from "react"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/hr-port/components/base/drawer"
import { cn } from "~/hr-port/utils/style"

import { AppDialogOpenProps } from "../app-dialog/types"

export type AppDrawerProps = {
  children?: ReactNode
  description?: ReactNode
  slotProps?: {
    content?: ComponentProps<"div">
    description?: ComponentProps<typeof DrawerDescription>
    dialogContent?: ComponentProps<typeof DrawerContent>
    header?: ComponentProps<typeof DrawerHeader>
    title?: ComponentProps<typeof DrawerTitle>
  }
  title: string | ReactNode
  trigger?: ReactNode
} & AppDialogOpenProps

export default function AppDrawer(props: AppDrawerProps) {
  const { title, description, open, setOpen, children, trigger, slotProps } =
    props

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent
        {...slotProps?.dialogContent}
        className={cn(slotProps?.dialogContent?.className)}
      >
        <DrawerHeader
          {...slotProps?.header}
          className={cn("dialog-padding py-0", slotProps?.header?.className)}
        >
          <div className="flex h-[72px] items-center justify-between">
            <DrawerTitle
              {...slotProps?.title}
              className={cn("font-bold", slotProps?.title?.className)}
            >
              {title}
            </DrawerTitle>
            <DrawerClose>
              <X />
            </DrawerClose>
          </div>
        </DrawerHeader>
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
            <DrawerDescription
              {...slotProps?.description}
              className={cn(
                "font-semibold text-foreground",
                slotProps?.description?.className
              )}
            >
              {description}
            </DrawerDescription>
          )}
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
