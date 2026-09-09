import { Language } from "~/hr-port/constants"
import { UploadDocsResponse } from "~/hr-port/features/documents/api/documents.types"
import { ApiResponse } from "~/hr-port/types/common"

export type Screen =
  | "HOME"
  | "THEME_SETTINGS"
  | "EMAIL_CONFIGURATION"
  | "PERMISSION_SETTINGS"
  | "COMPANY_PROFILE"
  | "EMPLOYEE_LIST"
  | "EMPLOYEE_PROFILE"
  | "REQUEST_AWAITING_MY_APPROVAL"
  | "INCOME_AND_DEDUCTION"
  | "EMPLOYMENT_TYPE"
  | "PAYROLL_PERIOD_LIST"
  | "CREATE_PAYROLL_PERIOD"
  | "PAYROLL_PERIOD_TABLE"
  | "COMPANY_STANDARD_CONFIGURATION"
  | "ONBOARDING_SCREEN"

export type GetFaqSettingsResponse = ApiResponse<
  Array<{
    group: string
    items: Array<{
      id: number
      last_modified_at: string
      resource_url: string
      screen: Screen
      uploaded_by: string
      uploaded_time: string
      uploaders: Array<{
        file_id: number
        file_name: string
        file_path: string
        order: number
      }>
    }>
    screens: Screen[]
  }>
>

export type GetFaqSettingsResult = {
  items: FaqSetting[]
  screens: Screen[]
}

export type FaqSetting = {
  group: string
  id: number
  last_modified_at: string
  resource_url: string
  screen: Screen
  updated_at: string
  updated_by: string
  uploaders: Uploader[]
}

export type Uploader = { order: number } & UploadDocsResponse

export type GetFaqSettingPayload = {
  language: string
}

export type AddFaqSettingPayload = {
  items: {
    resource_url: string
    target_screen: string
    uploaded_file_items: UploaderPayload[]
  }[]
  language: string
}

export type UpdateFaqSettingPayload = {
  items: {
    faq_id: number
    resource_url: string
    target_screen: Screen
    uploaded_file_items: UploaderPayload[]
  }[]
  language: string
}

export type UploaderPayload = {
  id: number
  order: number
}

export type DeleteFaqSettingPayload = {
  faq_id: number
  language: string
  last_modified_at: string
}

export type GetViewFaqSettingsResponse = ApiResponse<
  Array<{
    items: Array<{
      files: Array<{
        file_id: number
        file_name: string
        file_path: string
      }>
      language: string
      resource_url: string
    }>
    screen: Screen
  }>
>

export type ViewFaqSettingsMap = Record<
  Screen,
  Record<Language, ViewFaqSettings>
>

export type ViewFaqSettings = {
  files: UploadDocsResponse[]
  resource_url: string
}
