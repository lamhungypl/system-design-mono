import { ApiResponse, ApiResult } from "~/hr-port/types/common"

export type GetListPayrollPeriodData = (
  employeeId: string | number
) => Promise<GetListPayrollPeriodDataResult>

export type GetListPayrollPeriodDataResult =
  ApiResult<listPayrollPeriodResponse>

export type GetListPayrollPeriodDataResponse =
  ApiResponse<listPayrollPeriodResponse>

export type listPayrollPeriodResponse = {
  // salary_history: SalaryHistory[];
  // salary_info: SalaryInfo;
}
