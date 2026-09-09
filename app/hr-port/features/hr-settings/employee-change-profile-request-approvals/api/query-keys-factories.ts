import {
  DefaultError,
  keepPreviousData,
  queryOptions,
  UseQueryOptions,
} from "@tanstack/react-query"

import { getPageParams } from "~/hr-port/components/ui/data-table/utils"
import {
  getEmployeeChangeProfileRequestDetail,
  getEmployeeChangeProfileRequestList,
  getEmployeeChangeProfileRequestTotalWA,
} from "~/hr-port/features/hr-settings/employee-change-profile-request-approvals/api/employee-change-profile-request-approvals.api"
import {
  EmployeeChangeProfileRequestListPayload,
  EmployeeChangeProfileRequestListResponse,
  EmployeeChangeProfileRequestTotalResponse,
  REQUEST_APPROVAL_STATUS,
} from "~/hr-port/features/hr-settings/request-approvals/api/request-approvals.types"

import { GetEmployeeChangeProfileRequestDetailsResponse } from "./employee-change-profile-request-approvals.types"

export const employeeChangeProfileRequestApprovalKeys = {
  all: ["employee-change-profile"] as const,
  lists: () =>
    [...employeeChangeProfileRequestApprovalKeys.all, "list"] as const,
  list: (payload?: EmployeeChangeProfileRequestListPayload) =>
    [...employeeChangeProfileRequestApprovalKeys.lists(), payload] as const,
  details: (id: string) =>
    [
      ...employeeChangeProfileRequestApprovalKeys.all,
      "details",
      id.toString(),
    ] as const,
  changeRequestDetails: (id: string) =>
    [
      ...employeeChangeProfileRequestApprovalKeys.all,
      "change-request-details",
      id.toString(),
    ] as const,
  totalAwaiting: () =>
    [
      ...employeeChangeProfileRequestApprovalKeys.all,
      REQUEST_APPROVAL_STATUS.AWAITING_APPROVAL,
      "total",
    ] as const,
}

export type EmployeeChangeProfileRequestListQueryOptions<
  TSelectedData = never,
> = Partial<
  UseQueryOptions<
    EmployeeChangeProfileRequestListResponse,
    DefaultError,
    TSelectedData extends never
      ? EmployeeChangeProfileRequestListResponse
      : TSelectedData,
    ReturnType<typeof employeeChangeProfileRequestApprovalKeys.list>
  >
>

export type EmployeeChangeProfileRequestTotalQueryOptions<
  TSelectedData = never,
> = Partial<
  UseQueryOptions<
    EmployeeChangeProfileRequestTotalResponse,
    DefaultError,
    TSelectedData extends never
      ? EmployeeChangeProfileRequestTotalResponse
      : TSelectedData,
    ReturnType<typeof employeeChangeProfileRequestApprovalKeys.totalAwaiting>
  >
>

export type EmployeeChangeProfileRequestDetailsQueryOptions = Partial<
  UseQueryOptions<
    GetEmployeeChangeProfileRequestDetailsResponse["data"],
    Error,
    GetEmployeeChangeProfileRequestDetailsResponse["data"],
    ReturnType<
      typeof employeeChangeProfileRequestApprovalKeys.changeRequestDetails
    >
  >
>

export const employeeChangeProfileRequestApprovalsQueryOptions = {
  list: <T>(
    payload?: EmployeeChangeProfileRequestListPayload,
    options?: EmployeeChangeProfileRequestListQueryOptions<T>
  ) => {
    const params = getPageParams(payload)

    return queryOptions({
      queryKey: employeeChangeProfileRequestApprovalKeys.list(payload),
      queryFn: () => getEmployeeChangeProfileRequestList(params),
      placeholderData: keepPreviousData,
      ...options,
    })
  },
  totalAwaiting: <T>(
    options?: EmployeeChangeProfileRequestTotalQueryOptions<T>
  ) => {
    return queryOptions({
      queryKey: employeeChangeProfileRequestApprovalKeys.totalAwaiting(),
      queryFn: () => getEmployeeChangeProfileRequestTotalWA(),
      placeholderData: keepPreviousData,
      ...options,
    })
  },
  changeRequestDetails: (
    id: string,
    options?: EmployeeChangeProfileRequestDetailsQueryOptions
  ) => {
    return queryOptions({
      queryKey:
        employeeChangeProfileRequestApprovalKeys.changeRequestDetails(id),
      queryFn: () => getEmployeeChangeProfileRequestDetail(id),
      placeholderData: keepPreviousData,
      ...options,
    })
  },
}
