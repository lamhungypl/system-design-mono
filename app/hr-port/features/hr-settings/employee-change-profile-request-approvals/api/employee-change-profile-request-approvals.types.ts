import { PendingEmployeeSalaryInfo } from "~/hr-port/features/profiles/api/employee-profile/employee-profile.types"
import { EmployeeProfileData } from "~/hr-port/features/profiles/types/profile-data"
import { ApiResponse } from "~/hr-port/types/common"

export type GetEmployeeChangeProfileRequestDetailsResponse = ApiResponse<{
  new_data: EmployeeChangeProfileData
  old_data: EmployeeChangeProfileData
}>

export type EmployeeChangeProfileData = {
  employee_info: EmployeeProfileData | null
  salary_info: PendingEmployeeSalaryInfo | null
}

export type ApproveOrRejectEmployeeChangeProfileItem = {
  id: string
  last_modified_at: string
}

export type ApproveOrRejectEmployeeChangeProfilePayload = {
  is_approved: boolean
  items: ApproveOrRejectEmployeeChangeProfileItem[]
}

export type ApproveOrRejectEmployeeChangeProfileResponse = {}
