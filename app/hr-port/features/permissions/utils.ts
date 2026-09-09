import { QueryClient } from "@tanstack/react-query"
import { redirect } from "react-router"

import { userQueriesOptions } from "~/hr-port/api/user/query-key-factories"
import { UserInfo } from "~/hr-port/api/user/user.types"
import { Roles } from "~/hr-port/constants"
import { Permission } from "~/hr-port/features/permissions/constants"

import { getPath } from "../common/utils/routers"

export const hasPermissions = (
  permission_map: Record<Permission, boolean> | undefined,
  ...orList: Array<Permission>[]
) => {
  if (!permission_map) return false
  return orList.some((andList) =>
    andList.every((permission) => permission_map[permission])
  )
}

export const hasRoles = (
  role_map: Record<Roles, boolean> | undefined,
  roles: Array<Roles>
) => {
  if (!role_map) return false
  return roles.every((role) => role_map[role])
}

/**
 * Redirects to not-found page if user doesn't have the required permissions
 */
export const requirePermission = async (
  queryClient: QueryClient,
  permissions?: Array<Permission>
) => {
  let user: UserInfo | undefined
  try {
    user = await queryClient.ensureQueryData(userQueriesOptions.details())
  } catch {
    // dont throw here because if user is undefined, ProtectedLayout already handle navigate to error page
    return undefined
  }
  if (permissions && !hasPermissions(user.permission_map, permissions)) {
    throw redirect(getPath("notFound"))
  }
  return null
}

export const requireRole = async (
  queryClient: QueryClient,
  roles?: Array<Roles>
) => {
  const user = await queryClient.ensureQueryData(userQueriesOptions.details())
  if (!user) {
    throw redirect("/login")
  }
  if (roles && !hasRoles(user.role_map, roles)) {
    throw new Error("You don't have role to view this resource")
  }
  return user
}
