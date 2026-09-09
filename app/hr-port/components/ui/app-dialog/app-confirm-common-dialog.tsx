import { MutationFilters, useIsMutating } from "@tanstack/react-query"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "~/hr-port/components/base/button"
import { DialogFooter } from "~/hr-port/components/base/dialog"
import AppConfirmDialog from "~/hr-port/components/ui/app-dialog/app-confirm-dialog"
import { AppDialogProps } from "~/hr-port/components/ui/app-dialog/app-dialog"
import LoadingButton from "~/hr-port/components/ui/loading-button/loading-button"
import useGetDevice from "~/hr-port/hooks/use-get-device"

import AppDrawer from "../app-drawer/app-drawer"
import FooterButton from "../footer-button-group/footer-button"
import FooterButtonGroup from "../footer-button-group/footer-button-group"

export type AppConfirmCommonDialogProps = {
  closeAfterSubmit?: boolean
  loading?: boolean
  mutationFilter?: MutationFilters
  onCancel?: () => void
  onSubmit?: () => void | Promise<void>
  showCancelButton?: boolean
  showSubmitButton?: boolean
  textCancel?: string
  textSubmit?: string
} & AppDialogProps

/**
 *
 * @description common confirm dialog : includes only title and description content.
 */
const AppConfirmCommonDialog = (props: AppConfirmCommonDialogProps) => {
  const {
    loading: loadingProp,
    mutationFilter,
    open,
    setOpen,
    onSubmit,
    onCancel,
    textCancel,
    textSubmit,
    closeAfterSubmit = true,
    showCancelButton = true,
    showSubmitButton = true,
    ...rest
  } = props
  const { t } = useTranslation()
  const { largeMobileAndSmaller } = useGetDevice()

  const mutationCount = useIsMutating(mutationFilter)
  const mutationLoading = loadingProp || (!!mutationFilter && mutationCount > 0)
  const [internalLoading, setInternalLoading] = useState(false)

  const isLoading =
    mutationFilter !== undefined ? mutationLoading : internalLoading

  if (largeMobileAndSmaller)
    return (
      <AppDrawer {...rest} open={open} setOpen={setOpen}>
        <FooterButtonGroup hasShadow>
          {showCancelButton && (
            <FooterButton
              variant="outline_secondary"
              onClick={() => {
                onCancel?.()
                setOpen(false)
              }}
            >
              {textCancel ?? t("common.button.no")}
            </FooterButton>
          )}
          {showSubmitButton && (
            <FooterButton
              loading={mutationLoading}
              onClick={async () => {
                setInternalLoading(true)
                await onSubmit?.()
                if (closeAfterSubmit) {
                  setOpen(false)
                }
                setInternalLoading(false)
              }}
            >
              {textSubmit ?? t("common.button.yes")}
            </FooterButton>
          )}
        </FooterButtonGroup>
      </AppDrawer>
    )

  return (
    <AppConfirmDialog {...rest} open={open} setOpen={setOpen}>
      <DialogFooter className="dialog-footer dialog-padding">
        {showCancelButton && (
          <Button
            data-testid="cancel-button"
            variant="outline_secondary"
            className="min-w-[112px]"
            onClick={() => {
              onCancel?.()
              setOpen(false)
            }}
          >
            {textCancel ?? t("common.button.no")}
          </Button>
        )}
        {showSubmitButton && (
          <LoadingButton
            data-testid="submit-button"
            loading={isLoading}
            onClick={async () => {
              setInternalLoading(true)
              await onSubmit?.()
              if (closeAfterSubmit) {
                setOpen(false)
              }
              setInternalLoading(false)
            }}
            className="min-w-[112px]"
          >
            {textSubmit ?? t("common.button.yes")}
          </LoadingButton>
        )}
      </DialogFooter>
    </AppConfirmDialog>
  )
}

export default AppConfirmCommonDialog
