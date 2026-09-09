import {
  DefaultError,
  keepPreviousData,
  queryOptions,
  UseQueryOptions,
} from "@tanstack/react-query"

import { getPageParams } from "~/hr-port/components/ui/data-table/utils"
import {
  getSalaryMovementRequestList,
  getSalaryMovementRequestTotal,
} from "~/hr-port/features/hr-settings/request-approvals/api/request-approvals.api"
import {
  REQUEST_APPROVAL_STATUS,
  SalaryMovementRequestListPayload,
  SalaryMovementRequestListResponse,
  SalaryMovementRequestTotalResponse,
} from "~/hr-port/features/hr-settings/request-approvals/api/request-approvals.types"

export const requestApprovalsQueryKeys = {
  all: ["request-approvals"] as const,
  lists: () => [...requestApprovalsQueryKeys.all, "list"] as const,
  list: (payload?: SalaryMovementRequestListPayload) =>
    [...requestApprovalsQueryKeys.lists(), payload] as const,
  details: (id: string) =>
    [...requestApprovalsQueryKeys.all, "details", id.toString()] as const,
  totalAwaiting: () =>
    [
      ...requestApprovalsQueryKeys.all,
      REQUEST_APPROVAL_STATUS.AWAITING_APPROVAL,
      "total",
    ] as const,
}

/**
 * TODO: fix this generic type
 */
export type SalaryMovementRequestListQueryOptions<TSelectedData = never> =
  Partial<
    UseQueryOptions<
      SalaryMovementRequestListResponse,
      DefaultError,
      TSelectedData extends never
        ? SalaryMovementRequestListResponse
        : TSelectedData,
      ReturnType<typeof requestApprovalsQueryKeys.list>
    >
  >

export type SalaryMovementRequestTotalQueryOptions<TSelectedData = never> =
  Partial<
    UseQueryOptions<
      SalaryMovementRequestTotalResponse,
      DefaultError,
      TSelectedData extends never
        ? SalaryMovementRequestTotalResponse
        : TSelectedData,
      ReturnType<typeof requestApprovalsQueryKeys.totalAwaiting>
    >
  >

export const requestApprovalsQueryOptions = {
  list: <T>(
    payload?: SalaryMovementRequestListPayload,
    options?: SalaryMovementRequestListQueryOptions<T>
  ) => {
    const params = getPageParams(payload)

    return queryOptions({
      queryKey: requestApprovalsQueryKeys.list(payload),
      queryFn: () => getSalaryMovementRequestList(params),
      placeholderData: keepPreviousData,
      ...options,
    })
  },
  totalAwaiting: <T>(options?: SalaryMovementRequestTotalQueryOptions<T>) => {
    return queryOptions({
      queryKey: requestApprovalsQueryKeys.totalAwaiting(),
      queryFn: () => getSalaryMovementRequestTotal(),
      placeholderData: keepPreviousData,
      ...options,
    })
  },
}
