import { useQuery } from "@tanstack/react-query"

import { QueryKey } from "~/hr-port/constants"
import { getBankCategoryData } from "~/hr-port/features/profiles/api/bank-category/bank-category.api"
import { GetBankCategoryDataResult } from "~/hr-port/features/profiles/api/bank-category/bank-category.types"
import { QueryOptions } from "~/hr-port/types/react-query"

export function useBankCategoryDataQuery(
  options?: QueryOptions<GetBankCategoryDataResult>
) {
  return useQuery({
    queryKey: [QueryKey.BANK_CATEGORY],
    queryFn: () => getBankCategoryData(),
    ...options,
  })
}
