import { useCallback } from "react"

import {
  OnChangeType,
  UniqFile,
  UploadFile,
  UploadFileStatus,
  UploadRequestOption,
} from "~/hr-port/components/ui/file-uploader/types"
import {
  fileToObj,
  fileToUniq,
  processFile,
} from "~/hr-port/components/ui/file-uploader/utils"
import { UploadDocsResponse } from "~/hr-port/features/documents/api/documents.types"

const beforeUpload = () => true

export type UseUploadHandlersProps = {
  handleChange: (files: UploadFile[], type?: OnChangeType) => void
  onError?: (error: any, file: UniqFile) => void
  onProgress?: (event: Partial<ProgressEvent>, file: UniqFile) => void
  onSuccess?: (response: any, file: UniqFile) => void
  request?: (info: UploadRequestOption) => void
}

export function useUploadHandlers({
  handleChange,
  request,
  onProgress: onProgressProp,
  onSuccess: onSuccessProp,
  onError: onErrorProp,
}: UseUploadHandlersProps) {
  const onProgress = useCallback(
    (event: Partial<ProgressEvent>, file: UniqFile) => {
      const objectFile = fileToObj(file)
      objectFile.status = UploadFileStatus.UPLOADING
      if (event.lengthComputable) {
        const total = event.total || Infinity
        const loaded = event.loaded || 0
        const percent = loaded / total
        objectFile.percent = percent * 100
      }
      handleChange([objectFile])
      onProgressProp?.(event, file)
    },
    [handleChange, onProgressProp]
  )

  const onSuccess = useCallback(
    (response: UploadDocsResponse, file: UniqFile) => {
      const objectFile = fileToObj(file)
      objectFile.id = (response.id || objectFile.id).toString()
      objectFile.status = UploadFileStatus.DONE
      objectFile.response = response
      handleChange([objectFile])
      onSuccessProp?.(response, file)
    },
    [handleChange, onSuccessProp]
  )

  const onError = useCallback(
    (error: any, file: UniqFile) => {
      const objectFile = fileToObj(file)
      objectFile.status = UploadFileStatus.ERROR
      objectFile.response = error
      handleChange([objectFile])
      onErrorProp?.(error, file)
    },
    [handleChange, onErrorProp]
  )

  const onStartUploading = useCallback(
    (files: UniqFile[]) => {
      if (!files.length) {
        return
      }
      const objectFileList = files.map(fileToObj)
      const mappedStatus = objectFileList.map((item) => {
        if (!request) {
          return item
        }
        item.status = UploadFileStatus.UPLOADING
        return item
      })
      handleChange(mappedStatus)
    },
    [handleChange, request]
  )

  const handlePost = useCallback(
    (uniqFile: UniqFile) => {
      if (request) {
        request({
          file: uniqFile.originObj,
          onProgress: (e: Partial<ProgressEvent>) => {
            onProgress?.(e, uniqFile)
          },
          onSuccess: (ret: any) => {
            onSuccess?.(ret, uniqFile)
          },
          onError: (err: any) => {
            onError?.(err, uniqFile)
          },
        })
      }
    },
    [onError, onProgress, onSuccess, request]
  )

  const onBatchStart = useCallback(
    async (files: File[]) => {
      const uniqFiles = files.map(fileToUniq)
      const postFiles = await Promise.all(
        uniqFiles.map((item) => processFile(item, beforeUpload))
      )

      const validFiles = postFiles.reduce(
        (acc, cur) => acc.concat(cur.parsedFile ? cur.parsedFile : []),
        [] as UniqFile[]
      )
      onStartUploading(validFiles)
      validFiles.forEach((item) => {
        handlePost(item)
      })
    },
    [handlePost, onStartUploading]
  )

  return { onBatchStart }
}
