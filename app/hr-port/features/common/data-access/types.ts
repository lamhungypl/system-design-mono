import { QueryClient } from "@tanstack/react-query"
import { LoaderFunction } from "react-router"

import { ApiResponse } from "~/hr-port/types/common"

export type AppRouteLoader<Context = any> = (
  queryclient: QueryClient
) => LoaderFunction<Context>

export type PageParams = {
  page: number
  search: string
  size: number
  sort: string
}

export type ResponseList<
  TData,
  TSummaryData extends Record<string, any> = {},
> = ApiResponse<
  {
    content: TData[]
    empty: boolean
    has_next?: boolean
    has_previous?: boolean
    page: number
    size: number
    total_elements: number
    total_pages: number
  } & TSummaryData
>

export type ResponseListAll<TData> = ApiResponse<TData[]>
