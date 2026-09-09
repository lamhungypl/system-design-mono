import { useQuery } from "@tanstack/react-query"

import { QueryKey } from "~/hr-port/constants"
import { QueryOptions } from "~/hr-port/types/react-query"

import { calculateDeduction, getOptions } from "./options.api"
import { CalculateDeductionResult, GetOptionsResult } from "./options.types"

export function useOptionsQuery(
  params: { search_key?: string; service_path: string },
  options?: QueryOptions<GetOptionsResult>
) {
  const query = useQuery({
    queryKey: [QueryKey.OPTIONS, params.service_path, params.search_key],
    queryFn: () => getOptions(params),
    ...options,
  })

  return query
}

export function useCalculateDeduction(
  params: { deduction_service: string; payload?: object },
  options?: QueryOptions<CalculateDeductionResult>
) {
  const query = useQuery({
    queryKey: [QueryKey.OPTIONS, params.deduction_service, params.payload],
    queryFn: () => calculateDeduction(params),
    ...options,
  })

  return query
}
