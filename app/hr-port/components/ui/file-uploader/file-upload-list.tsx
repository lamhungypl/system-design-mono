import { useControllableValue } from "ahooks"
import { FileImage, FileText, Loader2, UploadCloud, X } from "lucide-react"
import { forwardRef, useCallback, useImperativeHandle } from "react"
import { DropzoneOptions } from "react-dropzone"

import { Button } from "~/hr-port/components/base/button"
import {
  OnChangeType,
  UniqFile,
  UploadFile,
  UploadFileStatus,
  UploadRequestOption,
} from "~/hr-port/components/ui/file-uploader/types"
import {
  appendOrUpdateFiles,
  removeFiles,
} from "~/hr-port/components/ui/file-uploader/utils"
import { ToasterToast } from "~/hr-port/hooks/lib/use-toast"
import { cn } from "~/hr-port/utils/style"

import { FILE_TYPE } from "./constants"
import { useFileDropzone } from "./hooks/use-file-dropzone"
import { useUploadHandlers } from "./hooks/use-upload-handlers"

export type FileUploaderInstance = {
  focus: () => void
  open: () => void
}

/**
 * Per-status subtitle copy shown under each file name. Kept configurable so the
 * component stays generic — callers (e.g. the grader "Show work" flow) pass the
 * domain-specific wording.
 */
export type FileStatusCopy = {
  done?: string
  error?: string
  uploading?: string
}

export type FileUploadListProps = {
  browseLabel?: string
  errorCustoms?: Record<string, Pick<ToasterToast, "title" | "description">>
  fileTypes?: FILE_TYPE[]
  /** Supported-formats/size hint rendered next to the browse button. */
  hint?: string
  onChange?: (files: UploadFile[]) => void
  onError?: (error: any, file: UniqFile) => void
  onPreview?: (file: UploadFile) => void
  onProgress?: (event: Partial<ProgressEvent>, file: UniqFile) => void
  onSuccess?: (response: any, file: UniqFile) => void
  request?: (info: UploadRequestOption) => void
  statusCopy?: FileStatusCopy
  value?: UploadFile[]
} & DropzoneOptions

const getFileTypeIcon = (name: string) => {
  const ext = name.split(".").pop()?.toLowerCase() ?? ""
  if (["bmp", "gif", "jpeg", "jpg", "png", "webp"].includes(ext)) {
    return <FileImage className="size-6 text-action-blue" />
  }
  return <FileText className="size-6 text-[#98A2B3]" />
}

/**
 * Compact uploader matching the grader "Show work" design: a single browse
 * button plus a vertical list of uploaded files, each showing an inline status.
 * Reuses {@link useFileDropzone} and {@link useUploadHandlers} — the same
 * pipeline as {@link FileUploader}, only the presentation differs.
 */
const FileUploadList = forwardRef<FileUploaderInstance, FileUploadListProps>(
  function FileUploadListInner(props, ref) {
    const {
      browseLabel = "Browse file to upload...",
      hint,
      statusCopy = {},
      fileTypes = [],
      maxFiles = 0,
      maxSize = Infinity,
      request,
      errorCustoms = {},
      onPreview,
      onProgress: onProgressProp,
      onSuccess: onSuccessProp,
      onError: onErrorProp,
      ...rest
    } = props

    const [files, setFiles] = useControllableValue<UploadFile[]>(props, {
      defaultValue: [],
    })

    const handleChange = useCallback(
      (changed: UploadFile[], type: OnChangeType = OnChangeType.Upsert) => {
        setFiles((prev) =>
          type === OnChangeType.Upsert
            ? appendOrUpdateFiles(changed, prev)
            : removeFiles(changed, prev)
        )
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

    const { getRootProps, getInputProps, rootRef, open } = useFileDropzone({
      ...rest,
      fileTypes,
      maxFiles,
      maxSize,
      errorCustoms,
      noDrag: true,
      onAcceptedFiles: onBatchStart,
    })

    useImperativeHandle(
      ref,
      () => ({
        focus: () => rootRef.current?.focus(),
        open,
      }),
      [rootRef, open]
    )

    const removeFile = useCallback(
      (file: UploadFile) => handleChange([file], OnChangeType.Remove),
      [handleChange]
    )

    return (
      <div className="flex w-full flex-col gap-2">
        <div className="flex items-center gap-4">
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <Button
              variant="outline"
              className={cn(
                "h-fit min-h-0 gap-1 rounded-lg border-[#eaecf0] px-3 py-2",
                "text-[#98A2B3] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
              )}
            >
              <UploadCloud className="size-5" />
              {browseLabel}
            </Button>
          </div>
          {hint && (
            <p className="flex-1 text-xs leading-[18px] text-[#667085]">
              {hint}
            </p>
          )}
        </div>

        {!!files.length && (
          <div className="flex flex-col gap-2">
            {files.map((file) => {
              const isUploading = file.status === UploadFileStatus.UPLOADING
              const isError = file.status === UploadFileStatus.ERROR
              const subtitle = isError
                ? statusCopy.error
                : isUploading
                  ? statusCopy.uploading
                  : statusCopy.done

              return (
                <div
                  key={file.id}
                  className="flex items-center gap-3 rounded-xl border border-[#eaecf0] bg-white py-2 pr-3 pl-2"
                >
                  <div className="flex size-6 shrink-0 items-center justify-center">
                    {isUploading ? (
                      <Loader2 className="size-5 animate-spin text-[#98A2B3]" />
                    ) : (
                      getFileTypeIcon(file.name)
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-semibold text-[#344054]">
                      {file.name}
                    </span>
                    {subtitle && (
                      <span
                        className={cn("truncate text-sm text-[#475467]", {
                          "text-action-red": isError,
                        })}
                      >
                        {subtitle}
                      </span>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {!isUploading && (file.url || file.originObj) && (
                      <button
                        type="button"
                        className="text-xs font-normal text-action-blue"
                        onClick={() => onPreview?.(file)}
                      >
                        Preview
                      </button>
                    )}
                    {!isUploading && (
                      <X
                        className="size-4 cursor-pointer text-[#98A2B3]"
                        onClick={() => removeFile(file)}
                      />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }
)

export default FileUploadList
