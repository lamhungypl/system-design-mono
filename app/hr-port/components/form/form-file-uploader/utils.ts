import { SPLITTER } from "~/hr-port/components/form/form-file-uploader/constants"
import {
  UniqFile,
  UploadFile,
} from "~/hr-port/components/ui/file-uploader/types"

export const extractFileInfo = (fileStr: string) => {
  const splittedFileStr = fileStr.split(SPLITTER)
  if (splittedFileStr.length > 1) {
    const [fileId, fileName] = splittedFileStr
    return [fileId, fileName] as const
  } else {
    return [fileStr, "filename"] as const // If no underscore is found, return the entire string
  }
}
export const createFileFromData = (props: {
  data?: string[]
  filename: string
}) => {
  const { data, filename } = props
  const file = new File(data || [""], filename)
  return file
}

export const convertFormValueToFiles = (value: unknown): UploadFile[] => {
  if (!value) {
    return []
  }
  const safeArray = Array.isArray(value) ? value : [value]
  const safeFiles = safeArray.map((item) => {
    if ((item as UniqFile)?.originObj instanceof File) {
      return item
    }
    const [fileId, filename] = extractFileInfo(item?.toString())
    // create a fake file to view filename in the uploader.
    return {
      originObj: createFileFromData({ filename }),
      uid: fileId,
      id: fileId,
      name: filename,
    } satisfies UploadFile
  })
  return safeFiles
}
