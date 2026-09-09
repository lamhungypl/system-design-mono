import { ApiResponse, ApiResult } from "~/hr-port/types/common"

export type GetSalaryInfoData = (
  employeeId: string | number
) => Promise<GetSalaryInfoDataResult>

export type GetSalaryInfoDataResult = ApiResult<salaryResponse>

export type GetSalaryInfoDataResponse = ApiResponse<salaryResponse>

export type salaryResponse = {
  salary_history: SalaryHistory[]
  salary_info: SalaryInfo
}
export type SalaryInfo = {
  bank_account_info: BankAccount
  bank_no: string | null
  employment_type: string
  last_modified_at: string
  payment_method: string
  request_change_salary_id: number
  rounding_type: string
  salary: number
  salary_id: number
  salary_type: number
}

export type BankAccount = {
  key: number
  name: string
}

export type SalaryHistory = {
  approve_by: string
  current_salary: number
  effective_date: string
  modify_by: string
  previous_salary: number
  salary_change_percent: number
  time: string
}

export type updateSalaryInfoPayload = { bank_account: string | null } & Omit<
  SalaryInfo,
  | "bank_account_info"
  | "employment_type"
  | "request_change_salary_id"
  | "is_show_salary"
  | "rounding_type"
  | "salary_type"
>
export type updateSalaryInfoResponse = unknown
