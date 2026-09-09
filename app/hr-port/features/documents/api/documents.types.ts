import { AxiosRequestConfig } from "axios"

import { FILE_FOLDER, FILE_LEVEL } from "~/hr-port/features/documents/constants"
import { ApiResponse } from "~/hr-port/types/common"

export type DownloadDocsPayload = {
  id: string
}
export type DownloadDocsResponse = Blob

export type UploadDocsPayload = {
  file: File
  folder: FILE_FOLDER | ({} & string)
  level: FILE_LEVEL
}

export type DynamicUploadDocsPayload = {
  config?: AxiosRequestConfig
  data: {
    employee_id?: string
    field_id?: string
  } & UploadDocsPayload
}

export type UploadDocsResponse = {
  file_name: string
  file_path: string
  id: number | null
}
export type DynamicUploadDocsResponse = ApiResponse<UploadDocsResponse>

export type PreviewDocumentPayload = {
  id: string | number
}

export type PreviewDocumentResponse = ApiResponse<string>
