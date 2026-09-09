import { apiPrivate } from "~/hr-port/config/axios"
import { isData } from "~/hr-port/utils/object"

import {
  GetAccessPayroll,
  GetAccessPayrollResponse,
  GetReportInfo,
  GetReportInfoMovement,
  GetReportPayroll,
  GetReportPayrollResponse,
  PermissionType,
} from "./access-payroll.types"

export const getAccessPayroll: GetAccessPayroll = async () => {
  try {
    const { data } = await apiPrivate.get<GetAccessPayrollResponse>(
      "/admin/account/access-payroll"
    )
    return data.data
  } catch (err: any) {
    if (err?.response?.data?.metadatas)
      return {
        errors: err.response.data.metadatas,
      }
    return null
  }
}

export const getReportPayroll: GetReportPayroll = async (permissionType) => {
  try {
    const { data } = await apiPrivate.get<GetReportPayrollResponse>(
      "/admin/account/report-payroll",
      {
        params: { permissionType },
      }
    )
    return data.data
  } catch (err: any) {
    if (err?.response?.data?.metadatas)
      return {
        errors: err.response.data.metadatas,
      }
    return null
  }
}

export const getReportInfo: GetReportInfo = async () => {
  try {
    const [verify_payroll, approve_payroll, salary_movement_approve] =
      await Promise.all([
        getReportPayroll(PermissionType.VERIFY_PAYROLL_IN_PROGRESS),
        getReportPayroll(PermissionType.APPROVE_PAYROLL_IN_PROGRESS),
        getReportPayroll(PermissionType.APPROVE_SALARY_MOVEMENT),
      ])
    return {
      verify_payroll: isData(verify_payroll)
        ? verify_payroll.map(({ key }) => key.toString())
        : [],
      approve_payroll: isData(approve_payroll)
        ? approve_payroll.map(({ key }) => key.toString())
        : [],
      salary_movement_approve: isData(salary_movement_approve)
        ? salary_movement_approve.map(({ key }) => key.toString())
        : [],
    }
  } catch {
    return {
      verify_payroll: [],
      approve_payroll: [],
      salary_movement_approve: [],
    }
  }
}

export const getReportInfoMovement: GetReportInfoMovement = async () => {
  try {
    const salary_movement_approve = await getReportPayroll(
      PermissionType.APPROVE_SALARY_MOVEMENT
    )
    return {
      salary_movement_approve: isData(salary_movement_approve)
        ? salary_movement_approve.map(({ key, name }) => ({ key, name }))
        : [],
    }
  } catch {
    return {
      salary_movement_approve: [],
    }
  }
}
