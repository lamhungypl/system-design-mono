import { Slot } from "@radix-ui/react-slot"
import { PropsWithChildren, ReactNode, useState } from "react"

import { AppDialogOpenProps } from "~/hr-port/components/ui/app-dialog/types"

type Props = {
  renderDialog: (dialogProps: AppDialogOpenProps) => ReactNode
}

const AppDialogTrigger = (props: PropsWithChildren<Props>) => {
  const { renderDialog, children } = props
  const [open, setOpen] = useState(false)
  return (
    <>
      <Slot
        onClick={() => {
          setOpen(true)
        }}
      >
        {children}
      </Slot>
      {open && renderDialog({ open, setOpen })}
    </>
  )
}

export default AppDialogTrigger
