import {
  PageParams,
  ResponseList,
} from "~/hr-port/features/common/data-access/types"
import { ApiResponse } from "~/hr-port/types/common"

export enum REQUEST_APPROVAL_STATUS {
  APPROVED = "APPROVED",
  /**
   * NOTE: According document, the value should be awaiting_approval,
   *  but let it be this for now because of the backend BE don't have effort to change it
   */
  AWAITING_APPROVAL = "WAITING_APPROVAL",
  REJECTED = "REJECTED",
}

export enum REQUEST_APPROVAL_SEARCH_BY {
  APPROVER = "APPROVER",
  EMPLOYEE = "EMPLOYEE",
}

export type SalaryMovementRequestItem = {
  approved_at: string
  approved_by: string
  approver: string
  created_at: string
  created_by: string
  effective_date: string
  employee_code: string
  employee_id: number
  employee_name: string
  id: string
  last_modified_at: string
  note: string
  remark: string
  salary: number
  salary_prev: number
  status: REQUEST_APPROVAL_STATUS
  updated_at: string
}

export type EmployeeProfileChangeRequestItem = {
  approvers: string[]
  change_data: string
  code: string
  created_at: string
  id: string
  last_modified_at: string
  modified_at: string
  modified_by: string
  name: string
  status: REQUEST_APPROVAL_STATUS
}

export type SalaryMovementRequestListPayload = {
  ids: string[]
  search_by: REQUEST_APPROVAL_SEARCH_BY
  status: REQUEST_APPROVAL_STATUS[]
} & Partial<PageParams>
export type SalaryMovementRequestListResponse =
  ResponseList<SalaryMovementRequestItem>

export type EmployeeChangeProfileRequestListPayload = {
  ids: string[]
  status: REQUEST_APPROVAL_STATUS[]
} & Partial<PageParams>

export type EmployeeChangeProfileRequestListResponse =
  ResponseList<EmployeeProfileChangeRequestItem>
export type EmployeeChangeProfileRequestTotalResponse = ApiResponse<{
  total: number
}>

export type SalaryMovementRequestTotalPayload = void // no payload
export type SalaryMovementRequestTotalResponse = ApiResponse<{
  total: number
}>
