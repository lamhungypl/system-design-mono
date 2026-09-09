import { useCallback } from "react"
import { useTranslation } from "react-i18next"

import AppConfirmCommonDialog, {
  AppConfirmCommonDialogProps,
} from "~/hr-port/components/ui/app-dialog/app-confirm-common-dialog"
import { AppDialogOpenProps } from "~/hr-port/components/ui/app-dialog/types"
import { AtLeast } from "~/hr-port/types/common"

type Props = {
  isEdit?: boolean
  loading?: boolean
  onSubmit?: () => void | Promise<void>
} & AppDialogOpenProps &
  AtLeast<AppConfirmCommonDialogProps, "mutationFilter">

const AppConfirmUpdateDialog = (props: Props) => {
  const {
    open,
    setOpen,
    onSubmit,
    isEdit,
    loading,
    mutationFilter,
    title,
    description,
  } = props
  const { t } = useTranslation()

  const handleSubmit = useCallback(async () => {
    await onSubmit?.()
    setOpen(false)
  }, [onSubmit, setOpen])
  return (
    <AppConfirmCommonDialog
      loading={loading}
      mutationFilter={mutationFilter}
      open={open}
      setOpen={setOpen}
      onSubmit={handleSubmit}
      title={title || t("common.dialog_confirm.title")}
      description={
        description ||
        t(
          isEdit
            ? "common.dialog_confirm.description.update"
            : "common.dialog_confirm.description.add"
        )
      }
    />
  )
}

export default AppConfirmUpdateDialog
