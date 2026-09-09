import { useQuery } from "@tanstack/react-query"

import {
  CsrfTokenQueryOptions,
  userQueriesOptions,
  UserQueryOptions,
} from "~/hr-port/api/user/query-key-factories"

export function useUserQuery(options?: UserQueryOptions) {
  const query = useQuery(userQueriesOptions.details(options))

  return query
}

export function useCsrfTokenQuery(options?: CsrfTokenQueryOptions) {
  const query = useQuery(userQueriesOptions.csrfToken(options))

  return query
}
