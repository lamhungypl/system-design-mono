import { type ComponentProps, lazy } from "react"

/**
 * PORT: trimmed registry.
 *
 * The source registers every dialog in the application here (~30 lazy imports), which
 * is what makes its import closure span payroll, home and analytic-report. Only the
 * dialogs reachable from /playground/table-modal-changes are registered.
 *
 * To add one back: copy its component into app/hr-port/** and add the lazy import here.
 */
const AppConfirmCommonDialog = lazy(
  () => import("~/hr-port/components/ui/app-dialog/app-confirm-common-dialog")
)

const AppConfirmUpdateDialog = lazy(
  () => import("~/hr-port/components/ui/app-dialog/app-confirm-update-dialog")
)

const AppConfirmDeleteDialog = lazy(
  () => import("~/hr-port/components/ui/app-dialog/app-confirm-delete-dialog")
)

const AppConfirmRequestDialog = lazy(
  () => import("~/hr-port/components/ui/app-dialog/app-confirm-request")
)

const AppConfirmCancelDialog = lazy(
  () => import("~/hr-port/components/ui/app-dialog/app-confirm-cancel-dialog")
)

const AppPreviewDialog = lazy(
  () => import("~/hr-port/components/ui/app-preview-dialog/app-preview-dialog")
)

const AddEditDataTableItemDialog = lazy(
  () =>
    import("~/hr-port/components/form/form-data-table/add-data-table-item-dialog")
)

const ConfirmUpdateDataTableItemDialog = lazy(
  () =>
    import("~/hr-port/components/form/form-data-table/confirm-update-data-table-item-dialog")
)

const EmployeeChangeProfileCompareDialog = lazy(
  () =>
    import("~/hr-port/features/hr-settings/employee-change-profile-request-approvals/components/employee-change-profile-compare-dialog/employee-change-profile-compare-dialog")
)

export const dialogRegister = {
  // ui
  AppConfirmCommonDialog,
  AppConfirmUpdateDialog,
  AppConfirmDeleteDialog,
  AppConfirmRequestDialog,
  AppConfirmCancelDialog,
  AppPreviewDialog,

  // form
  AddEditDataTableItemDialog,
  ConfirmUpdateDataTableItemDialog,

  // hr-settings/employee-change-profile-request-approvals
  EmployeeChangeProfileCompareDialog,
} as const

export type DialogRegister = typeof dialogRegister
export type DialogName = keyof DialogRegister
export type DialogProps = {
  [key in DialogName]: ComponentProps<DialogRegister[key]>
}
