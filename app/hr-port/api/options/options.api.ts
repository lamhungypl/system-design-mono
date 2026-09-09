import { apiPrivate } from "~/hr-port/config/axios"
import { getSelectOptions } from "~/hr-port/utils/object"

import {
  CalculateDeduction,
  CalculateDeductionResponse,
  GetOptions,
  GetOptionsResponse,
} from "./options.types"

export const getOptions: GetOptions = async ({ service_path, search_key }) => {
  try {
    const { data } = await apiPrivate.get<GetOptionsResponse>(
      `${service_path}${search_key ?? ""}`
    )
    const rawOptions = data.data

    return getSelectOptions({
      data: rawOptions,
      labelAccessor: "name",
      valueAccessor: "key",
    })
  } catch (err: any) {
    if (err?.response?.data?.metadatas)
      return {
        errors: err.response.data.metadatas,
      }
    return null
  }
}

export const calculateDeduction: CalculateDeduction = async ({
  deduction_service,
  payload,
}) => {
  if (!deduction_service) return null
  try {
    const { data } = await apiPrivate<CalculateDeductionResponse>({
      method: payload ? "post" : "get",
      url: deduction_service,
      data: payload,
    })

    return data.data
  } catch (err: any) {
    if (err?.response?.data?.metadatas)
      return {
        errors: err.response.data.metadatas,
      }
    return null
  }
}
