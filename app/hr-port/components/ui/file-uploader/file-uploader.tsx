import { useControllableValue } from "ahooks"
import { forwardRef, useCallback, useImperativeHandle } from "react"
import { DropzoneOptions } from "react-dropzone"
import { useTranslation } from "react-i18next"

import { AppUploadIcon } from "~/hr-port/assets/svgs/icons/Icon"
import { Button } from "~/hr-port/components/base/button"
import { FILE_TYPE } from "~/hr-port/components/ui/file-uploader/constants"
import FilePreview from "~/hr-port/components/ui/file-uploader/file-preview"
import {
  OnChangeType,
  UniqFile,
  UploadFile,
  UploadRequestOption,
} from "~/hr-port/components/ui/file-uploader/types"
import {
  appendOrUpdateFiles,
  bytesToSize,
  removeFiles,
} from "~/hr-port/components/ui/file-uploader/utils"
import { ToasterToast } from "~/hr-port/hooks/lib/use-toast"
import { cn } from "~/hr-port/utils/style"

import { useFileDropzone } from "./hooks/use-file-dropzone"
import { useUploadHandlers } from "./hooks/use-upload-handlers"

export type FileUploaderInstance = {
  focus: () => void
}

export type FileUploaderProps = {
  errorCustoms?: Record<string, Pick<ToasterToast, "title" | "description">>
  fileTypes?: FILE_TYPE[]
  onChange?: (files: UploadFile[]) => void
  value?: UploadFile[]
} & {
  onError?: (error: any, file: UniqFile) => void
  onProgress?: (event: Partial<ProgressEvent>, file: UniqFile) => void
  onStart?: (file: any) => void
  onSuccess?: (response: any, file: UniqFile) => void
  request?: (info: UploadRequestOption) => void
} & DropzoneOptions

const FileUploader = forwardRef<FileUploaderInstance, FileUploaderProps>(
  function FileUploaderInner(props, ref) {
    const {
      fileTypes = [],
      maxFiles = 1,
      maxSize = Infinity,
      request,
      errorCustoms = {},
      onProgress: onProgressProp,
      onSuccess: onSuccessProp,
      onError: onErrorProp,
      ...rest
    } = props
    const { t } = useTranslation()

    const [files, setFiles] = useControllableValue<UploadFile[]>(props, {
      defaultValue: [],
    })

    const handleChange = useCallback(
      (files: UploadFile[], type: OnChangeType = OnChangeType.Upsert) => {
        if (type === OnChangeType.Upsert) {
          setFiles((prev) => {
            const nextValues = appendOrUpdateFiles(files, prev)
            return nextValues
          })
        } else {
          setFiles((prev) => {
            const nextValues = removeFiles(files, prev)
            return nextValues
          })
        }
      },
      [setFiles]
    )

    const { onBatchStart } = useUploadHandlers({
      handleChange,
      request,
      onProgress: onProgressProp,
      onSuccess: onSuccessProp,
      onError: onErrorProp,
    })

    const { getRootProps, getInputProps, rootRef, isDragAccept } =
      useFileDropzone({
        ...rest,
        fileTypes,
        maxFiles,
        maxSize,
        errorCustoms,
        onAcceptedFiles: onBatchStart,
      })

    useImperativeHandle(
      ref,
      () => ({
        focus: () => {
          rootRef.current?.focus()
        },
      }),
      [rootRef]
    )

    return (
      <div className={cn("flex w-full flex-col gap-1 focus:ring")}>
        <div
          {...getRootProps({
            className: cn(
              "flex w-full cursor-pointer items-center justify-center rounded-sm bg-[#fff7e5] px-2 pb-3",
              "border border-dashed border-[#bfbfbf] hover:border-[#f19100]",
              { "border-[#006dc6] bg-[#006DC624]": isDragAccept }
            ),
          })}
        >
          <div className="flex flex-col items-center">
            <input {...getInputProps()} />
            <AppUploadIcon className="h-16 w-20" />
            <div className="mt-3 font-bold">{t("common.uploader.import")}</div>
            <div className="mt-2 text-center text-sm font-medium text-action-blue">
              {t("common.uploader.drag_or_click")}
            </div>
            <Button
              variant="action_outline"
              className="mt-3 h-fit min-h-0 rounded-md py-1.5"
            >
              {t("common.uploader.choose_file")}
            </Button>
          </div>
        </div>
        <div className="flex justify-between">
          {!!fileTypes.length && (
            <span className="text-xs text-[#bfbfbf]">
              {t("common.uploader.supported_formats", {
                formats: fileTypes.join(", "),
              })}
            </span>
          )}
          {Number.isFinite(maxSize) && (
            <span className="text-xs text-[#bfbfbf]">
              {t("common.uploader.file_size_under", {
                size: bytesToSize(maxSize),
              })}
            </span>
          )}
        </div>
        {!!(files || []).length && !!files[0].originObj && (
          <aside className="mt-4">
            <h4 className="text-xs font-semibold text-foreground">
              {t("common.uploader.uploaded")}
            </h4>
            <div className="mt-3">
              {files.map((item) => (
                <FilePreview
                  key={item.id}
                  file={item}
                  onDelete={() => {
                    setFiles((prev) => prev.slice(0, -1))
                  }}
                />
              ))}
            </div>
          </aside>
        )}
      </div>
    )
  }
)

export default FileUploader
