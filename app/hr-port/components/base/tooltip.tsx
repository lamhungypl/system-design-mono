import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import * as React from "react"
import { createContext } from "react"

import useHasHover from "~/hr-port/hooks/use-has-hover"
import { cn } from "~/hr-port/utils/style"

type TooltipTriggerContextType = {
  open: boolean
  setOpen: (open: boolean) => void
}

export const TooltipTriggerContext = createContext<TooltipTriggerContextType>({
  open: false,
  setOpen: () => {},
})

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip: React.FC<TooltipPrimitive.TooltipProps> = ({
  children,
  ...props
}) => {
  const [open, setOpen] = React.useState<boolean>(props.defaultOpen ?? false)

  // we only want to enable the "click to open" functionality on mobile
  const hasHover = useHasHover()

  const contextValue = React.useMemo(() => {
    return {
      open,
      setOpen,
    }
  }, [open, setOpen])

  return (
    <TooltipPrimitive.Root
      delayDuration={hasHover ? props.delayDuration : 0}
      onOpenChange={(open) => {
        setOpen(open)
      }}
      open={open}
    >
      <TooltipTriggerContext.Provider value={contextValue}>
        {children}
      </TooltipTriggerContext.Provider>
    </TooltipPrimitive.Root>
  )
}

const TooltipTrigger = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>
>(({ children, ...props }, ref) => {
  const hasHover = useHasHover()
  const { setOpen } = React.useContext(TooltipTriggerContext)

  return (
    <TooltipPrimitive.Trigger
      ref={ref}
      type="button"
      {...props}
      onClick={(e) => {
        if (!hasHover) {
          e.preventDefault()
          setOpen(true)
        }
      }}
    >
      {children}
    </TooltipPrimitive.Trigger>
  )
})

export type TooltipContentProps = {
  disablePortal?: boolean
} & React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(
  (
    {
      className,
      sideOffset = 10,
      side = "top",
      align = "center",
      disablePortal = false,
      ...props
    },
    ref
  ) => {
    const Wrapper = React.useMemo(() => {
      return disablePortal ? React.Fragment : TooltipPrimitive.Portal
    }, [disablePortal])
    return (
      <Wrapper>
        <TooltipPrimitive.Content
          side={side}
          align={align}
          ref={ref}
          sideOffset={sideOffset}
          className={cn(
            "z-50 animate-in overflow-hidden rounded-md shadow-md fade-in-50 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1",
            "border border-primary bg-white px-3.5 py-1.5 text-xs font-medium text-black",
            "max-w-[min(calc(100vw-100px),300px)]",
            className
          )}
          {...props}
        />
      </Wrapper>
    )
  }
)
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
