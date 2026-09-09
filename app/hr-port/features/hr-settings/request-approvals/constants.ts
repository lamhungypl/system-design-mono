import { TFunction } from "i18next"

import { tableStateToQueryParams } from "~/hr-port/components/ui/data-table/utils"
import { convertObjectToArrayOption } from "~/hr-port/features/common/utils"
import {
  cleanParamsIfEqualDefaultConfigs,
  paramsToQueryString,
} from "~/hr-port/features/common/utils/routers"
import {
  REQUEST_APPROVAL_SEARCH_BY,
  REQUEST_APPROVAL_STATUS,
} from "~/hr-port/features/hr-settings/request-approvals/api/request-approvals.types"

export const getRequestApprovalStatusMapping = (t: TFunction) => ({
  [REQUEST_APPROVAL_STATUS.AWAITING_APPROVAL]: t(
    "hr_request_approvals.salary_movement.status.awaiting_approval"
  ),
  [REQUEST_APPROVAL_STATUS.APPROVED]: t(
    "hr_request_approvals.salary_movement.status.approved"
  ),
  [REQUEST_APPROVAL_STATUS.REJECTED]: t(
    "hr_request_approvals.salary_movement.status.rejected"
  ),
})

export const getRequestApprovalSearchByMapping = (t: TFunction) => ({
  [REQUEST_APPROVAL_SEARCH_BY.EMPLOYEE]: t(
    "hr_request_approvals.search_by.employee"
  ),
  [REQUEST_APPROVAL_SEARCH_BY.APPROVER]: t(
    "hr_request_approvals.search_by.approver"
  ),
})

export const requestApprovalStatusOptions = (t: TFunction) =>
  convertObjectToArrayOption(
    getRequestApprovalStatusMapping(t),
    [
      REQUEST_APPROVAL_STATUS.AWAITING_APPROVAL,
      REQUEST_APPROVAL_STATUS.APPROVED,
      REQUEST_APPROVAL_STATUS.REJECTED,
    ],
    {
      labelKey: "label",
      valueKey: "value",
    }
  )

export const requestApprovalSearchByOptions = (t: TFunction) =>
  convertObjectToArrayOption(
    getRequestApprovalSearchByMapping(t),
    [REQUEST_APPROVAL_SEARCH_BY.EMPLOYEE, REQUEST_APPROVAL_SEARCH_BY.APPROVER],
    {
      labelKey: "label",
      valueKey: "value",
    }
  )

export const defaultSalaryMovementRequestQueryParams = paramsToQueryString(
  cleanParamsIfEqualDefaultConfigs(
    tableStateToQueryParams({
      sorting: [{ id: "created_at", desc: true }],
      columnFilters: [
        {
          id: "status",
          value: [REQUEST_APPROVAL_STATUS.AWAITING_APPROVAL],
        },
      ],
    })
  )
)

export const defaultEmployeeChangeProfileRequestQueryParams =
  paramsToQueryString(
    cleanParamsIfEqualDefaultConfigs(
      tableStateToQueryParams({
        sorting: [{ id: "created_at", desc: true }],
        columnFilters: [
          {
            id: "status",
            value: [REQUEST_APPROVAL_STATUS.AWAITING_APPROVAL],
          },
          {
            id: "search_by",
            value: [REQUEST_APPROVAL_SEARCH_BY.EMPLOYEE],
          },
        ],
      })
    )
  )
