import { useCallback } from "react"
import { useTranslation } from "react-i18next"

import AppConfirmCommonDialog from "~/hr-port/components/ui/app-dialog/app-confirm-common-dialog"
import { AppDialogOpenProps } from "~/hr-port/components/ui/app-dialog/types"

type Props = {
  loading?: boolean
  onSubmit?: () => void | Promise<void>
} & AppDialogOpenProps

const AppConfirmDeleteDialog = (props: Props) => {
  const { open, setOpen, onSubmit, loading } = props
  const { t } = useTranslation()

  const handleSubmit = useCallback(async () => {
    await onSubmit?.()
    setOpen(false)
  }, [onSubmit, setOpen])
  return (
    <AppConfirmCommonDialog
      loading={loading}
      open={open}
      setOpen={setOpen}
      onSubmit={handleSubmit}
      title={t("common.dialog_confirm.title")}
      description={t("common.dialog_confirm.description.delete")}
    />
  )
}

export default AppConfirmDeleteDialog
