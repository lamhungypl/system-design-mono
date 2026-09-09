import { ApiResponse, ApiResult } from "~/hr-port/types/common"

// Request types
export interface ProcessSalaryItem {
  effective_date: string
  remark: string
  request_change_salary_id: number
}

export interface ProcessSalaryPayload {
  approved: boolean
  process_salaries: ProcessSalaryItem[]
}

// Response types
export interface RequestSalary {
  current_salary: string | number
  effective_date?: string
  new_salary: string | number
  remark?: string
  request_change_salary_id?: number
}

export type GetRequestChangeSalaryInfoData = (
  employeeId: string | number
) => Promise<GetRequestChangeSalaryResult>

export type GetRequestChangeSalaryResult = ApiResult<RequestSalary>

export type GetRequestChangeSalaryInfoResponse = ApiResponse<RequestSalary>

// Process salary response
export type ProcessSalaryResponse = ApiResponse<{
  message?: string
  params?: [
    {
      actionSuccess: number
      totalAction: number
    },
  ]
  success: boolean
}>

export type EditSalaryMovementRemarkPayload = {
  id: string
  last_modified_at: string
  remark: string
}

export type EditSalaryMovementRemarkResponse = ApiResponse<unknown>
