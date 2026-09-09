import { DefaultError, QueryKey, UseQueryOptions } from "@tanstack/react-query"

/**
 * @description this type is nothing but changing the order of generic args
 */
export type QueryOptions<
  TQueryFnData,
  TKey extends QueryKey = QueryKey,
  TError = DefaultError,
  TData = TQueryFnData,
> = Partial<UseQueryOptions<TQueryFnData, TError, TData, TKey>>
