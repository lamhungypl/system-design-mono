import { apiPrivate, csrfToken } from "~/hr-port/config/axios"
import { Roles } from "~/hr-port/constants"
import {
  allPermissions,
  Permission,
} from "~/hr-port/features/permissions/constants"
import { getMapFromPrimitiveArray } from "~/hr-port/utils/object"

import { GetCsrfTokenResponse, GetUserInfoResponse } from "./user.types"

const debugPermission = false

export const getUserInfo = async () => {
  const { data } = await apiPrivate.get<GetUserInfoResponse>(
    "/check-onboarding/status"
  )
  const userData = data.data
  userData.employee_name = `${userData.first_name} ${userData.last_name ?? ""}`
  if (debugPermission) {
    const blacklist: Permission[] = []
    userData.permissions = userData.permissions.filter(
      (p) => !blacklist.includes(p)
    )
  }
  const allRoleMap = getMapFromPrimitiveArray(Object.values(Roles), () => false)
  const userRoleMap = getMapFromPrimitiveArray(userData.roles, () => true)
  userData.role_map = { ...allRoleMap, ...userRoleMap }
  const allPermissionMap = getMapFromPrimitiveArray(
    allPermissions as unknown as string[],
    () => false
  )
  const userPermissionMap = getMapFromPrimitiveArray(
    userData.permissions,
    () => true
  )
  userData.permission_map = { ...allPermissionMap, ...userPermissionMap }
  return userData
}

export const getCsrfToken = async () => {
  const { data } =
    await apiPrivate.get<GetCsrfTokenResponse>("/common/csrf-token")
  const token = data.data
  csrfToken.token = token
  return token
}
