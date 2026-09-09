import { AtLeast } from "~/hr-port/types/common"

export type UniqFile = {
  originObj: File
  /**
   * @description uniq id of the file - to be used on client only
   */
  uid: string
}

export const enum UploadFileStatus {
  DONE = "DONE",
  ERROR = "ERROR",
  REMOVED = "REMOVED",
  REMOVING = "REMOVING",
  SUCCESS = "SUCCESS",
  UPLOADING = "UPLOADING",
}

export type UploadFile = {
  /**
   * @description uniq id of the 'remote' file - to be used when sending payload of the file
   * default to files's uid
   */
  id: string
  lastModified?: number
  name: string
  percent?: number
  response?: any
  size?: number
  /**
   * @description client file processing status
   */
  status?: UploadFileStatus
  thumbUrl?: string
  type?: string
  url?: string
} & AtLeast<UniqFile, "uid">

export const enum OnChangeType {
  Remove = "remove",
  Upsert = "upsert",
}

export type UploadFilePreview = Pick<
  UploadFile,
  "name" | "originObj" | "url" | "thumbUrl"
>

export type UploadRequestOption = {
  file: File
  onError?: (error: Error) => void
  onProgress?: (event: Partial<ProgressEvent>) => void
  onStart?: (file: any) => void
  onSuccess?: (response: any) => void
}
