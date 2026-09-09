import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { QueryKey } from "~/hr-port/constants"
import { QueryOptions } from "~/hr-port/types/react-query"

import {
  getAccessPayroll,
  getReportInfo,
  getReportInfoMovement,
} from "./access-payroll.api"
import {
  GetAccessPayrollResult,
  GetReportInfoMovementResult,
  GetReportInfoResult,
} from "./access-payroll.types"

export function useAccessPayrollQuery(
  options?: QueryOptions<GetAccessPayrollResult>
) {
  const query = useQuery({
    queryKey: [QueryKey.ACCESS_PAYROLL],
    queryFn: () => getAccessPayroll(),
    ...options,
  })

  return query
}

export function useReportInfoQuery(
  options?: QueryOptions<GetReportInfoResult>
) {
  const query = useQuery({
    queryKey: [QueryKey.REPORT_INFO],
    queryFn: () => getReportInfo(),
    placeholderData: keepPreviousData,
    ...options,
  })

  return query
}

export function useReportInfoMovementQuery(
  options?: QueryOptions<GetReportInfoMovementResult>
) {
  const query = useQuery({
    queryKey: [QueryKey.REPORT_INFO],
    queryFn: () => getReportInfoMovement(),
    ...options,
  })

  return query
}
