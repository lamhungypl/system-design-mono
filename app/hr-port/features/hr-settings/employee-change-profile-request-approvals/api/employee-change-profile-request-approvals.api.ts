import { apiPrivate } from "~/hr-port/config/axios"
import {
  EmployeeChangeProfileRequestListPayload,
  EmployeeChangeProfileRequestListResponse,
  EmployeeChangeProfileRequestTotalResponse,
} from "~/hr-port/features/hr-settings/request-approvals/api/request-approvals.types"

import {
  ApproveOrRejectEmployeeChangeProfilePayload,
  ApproveOrRejectEmployeeChangeProfileResponse,
  GetEmployeeChangeProfileRequestDetailsResponse,
} from "./employee-change-profile-request-approvals.types"

export const getEmployeeChangeProfileRequestList = async (
  payload: EmployeeChangeProfileRequestListPayload
) => {
  const { ...params } = payload
  const { data } =
    await apiPrivate.post<EmployeeChangeProfileRequestListResponse>(
      `/hr/employee/change-data-request/list`,
      {
        ...params,
        status:
          params.status &&
          (Array.isArray(params.status) ? params.status : [params.status]),
        ids:
          params.ids && (Array.isArray(params.ids) ? params.ids : [params.ids]),
      }
    )
  return data
}

export const getEmployeeChangeProfileRequestTotalWA = async () => {
  const { data } =
    await apiPrivate.get<EmployeeChangeProfileRequestTotalResponse>(
      `/hr/employee/change-data-request/count`
    )
  return data
}

export const getEmployeeChangeProfileRequestDetail = async (id: string) => {
  const { data } =
    await apiPrivate.get<GetEmployeeChangeProfileRequestDetailsResponse>(
      `/hr/employee/change-data-request/detail/${id}`
    )
  return data.data
}

export const approveOrRejectEmployeeChangeProfileRequest = async (
  payload: ApproveOrRejectEmployeeChangeProfilePayload
) => {
  const { data } =
    await apiPrivate.put<ApproveOrRejectEmployeeChangeProfileResponse>(
      "/hr/employee/change-data-request/approve",
      payload
    )
  return data
}
