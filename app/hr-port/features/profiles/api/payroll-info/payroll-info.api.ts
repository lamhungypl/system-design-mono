import { apiPrivate } from "~/hr-port/config/axios"

import {
  GetListPayrollPeriodData,
  GetListPayrollPeriodDataResponse,
} from "./payroll-info.types"

export const getListPayrollPeriod: GetListPayrollPeriodData = async (
  employeeId
) => {
  try {
    const { data } = await apiPrivate.get<GetListPayrollPeriodDataResponse>(
      `/payroll/calculation/payroll-period/list/${employeeId}`
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
