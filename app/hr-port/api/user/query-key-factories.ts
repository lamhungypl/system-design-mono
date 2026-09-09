import { queryOptions } from "@tanstack/react-query"

import { getCsrfToken, getUserInfo } from "~/hr-port/api/user/user.api"
import { UserInfo } from "~/hr-port/api/user/user.types"
import { QueryKey } from "~/hr-port/constants"
import { QueryOptions } from "~/hr-port/types/react-query"

export const userKeys = {
  all: [QueryKey.USER] as const,
  details: [QueryKey.USER, "detail"] as const,
  csrfToken: [QueryKey.USER, "csrf-token"] as const,
}

export type UserQueryOptions = QueryOptions<UserInfo, typeof userKeys.details>
export type CsrfTokenQueryOptions = QueryOptions<
  string,
  typeof userKeys.csrfToken
>

export const userQueriesOptions = {
  details: (options?: UserQueryOptions) =>
    queryOptions({
      queryKey: [...userKeys.details],
      queryFn: () => getUserInfo(),
      staleTime: 5 * 60 * 1000,
      ...options,
      meta: { disableToast: true, ...options?.meta },
    }),
  csrfToken: (options?: CsrfTokenQueryOptions) =>
    queryOptions({
      queryKey: [...userKeys.csrfToken],
      queryFn: () => getCsrfToken(),
      ...options,
      meta: { disableToast: true, ...options?.meta },
    }),
}
