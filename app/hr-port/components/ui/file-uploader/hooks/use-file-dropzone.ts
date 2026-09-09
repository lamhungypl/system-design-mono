import { useMemo } from "react"
import { DropzoneOptions, ErrorCode, useDropzone } from "react-dropzone"
import { useTranslation } from "react-i18next"

import { FILE_TYPE } from "~/hr-port/components/ui/file-uploader/constants"
import {
  bytesToSize,
  getAcceptFileType,
} from "~/hr-port/components/ui/file-uploader/utils"
import { toast, ToasterToast } from "~/hr-port/hooks/lib/use-toast"

export type UseFileDropzoneProps = {
  errorCustoms?: Record<string, Pick<ToasterToast, "title" | "description">>
  fileTypes?: FILE_TYPE[]
  onAcceptedFiles?: (files: File[]) => void
} & DropzoneOptions

/**
 * Shared dropzone config: builds `accept` from `fileTypes`, applies size/count
 * limits, and surfaces rejection errors as toasts. Accepted files are forwarded
 * to `onAcceptedFiles` so each consumer can decide what "upload" means.
 */
export function useFileDropzone(props: UseFileDropzoneProps) {
  const {
    fileTypes = [],
    maxFiles = 1,
    maxSize = Infinity,
    errorCustoms = {},
    onAcceptedFiles,
    accept,
    ...rest
  } = props
  const { t } = useTranslation()
  const fileAccepts = useMemo(() => getAcceptFileType(fileTypes), [fileTypes])
  // `getAcceptFileType([])` returns `{}`; fall back to the caller-provided
  // `accept` when no `fileTypes` were given so it isn't silently ignored.
  const hasFileTypeAccepts =
    !!fileAccepts && Object.keys(fileAccepts).length > 0

  return useDropzone({
    ...rest,
    accept: hasFileTypeAccepts ? fileAccepts : accept,
    maxFiles: maxFiles,
    maxSize: maxSize,
    onDrop(acceptedFiles, fileRejections) {
      if (fileRejections.length) {
        const errorsMap = new Map(
          fileRejections
            .map((item) => item.errors)
            .flat()
            .map((errorItem) => [errorItem.code, errorItem])
        )
        const uniqErrors = Array.from(errorsMap.values())

        const toastMessages = {
          [ErrorCode.FileTooLarge]: {
            description: t("common.toast_messages.error.invalid_file_size", {
              size: bytesToSize(maxSize),
              formats: fileTypes.join(", "),
            }),
          },
          [ErrorCode.FileInvalidType]: {
            description: t("common.toast_messages.error.invalid_file_format", {
              formats: fileTypes.join(", "),
              size: bytesToSize(maxSize),
            }),
          },
          [ErrorCode.TooManyFiles]: {
            description: t("common.toast_messages.error.too_many_file"),
          },
          ...errorCustoms,
        } satisfies Record<string, Pick<ToasterToast, "title" | "description">>
        uniqErrors.forEach((err) => {
          toast({
            variant: "destructive",
            title: t("common.toast_messages.error.title"),
            description:
              toastMessages[err.code as keyof typeof toastMessages]
                ?.description || err.message,
          })
        })
      }
      onAcceptedFiles?.(acceptedFiles)
    },
  })
}
