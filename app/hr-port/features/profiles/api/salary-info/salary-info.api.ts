import { apiPrivate } from "~/hr-port/config/axios"
import {
  GetSalaryInfoData,
  GetSalaryInfoDataResponse,
  updateSalaryInfoPayload,
  updateSalaryInfoResponse,
} from "~/hr-port/features/profiles/api/salary-info/salary-info.types"

export const getSalaryInfoData: GetSalaryInfoData = async (employeeId) => {
  try {
    const { data } = await apiPrivate.get<GetSalaryInfoDataResponse>(
      `/hr/employee/profile/get-salary/${employeeId}`
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

export const updateSalaryInfo = (payload: updateSalaryInfoPayload) => {
  return apiPrivate.put<updateSalaryInfoResponse>(
    "/hr/employee/profile/save-salary",
    payload
  )
}
