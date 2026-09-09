import { ResponseListAll } from "~/hr-port/features/common/data-access/types"
import { ApiResponse, ApiResult } from "~/hr-port/types/common"

export type GetCompanyData = () => Promise<GetCompanyProfileDataResult>
export type GetEmployeeDataPayload = { id: string | number }

export type CompanyProfileData = {
  entity_data: EntityData[]
  entity_data_id: number
}
export type GetCompanyProfileDataResult = ApiResult<CompanyProfileData>

export type GetCompanyProfileDataResponse = ApiResponse<CompanyProfileData>

export type EmployeeProfileData = {
  code: string
  company_email: string | null
  department: string | null
  employee_id: number
  entity_data: EntityData[]
  entity_data_id: number
  last_modified_at: string | null
  name: string
  personal_email: string | null
  position: string | null
  work_date: string | null
}
export type GetEmployeeProfileDataResponse = ApiResponse<EmployeeProfileData>

export type FieldDataValue = {
  field_value_id: number | null
  is_deleted?: boolean
  value: any
}
export type FieldData = {
  field_id: number | string
  values: FieldDataValue[]
}

export type EntityData = {
  grid_data: GridData[]
} & FieldData

export type GridData = {
  delete_flg?: boolean
  entity_data_id: number | null
  field_values: FieldData[]
}

export type UpdateCompanyProfilePayload = Partial<CompanyProfileData>
export type UpdateCompanyProfileResponse = unknown

export type UpdateEmployeeProfilePayload = Partial<EmployeeProfileData>
export type UpdateEmployeeProfileResponse = unknown

export type CompanyBranch = {
  code: string
  name: string
}
export type GetCompanyBranchResponse = ResponseListAll<CompanyBranch>
export type GetCompanyBranchResult = ApiResult<CompanyBranch[]>
