import { Roles } from "~/hr-port/constants"
import { ApiResponse } from "~/hr-port/types/common"

import { EmployeeProfileData } from "../../types/profile-data"

export type GetAvatarEmployeePayload = {
  employee_id: string
}
export type GetAvatarEmployeeResponse = ApiResponse<string>

export type GetChangeRequestPayload = {
  employee_id: string | number
}

export type GetChangeRequestResponse = ApiResponse<number | null>

export type GetPendingEmployeeDataPayload = {
  employee_id: string | number
  request_id: string | number
}

export type GetPendingEmployeeDataResponse = ApiResponse<{
  employee_info: EmployeeProfileData
  last_modified_at: string
  request_change_id: number
  salary_info: PendingEmployeeSalaryInfo | null
}>

export type PendingEmployeeSalaryInfo = {
  bank_account_info: {
    icon_file_path: string
    key: string
    name: string
  } | null
  bank_no: string | null
  payment_method: string
}

export type GetApproverListResponse = ApiResponse<Approver[]>

export type Approver = {
  key: number
  name: string
  role_type: Roles
}

export type UpdatePendingEmployeeProfilePayload = {
  approver_ids?: (string | number)[]
  employee_id: string | number
  employee_info: Partial<EmployeeProfileData> | null
  last_modified_at?: string
  request_change_id?: number
  salary_info: {
    bank_account: string | null
    bank_no: string | null
    payment_method: string
  } | null
}

export type UpdateEmailApplyLanguagePayload = {
  field_id: number | string
  language: string
}
