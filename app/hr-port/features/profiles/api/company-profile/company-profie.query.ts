import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

import { QueryKey } from "~/hr-port/constants"
import {
  profileKeys,
  ProfileQueryOptions,
  profileQueryOptions,
} from "~/hr-port/features/profiles/api/company-profile/query-key-factories"
import { QueryOptions } from "~/hr-port/types/react-query"

import {
  GetCompanyBranchResult,
  UpdateCompanyProfilePayload,
  UpdateCompanyProfileResponse,
} from "../../types/profile-data"
import { GetStructureResult } from "../../types/profile-structure"
import {
  getCompanyBranchListAll,
  getCompanyStructure,
  syncCompany,
  updateCompanyProfile,
} from "./company-profile.api"

export function useCompanyProfileQuery(
  options?: QueryOptions<GetStructureResult>
) {
  const query = useQuery({
    queryKey: [QueryKey.COMPANY_PROFILE],
    queryFn: () => getCompanyStructure(),
    ...options,
  })

  return query
}

export function useCompanyProfileDataQuery(options?: ProfileQueryOptions) {
  return useQuery(profileQueryOptions.getData(options))
}

export const useCompanyProfileMutation = (
  options?: Partial<
    UseMutationOptions<
      UpdateCompanyProfileResponse,
      any,
      UpdateCompanyProfilePayload
    >
  >
) => {
  const { t } = useTranslation()
  const query = useMutation({
    ...options,
    mutationFn: updateCompanyProfile,
    meta: {
      ...options?.meta,
      invalidates: [
        [QueryKey.COMPANY_PROFILE_DATA],
        [QueryKey.REPORT_INFO],
        profileKeys.getData(),
      ],
      successMessage: t("common.toast_messages.success.changed"),
    },
  })

  return query
}

export function useSyncCompanyMutation(
  options?: Partial<UseMutationOptions<unknown, any, void>>
) {
  const mutation = useMutation({
    mutationFn: () => syncCompany(),
    ...options,
    meta: {
      invalidates: [
        [QueryKey.COMPANY_PROFILE_DATA],
        [QueryKey.REPORT_INFO],
        profileKeys.getData(),
      ],
      ...options?.meta,
    },
  })

  return mutation
}

export function useCompanyBranchListAllQuery(
  options?: QueryOptions<GetCompanyBranchResult>
) {
  return useQuery({
    queryKey: [QueryKey.COMPANY_BRANCH],
    queryFn: () => getCompanyBranchListAll(),
    ...options,
  })
}
