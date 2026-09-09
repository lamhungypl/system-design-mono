import { AxiosRequestConfig } from "axios"
import { useEffect, useState } from "react"

import { useUploadDocumentsMutation } from "~/hr-port/features/documents/api/documents.query"
import { UploadDocsResponse } from "~/hr-port/features/documents/api/documents.types"
import { FILE_FOLDER, FILE_LEVEL } from "~/hr-port/features/documents/constants"
import { ToasterToast } from "~/hr-port/hooks/lib/use-toast"
import useSyncAppLoading from "~/hr-port/hooks/use-sync-app-loading"

import {
  FILE_TYPE,
  MAX_SIZE_IMPORT_FILE,
  supportedFileTypes,
} from "../constants"
import { UploadRequestOption } from "../types"
import { BeforeUploadFileType, fileToUniq, processFile } from "../utils"
import { useFileDropzone } from "./use-file-dropzone"

const defaultBeforeUpload = () => true

export type UseUploadFileProps = {
  axiosConfig?: AxiosRequestConfig
  /**
   * Runs before the file is handed to `request`. Return `false` to opt out of
   * uploading that file (e.g. failed client-side validation).
   */
  beforeUpload?: (
    file: File
  ) => BeforeUploadFileType | Promise<BeforeUploadFileType>
  disableUploadOnChange?: boolean
  errorCustoms?: Record<string, Pick<ToasterToast, "title" | "description">>
  fileTypes?: FILE_TYPE[]
  folder?: FILE_FOLDER
  level?: FILE_LEVEL
  maxFiles?: number
  maxSize?: number
  onChange?: (newValue: UploadDocsResponse) => void
  /**
   * Override how a chosen file is uploaded. Defaults to POSTing to the documents
   * endpoint (or creating a local blob URL when `disableUploadOnChange` is set),
   * so the hook is no longer hard-coupled to a single endpoint.
   */
  request?: (info: UploadRequestOption) => void
  revokeUrlOnChange?: boolean
}

export default function useUploadFile(props: UseUploadFileProps) {
  const {
    fileTypes = supportedFileTypes,
    maxFiles = 1,
    maxSize = MAX_SIZE_IMPORT_FILE,
    onChange: propsOnChange,
    folder = FILE_FOLDER.FILE,
    level = FILE_LEVEL.EMPLOYEE,
    axiosConfig,
    disableUploadOnChange = false,
    revokeUrlOnChange = true,
    errorCustoms,
    beforeUpload = defaultBeforeUpload,
    request: propsRequest,
  } = props
  const [blobUrl, setBlobUrl] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (revokeUrlOnChange && blobUrl) {
        URL.revokeObjectURL(blobUrl)
      }
    }
  }, [blobUrl, revokeUrlOnChange])

  const { mutateAsync: uploadFile, isPending: isPendingUploadFile } =
    useUploadDocumentsMutation({
      meta: { disableToastSuccess: true },
    })

  useSyncAppLoading({ loading: isPendingUploadFile })

  // Default uploader: local blob URL when uploads are disabled, otherwise POST
  // to the documents endpoint. Callers can replace it entirely via `request`.
  const defaultRequest = ({
    file,
    onSuccess,
    onError,
  }: UploadRequestOption) => {
    if (disableUploadOnChange) {
      const url = URL.createObjectURL(file)
      setBlobUrl(url)
      onSuccess?.({
        file_name: file.name,
        file_path: url,
        id: null,
      })
      return
    }
    uploadFile({ data: { file, folder, level }, config: axiosConfig })
      .then((res) => onSuccess?.(res.data))
      .catch((err) => onError?.(err))
  }

  const request = propsRequest ?? defaultRequest

  const handleFileChange = async (file: File) => {
    const { parsedFile } = await processFile(fileToUniq(file), (uniqFile) =>
      beforeUpload(uniqFile.originObj)
    )
    // `beforeUpload` returned false → skip uploading this file.
    if (!parsedFile) return
    request({
      file: parsedFile.originObj,
      onSuccess: (res: UploadDocsResponse) => propsOnChange?.(res),
    })
  }

  const dropzoneInfo = useFileDropzone({
    fileTypes,
    maxFiles,
    maxSize,
    errorCustoms,
    onAcceptedFiles(acceptedFiles) {
      if (acceptedFiles.length) {
        handleFileChange(acceptedFiles[acceptedFiles.length - 1])
      }
      if (dropzoneInfo.inputRef.current)
        dropzoneInfo.inputRef.current.value = ""
    },
  })

  return dropzoneInfo
}
