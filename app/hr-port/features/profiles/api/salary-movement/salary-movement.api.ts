import { apiPrivate } from "~/hr-port/config/axios"

import {
  EditSalaryMovementRemarkPayload,
  EditSalaryMovementRemarkResponse,
  GetRequestChangeSalaryInfoData,
  GetRequestChangeSalaryInfoResponse,
  ProcessSalaryPayload,
  ProcessSalaryResponse,
} from "./salary-movement.types"

export const getRequestChangeSalaryInfo: GetRequestChangeSalaryInfoData =
  async (requestChangeSalaryId: string | number) => {
    try {
      const { data } = await apiPrivate.get<GetRequestChangeSalaryInfoResponse>(
        `/hr/employee/profile/get-request-change-salary/${requestChangeSalaryId}`
      )

      return data.data
    } catch (err: any) {
      if (err?.response?.data?.metadatas)
        return {
          errors: err.response.data.metadatas,
        }

      return null
    }
  }

export const processSalaryMovement = async (payload: ProcessSalaryPayload) => {
  const { data } = await apiPrivate.put<ProcessSalaryResponse>(
    "/hr/employee/profile/process-salary",
    payload
  )

  return data
}

export const editSalaryMovementRemark = async (
  payload: EditSalaryMovementRemarkPayload
) => {
  const { data } = await apiPrivate.post<EditSalaryMovementRemarkResponse>(
    "/hr/employee/salary-movement/update-remark",
    payload
  )

  return data
}
