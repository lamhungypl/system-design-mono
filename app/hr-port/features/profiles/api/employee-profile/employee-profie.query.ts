import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useTranslation } from "react-i18next"

import { QueryKey } from "~/hr-port/constants"
import {
  GetAvatarEmployeePayload,
  GetChangeRequestPayload,
  GetPendingEmployeeDataPayload,
  UpdatePendingEmployeeProfilePayload,
} from "~/hr-port/features/profiles/api/employee-profile/employee-profile.types"
import {
  employeeProfileKeys,
  employeeProfileQueryOptions,
  GetApproverListQueryOptions,
  GetAvatarEmployeeQueryOptions,
  GetChangeRequestQueryOptions,
  GetPendingEmployeeDataQueryOptions,
  UpdateEmailApplyLanguageMutationOptions,
} from "~/hr-port/features/profiles/api/employee-profile/query-key-factories"
import { toast } from "~/hr-port/hooks/lib/use-toast"
import { ApiResponse } from "~/hr-port/types/common"
import { QueryOptions } from "~/hr-port/types/react-query"

import {
  EmployeeProfileData,
  GetEmployeeDataPayload,
  UpdateEmployeeProfilePayload,
  UpdateEmployeeProfileResponse,
} from "../../types/profile-data"
import { ProfileStructure } from "../../types/profile-structure"
import {
  getEmployeeData,
  getEmployeeProfileStructure,
  updateEmailApplyLanguage,
  updateEmployeeProfile,
  updatePendingEmployeeProfile,
} from "./employee-profile.api"

export function useEmployeeProfileQuery(
  options?: QueryOptions<ProfileStructure>
) {
  const query = useQuery({
    queryKey: [QueryKey.EMPLOYEE_PROFILE_STRUCTURE],
    queryFn: () => getEmployeeProfileStructure(),
    ...options,
  })

  return query
}

export function useEmployeeProfileDataQuery(
  payload: GetEmployeeDataPayload,
  options?: QueryOptions<EmployeeProfileData>
) {
  const query = useQuery({
    queryKey: [QueryKey.EMPLOYEE_PROFILE_DATA, payload],
    queryFn: () => getEmployeeData(payload),
    ...options,
    meta: { disableToast: true },
  })
  return query
}

export const useUpdateEmployeeProfileMutation = (
  options?: Partial<
    UseMutationOptions<
      UpdateEmployeeProfileResponse,
      any,
      UpdateEmployeeProfilePayload
    >
  >
) => {
  const { t } = useTranslation()
  const query = useMutation({
    ...options,
    mutationFn: updateEmployeeProfile,
    mutationKey: employeeProfileKeys.updateEmployeeProfile,
    onError: (axiosError: AxiosError) => {
      try {
        const error = axiosError.response?.data as ApiResponse
        const metadatas = error.metadatas ?? []
        const errorKey: string = metadatas[0].message
        let i18n_key = `common.toast_messages.${errorKey}`
        if (errorKey === "error.exclusive.employee_profile.invalid")
          i18n_key = "common.toast_messages.error.exclusive"
        if (t(i18n_key) === i18n_key) throw new Error("invalid_i18n_key")
        toast({
          variant: "destructive",
          title: t("common.toast_messages.error.title"),
          description: t(i18n_key),
        })
      } catch (err) {
        console.log("err", err)
        toast({
          variant: "destructive",
          title: t("common.toast_messages.error.title"),
          description: t("common.toast_messages.error.system"),
        })
      }
    },
    meta: {
      ...options?.meta,
      invalidates: [[QueryKey.EMPLOYEE_PROFILE_DATA], [QueryKey.EMPLOYEE_LIST]],
      successMessage: t("common.toast_messages.success.changed"),
    },
  })

  return query
}

export const useGetAvatarEmployeeQuery = (
  payload: GetAvatarEmployeePayload,
  options?: GetAvatarEmployeeQueryOptions
) => {
  return useQuery(
    employeeProfileQueryOptions.getAvatarEmployee(payload, options)
  )
}

export const useGetChangeRequestQuery = (
  payload: GetChangeRequestPayload,
  options?: GetChangeRequestQueryOptions
) => {
  return useQuery(
    employeeProfileQueryOptions.getChangeRequest(payload, options)
  )
}

export const useGetPendingEmployeeDataQuery = (
  payload: GetPendingEmployeeDataPayload,
  options?: GetPendingEmployeeDataQueryOptions
) => {
  return useQuery(
    employeeProfileQueryOptions.getPendingEmployeeData(payload, options)
  )
}

export const useGetApproverListQuery = (
  options?: GetApproverListQueryOptions
) => {
  return useQuery(employeeProfileQueryOptions.getApproverList(options))
}

export const useUpdatePendingEmployeeProfileMutation = (
  options?: {
    onErrorApproverNoPermission?: () => void
  } & Partial<
    UseMutationOptions<unknown, any, UpdatePendingEmployeeProfilePayload>
  >
) => {
  const { t } = useTranslation()
  const query = useMutation({
    ...options,
    mutationFn: updatePendingEmployeeProfile,
    mutationKey: employeeProfileKeys.updatePendingEmployeeProfile,
    meta: {
      ...options?.meta,
      invalidates: [
        employeeProfileKeys.getChangeRequest(),
        employeeProfileKeys.getPendingEmployeeData(),
        [QueryKey.EMPLOYEE_PROFILE_DATA],
        [QueryKey.SALARY_INFO],
      ],
      successMessage: t("common.toast_messages.success.send"),
    },
    onError: (axiosError: AxiosError) => {
      try {
        const error = axiosError.response?.data as ApiResponse
        const metadatas = error.metadatas ?? []
        const errorKey: string = metadatas[0].message
        let i18n_key = `common.toast_messages.${errorKey}`
        if (errorKey === "error.employee.no_change_data")
          i18n_key = "common.toast_messages.error.no_change_data"
        else if (errorKey === "error.exclusive.employee_change_profile.invalid")
          i18n_key =
            "common.toast_messages.error.exclusive_employee_change_profile"
        else if (errorKey === "error.employee.choice_approver_no_permission") {
          i18n_key = "common.toast_messages.error.choice_approver_no_permission"
          options?.onErrorApproverNoPermission?.()
        }
        if (t(i18n_key) === i18n_key) throw new Error("invalid_i18n_key")
        toast({
          variant: "destructive",
          title: t("common.toast_messages.error.title"),
          description: t(i18n_key),
        })
      } catch (err) {
        console.log("err", err)
        toast({
          variant: "destructive",
          title: t("common.toast_messages.error.title"),
          description: t("common.toast_messages.error.system"),
        })
      }
    },
  })

  return query
}

export const useUpdateEmailApplyLanguageMutation = (
  options?: UpdateEmailApplyLanguageMutationOptions
) => {
  const { t } = useTranslation()
  return useMutation({
    ...options,
    mutationFn: updateEmailApplyLanguage,
    mutationKey: employeeProfileKeys.updateEmailApplyLanguage(),
    meta: {
      ...options?.meta,
      invalidates: [[QueryKey.EMPLOYEE_PROFILE_DATA]],
      successMessage: t("common.toast_messages.success.changed"),
    },
  })
}
