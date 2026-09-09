import { useCallback } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "~/hr-port/components/base/button"
import { useAppDialog } from "~/hr-port/components/ui/app-dialog/hooks/use-app-dialog"
import { useApproveOrRejectEmployeeChangeProfileRequestMutation } from "~/hr-port/features/hr-settings/employee-change-profile-request-approvals/api/employee-change-profile-request-approvals.query"
import { EmployeeProfileChangeRequestItem } from "~/hr-port/features/hr-settings/request-approvals/api/request-approvals.types"
import { toast } from "~/hr-port/hooks/lib/use-toast"
import { cn } from "~/hr-port/utils/style"
const mutationKey = "employee-change-profile-approve" as const

type Props = {
  employeeChangeProfileRequests: EmployeeProfileChangeRequestItem[]
}
const EmployeeChangeProfileApproveButton = (props: Props) => {
  const { employeeChangeProfileRequests } = props
  const { t } = useTranslation()
  const disabled = employeeChangeProfileRequests.length === 0
  const { openAppDialog } = useAppDialog()

  const { mutateAsync: approveOrRejectEmployeeChangeProfile } =
    useApproveOrRejectEmployeeChangeProfileRequestMutation({
      mutationKey: [mutationKey],
    })

  const handleApprove = useCallback(() => {
    openAppDialog("AppConfirmRequestDialog", {
      title: t("common.dialog_confirm.title"),
      description: t("common.dialog_confirm.description.approve"),
      mutationFilter: {
        predicate: (mutation) =>
          mutation.options.mutationKey?.includes(mutationKey) ?? false,
      },
      onSubmit: async () => {
        await approveOrRejectEmployeeChangeProfile(
          {
            is_approved: true,
            items: employeeChangeProfileRequests.map((e) => {
              return {
                id: e.id,
                last_modified_at: e.last_modified_at,
              }
            }),
          },
          {
            onSuccess: (data) => {
              console.log(data)
              toast({
                title: t(`common.toast_messages.success.title`),
                description: t(
                  `common.toast_messages.success.approval.employee_change_request.approved`,
                  {
                    n: 1,
                  }
                ),
                variant: "success",
              })
            },
            onError: (err) => {
              toast({
                variant: "destructive",
                title: t("common.toast_messages.error.title"),
                description: t(`${err.response.data.metadatas[0].message}`),
              })
            },
          }
        )
      },
    })
  }, [
    approveOrRejectEmployeeChangeProfile,
    employeeChangeProfileRequests,
    openAppDialog,
    t,
  ])

  return (
    <Button
      className={cn("min-w-[85px]")}
      variant="success"
      disabled={disabled}
      onClick={handleApprove}
    >
      {t("hr_request_approvals.salary_movement.action.approve")}
    </Button>
  )
}

export default EmployeeChangeProfileApproveButton
