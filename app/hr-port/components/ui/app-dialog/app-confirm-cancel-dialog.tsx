import { useCallback } from "react"
import { useTranslation } from "react-i18next"

import AppConfirmCommonDialog from "~/hr-port/components/ui/app-dialog/app-confirm-common-dialog"
import { AppDialogOpenProps } from "~/hr-port/components/ui/app-dialog/types"

type Props = {
  loading?: boolean
  onSubmit?: () => void | Promise<void>
} & AppDialogOpenProps

const AppConfirmCancelDialog = (props: Props) => {
  const { open, setOpen, onSubmit, loading } = props
  const { t } = useTranslation()

  const handleSubmit = useCallback(async () => {
    await onSubmit?.()
    setOpen(false)
  }, [onSubmit, setOpen])

  const handleCancel = useCallback(async () => {
    setOpen(false)
  }, [setOpen])

  return (
    <AppConfirmCommonDialog
      loading={loading}
      open={open}
      setOpen={setOpen}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
      title={t("common.dialog_confirm_cancel.title")}
      description={t("common.dialog_confirm_cancel.description")}
      textCancel={t("common.button.keep")}
      textSubmit={t("common.button.discard")}
    />
  )
}

export default AppConfirmCancelDialog
