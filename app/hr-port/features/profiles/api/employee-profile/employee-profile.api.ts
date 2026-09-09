import { apiPrivate } from "~/hr-port/config/axios"
import { formatProfile } from "~/hr-port/features/dynamic-form/utils/extract-profile"
import {
  GetApproverListResponse,
  GetAvatarEmployeePayload,
  GetAvatarEmployeeResponse,
  GetChangeRequestPayload,
  GetChangeRequestResponse,
  GetPendingEmployeeDataPayload as GetPendingEmployeeDataPayload,
  GetPendingEmployeeDataResponse as GetPendingEmployeeDataResponse,
  UpdateEmailApplyLanguagePayload,
  UpdatePendingEmployeeProfilePayload,
} from "~/hr-port/features/profiles/api/employee-profile/employee-profile.types"

import {
  GetEmployeeDataPayload,
  GetEmployeeProfileDataResponse,
  UpdateEmployeeProfilePayload,
  UpdateEmployeeProfileResponse,
} from "../../types/profile-data"
import { GetStructureResponse } from "../../types/profile-structure"

export const getEmployeeProfileStructure = async () => {
  const { data } = await apiPrivate.get<GetStructureResponse>(
    "/hr/employee/profile/get-structure"
  )
  const profile = data.data
  formatProfile(profile)
  return profile
}

export const getEmployeeData = async ({ id }: GetEmployeeDataPayload) => {
  const { data } = await apiPrivate.get<GetEmployeeProfileDataResponse>(
    `/hr/employee/profile/get-data?employee_id=${id}`
  )
  return data.data
}

export const updateEmployeeProfile = (
  payload: UpdateEmployeeProfilePayload
) => {
  return apiPrivate.post<UpdateEmployeeProfileResponse>(
    "hr/employee/profile/save",
    payload
  )
}

export const getAvatarEmployee = async (payload: GetAvatarEmployeePayload) => {
  const response = await apiPrivate.get<GetAvatarEmployeeResponse>(
    "/master/employee/profile/get-avatar",
    {
      params: payload,
    }
  )
  return response.data
}

export const getChangeRequest = async (payload: GetChangeRequestPayload) => {
  const response = await apiPrivate.get<GetChangeRequestResponse>(
    "/hr/employee/profile/get-change-request",
    { params: payload }
  )
  return response.data
}

export const getPendingEmployeeData = async (
  payload: GetPendingEmployeeDataPayload
) => {
  const response = await apiPrivate.get<GetPendingEmployeeDataResponse>(
    "/hr/employee/profile/get-change-data",
    { params: payload }
  )
  return response.data.data
}

export const getApproverList = async () => {
  const response = await apiPrivate.get<GetApproverListResponse>(
    "/hr/employee/profile/get-approver"
  )
  return response.data
}

export const updatePendingEmployeeProfile = async (
  payload: UpdatePendingEmployeeProfilePayload
) => {
  return apiPrivate.post("hr/employee/profile/save-change-data", payload)
}

export const updateEmailApplyLanguage = async (
  payload: UpdateEmailApplyLanguagePayload
) => {
  return apiPrivate.post("hr/employee/email-apply-language/update", payload)
}
