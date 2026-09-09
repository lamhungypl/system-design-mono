import { useQuery } from "@tanstack/react-query"

import { regionSettingQueriesOptions } from "./query-keys-factories"

export function useRegionSettingQuery() {
  return useQuery(regionSettingQueriesOptions.details())
}
