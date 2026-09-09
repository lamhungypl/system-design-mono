import { useCallback } from "react"

import AppConfirmCommonDialog, {
  AppConfirmCommonDialogProps,
} from "~/hr-port/components/ui/app-dialog/app-confirm-common-dialog"
import { AppDialogOpenProps } from "~/hr-port/components/ui/app-dialog/types"

type Props = {
  description?: string
  loading?: boolean
  onSubmit?: () => void | Promise<void>
  title?: string
} & AppDialogOpenProps &
  Pick<AppConfirmCommonDialogProps, "mutationFilter">

/**
 * @deprecated redundant component, use AppConfirmCommonDialog instead
 */
const AppConfirmRequestDialog = (props: Props) => {
  const {
    open,
    setOpen,
    onSubmit,
    loading,
    title,
    description,
    mutationFilter,
  } = props

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
      title={title}
      description={description}
    />
  )
}

export default AppConfirmRequestDialog // NOSONAR
