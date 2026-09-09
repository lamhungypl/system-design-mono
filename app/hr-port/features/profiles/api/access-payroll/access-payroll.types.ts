import { Roles } from "~/hr-port/constants"
import { Permission } from "~/hr-port/features/permissions/constants"
import { ApiResponse, ApiResult } from "~/hr-port/types/common"

export type GetAccessPayroll = () => Promise<GetAccessPayrollResult>

export type GetAccessPayrollResult = ApiResult<Accountant[]>

export type GetAccessPayrollResponse = ApiResponse<Accountant[]>

export type GetReportPayroll = (
  permissionType?: PermissionType
) => Promise<GetReportPayrollResult>

export type GetReportPayrollResult = ApiResult<Accountant[]>

export type GetReportPayrollResponse = ApiResponse<Accountant[]>

export type GetReportInfo = () => Promise<GetReportInfoResult>
export type GetReportInfoMovement = () => Promise<GetReportInfoMovementResult>

export type GetReportInfoResult = {
  approve_payroll: string[]
  salary_movement_approve: string[]
  verify_payroll: string[]
}

export type Accountant = {
  key: number
  name: string
  permissions: Permission[]
  role_type: Roles
}

export enum PermissionType {
  APPROVE_PAYROLL_IN_PROGRESS = "APPROVE_PAYROLL_IN_PROGRESS",
  APPROVE_SALARY_MOVEMENT = "APPROVE_SALARY_MOVEMENT",
  VERIFY_PAYROLL_IN_PROGRESS = "VERIFY_PAYROLL_IN_PROGRESS",
}

export type GetReportInfoMovementResult = {
  salary_movement_approve: Pick<Accountant, "key" | "name">[]
}
