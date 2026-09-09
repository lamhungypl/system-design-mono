import { ResponseListAll } from "~/hr-port/features/common/data-access/types"
import { UploadDocsPayload } from "~/hr-port/features/documents/api/documents.types"
import {
  ApiResponse,
  ApiResult,
  SelectOption,
  SortParams,
} from "~/hr-port/types/common"

export type GetEmployeeListParams = {
  department?: string
  duration_of_employment?: string
  employment_type?: string
  key_search?: string
  page?: number | string
  position?: string
  size?: number | string
  sort?: SortParams
  status?: string
}

export type GetEmployeeList = (
  params?: GetEmployeeListParams
) => Promise<GetEmployeeListResult>

export type GetEmployeeListResult = ApiResult<{
  content: EmployeeItem[]
  empty: boolean
  has_next: boolean
  has_previous: boolean
  page: number
  size: number
  total_elements: number
  total_pages: number
}>

export type GetEmployeeListResponse = ApiResponse<{
  content: EmployeeItem[]
  empty: boolean
  has_next: boolean
  has_previous: boolean
  page: number
  size: number
  total_elements: number
  total_pages: number
}>

export type EmployeeItem = {
  code: string
  department: string
  employment_type: string
  id: number
  name: string
  position: string
  start_work_date: string
  status: string | null
}

export type ReportEmployeeListAllPayload = {
  branch_code?: string[]
  department_id?: string[]
  document: string
  periods?: Array<{ end_date: string; start_date: string }>
  year: number
}
export type ReportEmployeeListAllResponse = ResponseListAll<EmployeeItem>

export enum EmployeeStatus {
  PERMANENT = "3",
  PROBATION = "2",
  RESIGNED = "4",
  START_SOON = "1",
}

export type GetEmploymentFilterOptions = (
  url: string
) => Promise<GetEmploymentFilterOptionsResult>

export type GetEmploymentFilterOptionsResult = ApiResult<SelectOption[]>

export type GetEmploymentFilterOptionsResponse = ApiResponse<
  EmploymentFilterOption[]
>

export type EmploymentFilterOption = {
  label_key: string
  name: string
  value: string
}

export type SyncEmployeePayload = { id: string; params?: Record<string, any> }

export type SyncEmployeeRepsonse = ApiResponse<string>

export type EmployeeUploadDocsPayload = {
  employee_id?: string
  field_id?: string
} & UploadDocsPayload

export type EmployeeUploadDocsResponse = unknown
