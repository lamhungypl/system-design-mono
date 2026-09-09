import { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query"

import {
  getApproverList,
  getAvatarEmployee,
  getChangeRequest,
  getPendingEmployeeData as getPendingEmployeeData,
} from "~/hr-port/features/profiles/api/employee-profile/employee-profile.api"
import {
  GetApproverListResponse,
  GetAvatarEmployeePayload,
  GetAvatarEmployeeResponse,
  GetChangeRequestPayload,
  GetChangeRequestResponse,
  GetPendingEmployeeDataPayload as GetPendingEmployeeDataPayload,
  GetPendingEmployeeDataResponse as GetPendingEmployeeDataResponse,
  UpdateEmailApplyLanguagePayload,
} from "~/hr-port/features/profiles/api/employee-profile/employee-profile.types"

export const employeeProfileKeys = {
  all: ["employee-profile"] as const,
  syncEmployee: () => [...employeeProfileKeys.all, "sync-employee"] as const,
  getAvatarEmployee: (payload?: GetAvatarEmployeePayload) =>
    [...employeeProfileKeys.all, "get-avatar-employee", payload].filter(
      (i) => i
    ),
  getChangeRequest: (payload?: GetChangeRequestPayload) =>
    [...employeeProfileKeys.all, "get-change-request", payload].filter(
      (i) => i
    ),
  getPendingEmployeeData: (payload?: GetPendingEmployeeDataPayload) =>
    [
      ...employeeProfileKeys.all,
      "get-pending-employee-profile",
      payload,
    ].filter((i) => i),
  getApproverList: () =>
    [...employeeProfileKeys.all, "get-approver-list"] as const,
  updateEmployeeProfile: ["update-employee-profile"] as const,
  updatePendingEmployeeProfile: ["update-pending-employee-profile"] as const,
  updateEmailApplyLanguage: () => ["update-email-apply-language"] as const,
}

export type GetAvatarEmployeeQueryOptions = Partial<
  UseQueryOptions<
    GetAvatarEmployeeResponse,
    Error,
    GetAvatarEmployeeResponse,
    ReturnType<typeof employeeProfileKeys.getAvatarEmployee>
  >
>
export type GetChangeRequestQueryOptions = Partial<
  UseQueryOptions<
    GetChangeRequestResponse,
    Error,
    GetChangeRequestResponse,
    ReturnType<typeof employeeProfileKeys.getChangeRequest>
  >
>
export type GetPendingEmployeeDataQueryOptions = Partial<
  UseQueryOptions<
    GetPendingEmployeeDataResponse["data"],
    Error,
    GetPendingEmployeeDataResponse["data"],
    ReturnType<typeof employeeProfileKeys.getPendingEmployeeData>
  >
>

export type GetApproverListQueryOptions = Partial<
  UseQueryOptions<
    GetApproverListResponse,
    Error,
    GetApproverListResponse,
    ReturnType<typeof employeeProfileKeys.getApproverList>
  >
>

export type UpdateEmailApplyLanguageMutationOptions = Partial<
  UseMutationOptions<
    unknown,
    Error,
    UpdateEmailApplyLanguagePayload,
    ReturnType<typeof employeeProfileKeys.updateEmailApplyLanguage>
  >
>

export const employeeProfileQueryOptions = {
  getAvatarEmployee: (
    payload: GetAvatarEmployeePayload,
    options?: GetAvatarEmployeeQueryOptions
  ) => ({
    queryKey: employeeProfileKeys.getAvatarEmployee(payload),
    queryFn: () => getAvatarEmployee(payload),
    ...options,
  }),
  getChangeRequest: (
    payload: GetChangeRequestPayload,
    options?: GetChangeRequestQueryOptions
  ) => ({
    queryKey: employeeProfileKeys.getChangeRequest(payload),
    queryFn: () => getChangeRequest(payload),
    ...options,
  }),
  getPendingEmployeeData: (
    payload: GetPendingEmployeeDataPayload,
    options?: GetPendingEmployeeDataQueryOptions
  ) => ({
    queryKey: employeeProfileKeys.getPendingEmployeeData(payload),
    queryFn: () => getPendingEmployeeData(payload),
    ...options,
  }),
  getApproverList: (options?: GetApproverListQueryOptions) => ({
    queryKey: employeeProfileKeys.getApproverList(),
    queryFn: () => getApproverList(),
    ...options,
  }),
}
