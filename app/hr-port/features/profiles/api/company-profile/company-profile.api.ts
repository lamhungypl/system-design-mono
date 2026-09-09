import { AxiosRequestConfig } from "axios"

import { apiPrivate } from "~/hr-port/config/axios"
import { FILE_FOLDER, FILE_LEVEL } from "~/hr-port/features/documents/constants"
import { formatProfile } from "~/hr-port/features/dynamic-form/utils/extract-profile"
import { AtLeast } from "~/hr-port/types/common"

import {
  GetCompanyBranchResponse,
  GetCompanyData,
  GetCompanyProfileDataResponse,
  UpdateCompanyProfilePayload,
  UpdateCompanyProfileResponse,
} from "../../types/profile-data"
import {
  GetCompanyStructure,
  GetStructureResponse,
} from "../../types/profile-structure"
import {
  CompanyUploadDocsPayload,
  CompanyUploadDocsResponse,
  PostSyncCompany,
  PostSyncCompanyResponse,
} from "./company-profile.types"

export const updateCompanyProfile = (payload: UpdateCompanyProfilePayload) => {
  return apiPrivate.post<UpdateCompanyProfileResponse>(
    "/hr/company/profile/save",
    payload
  )
}

export const getCompanyStructure: GetCompanyStructure = async () => {
  try {
    const { data } = await apiPrivate.get<GetStructureResponse>(
      "/hr/company/profile/get-structure"
    )
    const profile = data.data
    formatProfile(profile)
    return profile
  } catch (err: any) {
    if (err?.response?.data?.metadatas)
      return {
        errors: err.response.data.metadatas,
      }
    return null
  }
}

export const getCompanyData: GetCompanyData = async () => {
  try {
    const { data } = await apiPrivate.get<GetCompanyProfileDataResponse>(
      "/hr/company/profile/get-data"
    )
    return data.data
  } catch (err: any) {
    if (err?.response?.data?.metadatas)
      return {
        errors: err.response.data.metadatas,
      }
    return null
  }
}

export const syncCompany: PostSyncCompany = async () => {
  try {
    const { data } = await apiPrivate.post<PostSyncCompanyResponse>(
      "/synchronize-data/company"
    )
    return data.data === "OK"
  } catch (err: any) {
    if (err?.response?.data?.metadatas)
      return {
        errors: err.response.data.metadatas,
      }
    return null
  }
}

export const getCompanyBranchListAll = async () => {
  try {
    const { data } = await apiPrivate.get<GetCompanyBranchResponse>(
      "/hr/company/branch/list"
    )
    return data.data
  } catch (err: any) {
    if (err?.response?.data?.metadatas)
      return {
        errors: err.response.data.metadatas,
      }
    return null
  }
}

export const companyUploadDocument = async (
  payload: AtLeast<CompanyUploadDocsPayload, "field_id" | "file">,
  config?: AxiosRequestConfig
) => {
  return await apiPrivate.postForm<CompanyUploadDocsResponse>(
    `/master/file/upload`,
    {
      ...payload,
      level: FILE_LEVEL.COMPANY,
      folder: FILE_FOLDER.FILE,
    } satisfies CompanyUploadDocsPayload,
    config
  )
}
