import { UploadFile } from "~/hr-port/components/ui/file-uploader/types"
import { ControlType } from "~/hr-port/constants"

export type FormFileData = {
  controlType: ControlType.FILE_UPLOADER
} & UploadFile
