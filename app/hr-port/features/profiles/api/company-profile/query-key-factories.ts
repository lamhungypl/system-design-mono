import {
  DefaultError,
  keepPreviousData,
  queryOptions,
  UseQueryOptions,
} from "@tanstack/react-query"

import { QueryKey } from "~/hr-port/constants"
import { getCompanyData } from "~/hr-port/features/profiles/api/company-profile/company-profile.api"
import { GetCompanyProfileDataResult } from "~/hr-port/features/profiles/types/profile-data"

export const profileKeys = {
  all: ["profile"] as const,
  getData: () => [...profileKeys.all, QueryKey.COMPANY_PROFILE_DATA] as const,
}

export type ProfileQueryOptions = Partial<
  UseQueryOptions<
    Promise<GetCompanyProfileDataResult>,
    DefaultError,
    GetCompanyProfileDataResult,
    ReturnType<typeof profileKeys.getData>
  >
>

export const profileQueryOptions = {
  getData: (options?: ProfileQueryOptions) => {
    return queryOptions({
      queryKey: profileKeys.getData(),
      queryFn: () => getCompanyData(),
      placeholderData: keepPreviousData,
      ...options,
    })
  },
}
