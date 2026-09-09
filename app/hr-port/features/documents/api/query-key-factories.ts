import { DefaultError, UseQueryOptions } from "@tanstack/react-query"

import { previewDocument } from "~/hr-port/features/documents/api/documents.api"
import {
  PreviewDocumentPayload,
  PreviewDocumentResponse,
} from "~/hr-port/features/documents/api/documents.types"

export const documentKeys = {
  all: ["documents"] as const,
  uploadDocument: ["dynamic-upload-document"] as const,
  previewDocument: (payload: PreviewDocumentPayload) =>
    ["preview-document", payload] as const,
  downloadDocument: ["download-document"] as const,
}

export type PreviewDocumentQueryOptions = Partial<
  UseQueryOptions<
    PreviewDocumentResponse,
    DefaultError,
    PreviewDocumentResponse,
    ReturnType<typeof documentKeys.previewDocument>
  >
>

export const documentsQueryOptions = {
  previewDocument: (
    payload: PreviewDocumentPayload,
    options?: PreviewDocumentQueryOptions
  ) => ({
    queryKey: documentKeys.previewDocument(payload),
    queryFn: () => previewDocument(payload),
    ...options,
  }),
}
