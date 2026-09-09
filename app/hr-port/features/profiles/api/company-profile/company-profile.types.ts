import { UploadDocsPayload } from "~/hr-port/features/documents/api/documents.types"
import { ApiResponse, ApiResult } from "~/hr-port/types/common"

export type PostSyncCompany = () => Promise<PostSyncCompanyResult>

export type PostSyncCompanyResult = ApiResult<boolean>

export type PostSyncCompanyResponse = ApiResponse<string>

export type CompanyUploadDocsPayload = {
  field_id?: string
} & UploadDocsPayload

export type CompanyUploadDocsResponse = unknown
