import { useCallback } from "react"

import { useUserQuery } from "~/hr-port/api/user/user.query"
import { Roles } from "~/hr-port/constants"
import { Permission } from "~/hr-port/features/permissions/constants"
import { hasPermissions, hasRoles } from "~/hr-port/features/permissions/utils"

/**
 *
 * @description check required roles & permissions in the context inside App - which can use hook.
 *
 * When it's necessary to check roles & permission outside of react, use the `requirePermissions` / `requireRoles` function accordingly.
 *
 */
export const usePermissions = () => {
  const { data: user } = useUserQuery()

  const userHasRoles = useCallback(
    (roles: Roles[]) => hasRoles(user?.role_map, roles),
    [user?.role_map]
  )

  const userHasPermission = useCallback(
    (...permissions: Array<Permission>[]) =>
      hasPermissions(user?.permission_map, ...permissions),
    [user?.permission_map]
  )

  return { userHasRoles, userHasPermission }
}
