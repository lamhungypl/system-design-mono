import { queryOptions } from "@tanstack/react-query"

import { QueryKey } from "~/hr-port/constants"

import { getRegionSetting } from "./region-setting.api"

export const regionSettingQueriesOptions = {
  details: () => {
    return queryOptions({
      queryKey: [QueryKey.REGION_SETTING],
      queryFn: () => getRegionSetting(),
      staleTime: Infinity,
      meta: {
        disableToast: true,
      },
    })
  },
}
