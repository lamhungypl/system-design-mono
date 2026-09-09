import { ApiResponse, ApiResult, SelectOption } from "~/hr-port/types/common"

export type GetOptions = (params: {
  search_key?: string
  service_path: string
}) => Promise<GetOptionsResult>

export type GetOptionsResult = ApiResult<SelectOption[]>

export type GetOptionsResponse = ApiResponse<Option[]>

export type Option = {
  id: number
  name: string
}

export type CalculateDeduction = (params: {
  deduction_service: string
  payload?: object
}) => Promise<CalculateDeductionResult>

export type CalculateDeductionResult = ApiResult<CalculateDeductionData>

export type CalculateDeductionResponse = ApiResponse<CalculateDeductionData>

export type CalculateDeductionData = {
  [key: string]: number
  allowance: number
}
