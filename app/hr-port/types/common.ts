import { FunctionComponent, SVGProps } from "react"
import { DeepPartial as InnerDeepPartial } from "react-hook-form"

export type SelectOption = {
  [key: string]: any
  hidden?: boolean
  icon_file_path?: string
  id?: string | number | null
  label: string
  value: string
}

export type MetadataError = {
  errorCode: string
  field: string
  message: string
  params: Record<string, any>[]
}

export type ApiResult<T = unknown> =
  | T
  | { errors: MetadataError[] }
  | null
  | undefined

export type ApiResponse<T = unknown> = {
  data: T
  metadatas: MetadataError[] | null
  status: boolean
}

/**
 * @description Pick some keys of the target type and make others optionals
 */
export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>

export type SortParams = Record<string, "asc" | "desc" | null>

export type SVGIconProps = FunctionComponent<
  {
    title?: string
  } & SVGProps<SVGSVGElement>
>

export declare type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K
}[keyof T]

export type EntityState<T, Id extends string = string> = {
  entities: Record<Id, T>
  names: Id[]
}

export type Updater<T> = T | ((old: T) => T)

export type DeepPartial<T> = InnerDeepPartial<T>

export type BlobResponse = {
  file: Blob
  headers: Record<string, string>
}

export type AncestorSizeSelector = {
  ratio?: number
  selector?: string
}

export type Nullable<T> = {
  [P in keyof T]: T[P] | null
}

export type DeepNullable<T> = T extends object
  ? { [K in keyof T]: DeepNullable<T[K]> }
  : T | null
