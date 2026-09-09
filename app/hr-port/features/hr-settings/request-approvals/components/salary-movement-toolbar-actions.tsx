import { useQueries } from "@tanstack/react-query"

import { requestApprovalsQueryKeys } from "~/hr-port/features/hr-settings/request-approvals/api/query-keys-factories"
import { SalaryMovementRequestItem } from "~/hr-port/features/hr-settings/request-approvals/api/request-approvals.types"
import SalaryMovementApproveButton from "~/hr-port/features/hr-settings/request-approvals/components/salary-movement-approve-button"
import SalaryMovementRejectButton from "~/hr-port/features/hr-settings/request-approvals/components/salary-movement-reject-button"

type Props = {
  selectedKeys: string[]
}

const SalaryMovementToolbarActions = (props: Props) => {
  const { selectedKeys } = props
  const results = useQueries({
    queries: selectedKeys.map((key) => ({
      //NOTE: The data are already seeded in the list component
      queryKey: requestApprovalsQueryKeys.details(key),
      staleTime: Infinity,
    })),
  })
  const selectedRows = results.map(
    (res) => res.data as SalaryMovementRequestItem
  )

  return (
    <div className="flex items-center gap-2">
      <SalaryMovementApproveButton salaryMovements={selectedRows} />
      <SalaryMovementRejectButton salaryMovements={selectedRows} />
    </div>
  )
}

export default SalaryMovementToolbarActions
