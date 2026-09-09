import { apiPrivate } from "~/hr-port/config/axios"
import {
  SalaryMovementRequestListPayload,
  SalaryMovementRequestListResponse,
  SalaryMovementRequestTotalResponse,
} from "~/hr-port/features/hr-settings/request-approvals/api/request-approvals.types"

export const getSalaryMovementRequestList = async (
  payload: SalaryMovementRequestListPayload
) => {
  const { ...params } = payload
  const { data } = await apiPrivate.get<SalaryMovementRequestListResponse>(
    `/hr/employee/salary-movement/list`,
    {
      params,
    }
  )
  return data
}

export const getSalaryMovementRequestTotal = async () => {
  const { data } = await apiPrivate.get<SalaryMovementRequestTotalResponse>(
    `/hr/employee/salary-movement/total`
  )
  return data
}
