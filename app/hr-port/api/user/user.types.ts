import { Roles } from "~/hr-port/constants"
import { Permission } from "~/hr-port/features/permissions/constants"
import { ThemeMetadatas } from "~/hr-port/features/theme-settings/api/theme-settings/theme-settings.types"
import { ApiResponse } from "~/hr-port/types/common"

export type UserInfo = {
  birth_day: string
  company_code: string
  company_configuration_step: number
  company_key: string
  company_name: string
  company_onboard_date: string
  config_status: number
  employee_code: string
  employee_id: number
  employee_key: string
  first_name: string
  last_name: string | null
  permissions: Permission[]
  regions: {
    id: number
    name: string
  }[]
  roles: Roles[]
  theme: {
    key: string
    label_key: string
    metadatas: ThemeMetadatas
  }
} & UserInfoMetadata

export type UserInfoMetadata = {
  employee_name: string
  permission_map: Record<Permission, boolean>
  role_map: Record<keyof typeof Roles, boolean>
}

export type GetUserInfoResponse = ApiResponse<UserInfo>

export type GetCsrfTokenResponse = ApiResponse<string>
