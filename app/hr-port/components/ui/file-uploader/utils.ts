import { nanoid } from "nanoid"

import {
  FILE_TYPE,
  supportedFileTypes,
} from "~/hr-port/components/ui/file-uploader/constants"
import { FileUploaderProps } from "~/hr-port/components/ui/file-uploader/file-uploader"
import {
  UniqFile,
  UploadFile,
} from "~/hr-port/components/ui/file-uploader/types"
import { uniqArrayBy } from "~/hr-port/features/common/utils"

export const bytesToSize = (bytes: number) => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  if (bytes === 0) return "n/a"
  const i = parseInt(`${Math.floor(Math.log(bytes) / Math.log(1024))}`, 10)
  if (i === 0) return `${bytes} ${sizes[i]}`
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/MIME_types/Common_types
 */
export const MIMEMappings: Record<FILE_TYPE, string> = {
  [FILE_TYPE.CSV]: "text/csv",
  [FILE_TYPE.JPEG]: "image/jpeg",
  [FILE_TYPE.JPG]: "image/jpeg",
  [FILE_TYPE.PDF]: "application/pdf",
  [FILE_TYPE.PNG]: "image/png",
  [FILE_TYPE.XLSX]:
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
}

export const MIMEToTypeMappings = Object.entries(MIMEMappings).reduce(
  (prev, [key, value]) => {
    prev[value] = key as FILE_TYPE
    return prev
  },
  {} as Record<string, FILE_TYPE>
)

export const fileExtensionMappings: Record<FILE_TYPE, string> = {
  [FILE_TYPE.CSV]: ".csv",
  [FILE_TYPE.JPEG]: ".jpeg",
  [FILE_TYPE.JPG]: ".jpg",
  [FILE_TYPE.PDF]: ".pdf",
  [FILE_TYPE.PNG]: ".png",
  [FILE_TYPE.XLSX]: ".xlsx",
}
export const getAcceptFileType = (types: FILE_TYPE[]) => {
  if (!Array.isArray(types)) {
    return undefined
  }
  const accept = types.reduce(
    (accept, type) => {
      if (supportedFileTypes.includes(type)) {
        const currentExtensions = accept[MIMEMappings[type]] ?? []
        const nextExtensionsSet = new Set(
          currentExtensions.concat(fileExtensionMappings[type])
        )
        const nextExtensions = Array.from(new Set(nextExtensionsSet).values())
        accept[MIMEMappings[type]] = nextExtensions
      }
      return accept
    },
    // PORT: react-dropzone 20 widened `accept` to `Accept | AcceptGroup[]`, which is
    // not string-indexable; the accumulator is built as a plain record and cast back.
    {} as Record<string, string[]>
  )
  return accept as NonNullable<FileUploaderProps["accept"]>
}

export const fileToUniq = (origin: File): UniqFile =>
  ({
    originObj: origin,
    uid: nanoid(),
  }) satisfies UniqFile

export const fileToObj = (info: UniqFile): UploadFile => {
  return {
    ...info,
    id: info.uid,
    lastModified: info.originObj?.lastModified,
    name: info.originObj.name,
    size: info.originObj.size,
    type: info.originObj.type,
    uid: info.uid,
    originObj: info.originObj,
  }
}

export const appendOrUpdateFiles = (
  nextFiles: UploadFile[],
  originList: UploadFile[]
) => {
  return uniqArrayBy(originList.concat(nextFiles), "uid")
}

export const removeFiles = (
  affectedFiles: UploadFile[],
  originList: UploadFile[]
) => {
  return uniqArrayBy(
    originList.filter(
      (item) =>
        !affectedFiles.some(
          (toBeDeletedItem) => toBeDeletedItem.uid === item.uid
        )
    ),
    "uid"
  )
}

export type BeforeUploadFileType = File | boolean | string
export const processFile = async (
  file: UniqFile,
  beforeUpload: (
    file: UniqFile
  ) => BeforeUploadFileType | Promise<BeforeUploadFileType>
): Promise<{
  originFile: UniqFile
  parsedFile: UniqFile | null
}> => {
  if (!beforeUpload) {
    return {
      originFile: file,
      parsedFile: file,
    }
  }

  let transformedFile: BeforeUploadFileType | void

  try {
    transformedFile = await beforeUpload(file)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    // Rejection is treated as false
    transformedFile = false
  }

  if (transformedFile === false) {
    return {
      originFile: file,
      parsedFile: null,
    }
  }
  const parsedData =
    (typeof transformedFile === "object" ||
      typeof transformedFile === "string") &&
    transformedFile
      ? transformedFile
      : file.originObj
  const nextFileFromData =
    parsedData instanceof File
      ? parsedData
      : new File([parsedData], file.originObj.name, {
          type: file.originObj.type,
        })

  return {
    originFile: file,
    parsedFile: {
      originObj: nextFileFromData,
      uid: file.uid,
    } satisfies UniqFile,
  }
}

const extname = (url = "") => {
  const temp = url.split("/")
  const filename = temp[temp.length - 1]
  const filenameWithoutSuffix = filename.split(/[#?]/)[0]
  return (/\.[^./\\]*$/.exec(filenameWithoutSuffix) || [""])[0]
}

const isImageFileType = (type: string): boolean => type.indexOf("image/") === 0

export const isImageUrl = (file: UploadFile): boolean => {
  if (file.type && !file.thumbUrl && !file.url) {
    return isImageFileType(file.type)
  }
  const url = file.thumbUrl || file.url || ""
  const extension = extname(url)

  const fileNameExtension = extname(file.name)

  if (
    /^data:image\//.test(url) ||
    /(webp|svg|png|gif|jpg|jpeg|jfif|bmp|dpg|ico|heic|heif)$/i.test(
      extension
    ) ||
    /(webp|svg|png|gif|jpg|jpeg|jfif|bmp|dpg|ico|heic|heif)$/i.test(
      fileNameExtension
    )
  ) {
    return true
  }
  if (/^data:/.test(url)) {
    // other file types of base64
    return false
  }
  if (extension) {
    // other file types which have extension
    return false
  }
  if (fileNameExtension) {
    // other file types which have extension
    return false
  }

  return false
}
