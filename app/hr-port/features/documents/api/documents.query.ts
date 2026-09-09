import {
  DefaultError,
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query"

import {
  downloadDocument,
  dynamicUploadDocument,
} from "~/hr-port/features/documents/api/documents.api"
import {
  DownloadDocsPayload,
  DownloadDocsResponse,
  DynamicUploadDocsPayload,
  DynamicUploadDocsResponse,
  PreviewDocumentPayload,
} from "~/hr-port/features/documents/api/documents.types"
import {
  documentKeys,
  documentsQueryOptions,
  PreviewDocumentQueryOptions,
} from "~/hr-port/features/documents/api/query-key-factories"

export const useUploadDocumentsMutation = (
  options?: Partial<
    UseMutationOptions<DynamicUploadDocsResponse, any, DynamicUploadDocsPayload>
  >
) => {
  const query = useMutation({
    mutationFn: dynamicUploadDocument,
    mutationKey: documentKeys.uploadDocument,
    ...options,
  })

  return query
}

export const usePreviewDocumentQuery = (
  payload: PreviewDocumentPayload,
  options?: PreviewDocumentQueryOptions
) => {
  return useQuery(documentsQueryOptions.previewDocument(payload, options))
}

type DownloadDocumentMutationOptions = Partial<
  UseMutationOptions<DownloadDocsResponse, DefaultError, DownloadDocsPayload>
>

export const useDownloadDocumentMutation = (
  options?: DownloadDocumentMutationOptions
) => {
  return useMutation({
    mutationFn: downloadDocument,
    mutationKey: documentKeys.downloadDocument,
    ...options,
  })
}
