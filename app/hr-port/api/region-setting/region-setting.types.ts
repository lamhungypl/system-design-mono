import { Language } from "~/hr-port/constants"
import { ApiResponse, ApiResult } from "~/hr-port/types/common"

export type GetRegionSetting = () => Promise<GetRegionSettingResult>

export type GetRegionSettingResult = ApiResult<RegionSettingMap>

export type GetRegionSettingResponse = ApiResponse<RegionSetting[]>

export type RegionSetting = {
  key: string
  value: string
  value_type: "TEXT" | "NUMBER" | "DECIMAL"
}

export type RegionSettingMap = {
  child_allowance: number | null
  default_region_language: Language
  disable_personal_allowance: number
  "employee_profile.deduction_settings.deduction_personal_and_family.parental_care_allowance.1": number
  "employee_profile.deduction_settings.deduction_personal_and_family.parental_care_allowance.2": number
  "employee_profile.deduction_settings.deduction_personal_and_family.parental_care_allowance.3": number
  "employee_profile.deduction_settings.deduction_personal_and_family.parental_care_allowance.4": number
  "employee_profile.deduction_settings.deduction_personal_and_family.personal_allowance_and_marriage_status.1": number
  "employee_profile.deduction_settings.deduction_personal_and_family.personal_allowance_and_marriage_status.2": number
  "employee_profile.deduction_settings.deduction_personal_and_family.personal_allowance_and_marriage_status.3": number
  "employee_profile.deduction_settings.deduction_personal_and_family.personal_allowance_and_marriage_status.4": number
  max_age_of_child_allowance: number
  max_disable_personal_allowance: number
  max_disable_personal_not_relative_allowance: number
  max_legitimate_children_allowance: number
  personal_expense_allowance: number | null
  region_code: string
  region_currency: string
  region_currency_symbol: string
  region_timezone: string
  rounding_mode: string
  rounding_scale: number
}

export type RegionSettingMapKey = keyof RegionSettingMap
