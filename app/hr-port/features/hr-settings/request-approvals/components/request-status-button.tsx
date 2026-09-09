import { cva } from "class-variance-authority"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "~/hr-port/components/base/button"
import { REQUEST_APPROVAL_STATUS } from "~/hr-port/features/hr-settings/request-approvals/api/request-approvals.types"
import { getRequestApprovalStatusMapping } from "~/hr-port/features/hr-settings/request-approvals/constants"
import { cn } from "~/hr-port/utils/style"

const statusVariants = cva("h-6 rounded-sm border-none px-2 py-1 text-xs", {
  variants: {
    status: {
      [REQUEST_APPROVAL_STATUS.AWAITING_APPROVAL]:
        "bg-[rgba(255,171,61,0.22)] text-[rgba(255,171,61,1)]",
      [REQUEST_APPROVAL_STATUS.APPROVED]:
        "bg-action-green/20 text-action-green",
      [REQUEST_APPROVAL_STATUS.REJECTED]: "bg-action-red/20 text-action-red",
    },
  },
})

type Props = {
  className?: string
  status: REQUEST_APPROVAL_STATUS
}

const RequestStatusButton = (props: Props) => {
  const { status, className } = props
  const { t } = useTranslation()

  const statusMapping = useMemo(() => getRequestApprovalStatusMapping(t), [t])

  return (
    <Button
      className={cn(statusVariants({ status }), className)}
      variant="secondary"
      size="icon"
    >
      {statusMapping?.[status] ?? ""}
    </Button>
  )
}

export default RequestStatusButton
