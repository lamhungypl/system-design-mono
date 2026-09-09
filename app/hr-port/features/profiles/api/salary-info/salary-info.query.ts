import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query"

import { QueryKey } from "~/hr-port/constants"
import {
  getSalaryInfoData,
  updateSalaryInfo,
} from "~/hr-port/features/profiles/api/salary-info/salary-info.api"
import {
  GetSalaryInfoDataResult,
  updateSalaryInfoPayload,
  updateSalaryInfoResponse,
} from "~/hr-port/features/profiles/api/salary-info/salary-info.types"
import { QueryOptions } from "~/hr-port/types/react-query"

export function useSalaryInfoDataQuery(
  employeeId: string | number,
  options?: QueryOptions<GetSalaryInfoDataResult>
) {
  return useQuery({
    queryKey: [QueryKey.SALARY_INFO, employeeId],
    queryFn: () => getSalaryInfoData(employeeId),
    ...options,
  })
}

export const useSalaryInfoMutation = (
  options?: Partial<
    UseMutationOptions<updateSalaryInfoResponse, any, updateSalaryInfoPayload>
  >
) => {
  return useMutation({
    ...options,
    mutationKey: [QueryKey.SALARY_INFO],
    mutationFn: updateSalaryInfo,
    meta: {
      ...options?.meta,
      invalidates: [[QueryKey.SALARY_INFO]],
    },
  })
}
