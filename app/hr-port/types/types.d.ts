import "@tanstack/react-query"

import { InvalidateQueryFilters, QueryKey } from "@tanstack/react-query"

type MessageBuilder = (data: any) => string
type QueryToast = {
  disableToast?: boolean
  disableToastError?: boolean
  disableToastSuccess?: boolean
  errorMessage?: string | MessageBuilder
  successMessage?: string
  title?: string
}

type InvalidatesBuilder = <TData, TVariable>({
  data: TData,
  variable: TVariable,
}) => InvalidateQueryFilters

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      invalidates?: Array<QueryKey> | InvalidatesBuilder
    } & QueryToast

    queryMeta: {} & QueryToast
  }
}
