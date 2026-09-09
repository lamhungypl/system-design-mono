import { apiPrivate } from "~/hr-port/config/axios"
import {
  DownloadDocsPayload,
  DownloadDocsResponse,
  DynamicUploadDocsPayload,
  DynamicUploadDocsResponse,
  PreviewDocumentPayload,
  PreviewDocumentResponse,
  UploadDocsPayload,
} from "~/hr-port/features/documents/api/documents.types"

export const downloadDocument = async (payload: DownloadDocsPayload) => {
  const { data } = await apiPrivate.get<DownloadDocsResponse>(
    "/master/file/download",
    {
      params: payload,
      responseType: "blob",
    }
  )
  return data
}

export const uploadDocument = async (payload: UploadDocsPayload) => {
  const { data } = await apiPrivate.postForm(`/master/file/upload`, payload)
  return data as DynamicUploadDocsResponse
}

export const dynamicUploadDocument = async (
  payload: DynamicUploadDocsPayload
) => {
  const { data, config } = payload
  const res = await apiPrivate.postForm(`/master/file/upload`, data, config)
  return res.data as DynamicUploadDocsResponse
}

export const previewDocument = async (payload: PreviewDocumentPayload) => {
  const { data } = await apiPrivate.get<PreviewDocumentResponse>(
    "/master/file/get-url",
    {
      params: payload,
    }
  )
  return data
}

export const previewFaqDocument = async (payload: PreviewDocumentPayload) => {
  const { data } = await apiPrivate.get<PreviewDocumentResponse>(
    "/master/faqs/setting/preview-file",
    {
      params: {
        file_id: payload.id,
      },
    }
  )
  return data
}
