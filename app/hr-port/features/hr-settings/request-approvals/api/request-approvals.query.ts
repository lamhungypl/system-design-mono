import { useQuery } from "@tanstack/react-query"

import {
  requestApprovalsQueryOptions,
  SalaryMovementRequestListQueryOptions,
  SalaryMovementRequestTotalQueryOptions,
} from "~/hr-port/features/hr-settings/request-approvals/api/query-keys-factories"
import { SalaryMovementRequestListPayload } from "~/hr-port/features/hr-settings/request-approvals/api/request-approvals.types"

export const useSalaryMovementRequestListQuery = <T>(
  payload: SalaryMovementRequestListPayload,
  options?: SalaryMovementRequestListQueryOptions<T>
) => {
  return useQuery(requestApprovalsQueryOptions.list(payload, options))
}

export const useSalaryMovementRequestTotalQuery = <T>(
  options?: SalaryMovementRequestTotalQueryOptions<T>
) => {
  return useQuery(requestApprovalsQueryOptions.totalAwaiting(options))
}
