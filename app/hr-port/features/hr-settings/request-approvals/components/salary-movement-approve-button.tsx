import { useCallback } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "~/hr-port/components/base/button"
import { useAppDialog } from "~/hr-port/components/ui/app-dialog/hooks/use-app-dialog"
import { SalaryMovementRequestItem } from "~/hr-port/features/hr-settings/request-approvals/api/request-approvals.types"
import { useProcessSalaryMovementMutation } from "~/hr-port/features/profiles/api/salary-movement/salary-movement.query"
import { toast } from "~/hr-port/hooks/lib/use-toast"
import { cn } from "~/hr-port/utils/style"

const mutationKey = "salary-movement-approve" as const

type Props = {
  salaryMovements: SalaryMovementRequestItem[]
}
const SalaryMovementApproveButton = (props: Props) => {
  const { salaryMovements } = props
  const { t } = useTranslation()
  const disabled = salaryMovements.length === 0
  const { openAppDialog } = useAppDialog()

  const { mutateAsync: processSalaryMovement } =
    useProcessSalaryMovementMutation({
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
        await processSalaryMovement(
          {
            approved: true,
            process_salaries: salaryMovements.map((item) => ({
              effective_date: item.effective_date,
              remark: item.remark,
              request_change_salary_id: Number(item.id),
            })),
          },
          {
            onSuccess: (res) => {
              const { totalAction, actionSuccess } =
                res?.data?.params?.[0] ?? {}
              const numberSuccess =
                totalAction === 1 ? "" : `${actionSuccess}/${totalAction}`
              toast({
                title: t(`common.toast_messages.success.title`),
                description: t(
                  `common.toast_messages.success.approval.salary.information.message`,
                  {
                    n: numberSuccess,
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
  }, [openAppDialog, processSalaryMovement, salaryMovements, t])

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

export default SalaryMovementApproveButton
