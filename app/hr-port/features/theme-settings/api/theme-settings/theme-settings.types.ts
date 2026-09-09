import { ApiResponse } from "~/hr-port/types/common"

export type ThemeSetting = {
  has_default: boolean
  id: number
  key: string
  label_key: string
  metadatas: ThemeMetadatas
  name: string
  sort_order: number
}

export type ThemeMetadatas = {
  bg_file_path: string
  icon_file_path: string
  theme: ThemeObject
}

export type ThemeObject = {
  [key: `--${string}`]: string
}

export type GetThemeListResponse = ApiResponse<ThemeSetting[]>

export type ThemeSchedule = {
  effective_date: string
  expire_date: string
  id: number
  key: string
  label_key: string
  name: string
  seasonal_id: number
}

export type GetThemeScheduleListResponse = ApiResponse<ThemeSchedule[]>

export type SaveThemeScheduleListPayload = SaveThemeScheduleListItemPayload[]

export type SaveThemeScheduleListItemPayload = {
  effective_date: string
  expire_date: string
  id: number | null
  is_deleted: boolean
  key: string
}
