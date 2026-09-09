import { useQueries } from "@tanstack/react-query"

import EmployeeChangeProfileApproveButton from "~/hr-port/features/hr-settings/employee-change-profile-request-approvals/components/employee-change-profile-approve-button"
import EmployeeChangeProfileRequestRejectButton from "~/hr-port/features/hr-settings/employee-change-profile-request-approvals/components/employee-change-profile-request-reject-button"
import { EmployeeProfileChangeRequestItem } from "~/hr-port/features/hr-settings/request-approvals/api/request-approvals.types"

import { employeeChangeProfileRequestApprovalKeys } from "../api/query-keys-factories"

type Props = {
  selectedKeys: string[]
}

const EmployeeChangeProfileRequestToolbarActions = (props: Props) => {
  const { selectedKeys } = props

  const results = useQueries({
    queries: selectedKeys.map((key) => ({
      //NOTE: The data are already seeded in the list component
      queryKey: employeeChangeProfileRequestApprovalKeys.details(key),
      staleTime: Infinity,
    })),
  })

  const selectedRows = results.map(
    (res) => res.data as EmployeeProfileChangeRequestItem
  )

  return (
    <div className="flex items-center gap-2">
      <EmployeeChangeProfileApproveButton
        employeeChangeProfileRequests={selectedRows}
      />
      <EmployeeChangeProfileRequestRejectButton
        employeeChangeProfileRequests={selectedRows}
      />
    </div>
  )
}

export default EmployeeChangeProfileRequestToolbarActions
