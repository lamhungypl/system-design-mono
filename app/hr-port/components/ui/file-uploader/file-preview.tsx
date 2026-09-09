import { X } from "lucide-react"

import { Progress } from "~/hr-port/components/base/progress"
import {
  UploadFile,
  UploadFileStatus,
} from "~/hr-port/components/ui/file-uploader/types"
import {
  bytesToSize,
  isImageUrl,
} from "~/hr-port/components/ui/file-uploader/utils"
import { useFilePreview } from "~/hr-port/hooks/useFilePreview"
import { cn } from "~/hr-port/utils/style"

type Props = { file: UploadFile; onDelete?: () => void }

const statusLookup = {
  DONE: "Completed",
  ERROR: "Failed",
  REMOVED: "REMOVED",
  REMOVING: "REMOVING",
  SUCCESS: "Completed",
  UPLOADING: "Uploading",
} satisfies Record<UploadFileStatus, string>

const FilePreview = (props: Props) => {
  const { file, onDelete } = props
  const { preview, previewIcon } = useFilePreview({ file })

  return (
    <div className="flex flex-col gap-4 rounded-sm border border-solid border-[#bfbfbf] px-5 pt-3 pb-2.5">
      <div className="flex w-full items-start gap-3">
        <div className="flex h-6 w-5 items-center justify-center rounded border-solid border-[#bfbfbf]">
          {isImageUrl(file)
            ? preview && (
                <img
                  src={preview}
                  className="h-[32px] w-[28px] object-contain"
                />
              )
            : previewIcon}
        </div>
        <div className="flex flex-1 flex-col gap-1 overflow-hidden">
          <span className="line-clamp-1 cursor-pointer text-xs font-medium text-foreground">
            {file.name}
          </span>

          <div className="inline-flex items-center gap-1">
            <span className="cursor-pointer text-xs font-medium text-[#bfbfbf]">
              {file.originObj?.size ? bytesToSize(file.originObj.size) : ""}
            </span>
            {!!file.status &&
              [UploadFileStatus.ERROR, UploadFileStatus.DONE].includes(
                file.status
              ) && (
                <span
                  className={cn("cursor-pointer text-xs font-medium", {
                    "text-action-red": file.status === UploadFileStatus.ERROR,
                    "text-action-green": file.status === UploadFileStatus.DONE,
                  })}
                >
                  {statusLookup[file.status]}
                </span>
              )}
          </div>
        </div>
        <X
          className="h-4 w-4 cursor-pointer text-[#33333]"
          onClick={() => {
            onDelete?.()
          }}
        />
      </div>
      {file.status === UploadFileStatus.UPLOADING && (
        <Progress value={file.percent} className="bg-[#F2F2F2]" />
      )}
    </div>
  )
}

export default FilePreview
