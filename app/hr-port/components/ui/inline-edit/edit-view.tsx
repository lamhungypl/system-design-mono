import { Check, X } from "lucide-react"
import { PropsWithChildren, useState } from "react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/hr-port/components/base/popover"
import IconButton from "~/hr-port/components/ui/icon-button/icon-button"

type Props = {
  onCancel?: () => void
  onSubmit?: () => void
}

const EditView = (props: PropsWithChildren<Props>) => {
  const { onCancel, children, onSubmit } = props
  const [open, setOpen] = useState(true)
  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) {
          onCancel?.()
        }
      }}
    >
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="z-[50] w-auto border-none p-0"
        align="end"
        onOpenAutoFocus={(e) => {
          e.preventDefault()
        }}
      >
        <div className="flex items-center gap-1 bg-white p-0.5 pt-2 shadow-buttons-bar">
          <IconButton
            onClick={onSubmit}
            className="rounded-[2px] bg-[#f2f2f2] hover:bg-[#091e4221]"
          >
            <Check className="h-4 w-4" />
          </IconButton>
          <IconButton
            onClick={() => {
              onCancel?.()
              setOpen(false)
            }}
            className="rounded-[2px] bg-[#f2f2f2] hover:bg-[#091e4221]"
          >
            <X className="h-4 w-4" />
          </IconButton>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default EditView
