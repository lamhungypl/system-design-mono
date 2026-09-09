import { useCallback } from "react"

import AppConfirmUpdateDialog from "~/hr-port/components/ui/app-dialog/app-confirm-update-dialog"
import { AppDialogOpenProps } from "~/hr-port/components/ui/app-dialog/types"

type Props = {
  isEdit?: boolean
  onSubmit: (values?: Record<string, any>) => void
  payload?: Record<string, any>
} & AppDialogOpenProps

const ConfirmUpdateDataTableItemDialog = (props: Props) => {
  const { open, setOpen, onSubmit, payload, isEdit } = props

  const handleSubmit = useCallback(() => {
    onSubmit?.(payload)
    setOpen(false)
  }, [onSubmit, payload, setOpen])

  return (
    <AppConfirmUpdateDialog
      open={open}
      setOpen={setOpen}
      onSubmit={handleSubmit}
      isEdit={isEdit}
    />
  )
}

export default ConfirmUpdateDataTableItemDialog
