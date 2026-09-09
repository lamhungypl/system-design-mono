import {
  matchQuery,
  MutationCache,
  QueryCache,
  QueryClient,
} from "@tanstack/react-query"

import i18n from "~/hr-port/config/i18n"
import { narrowArray } from "~/hr-port/features/common/utils"
import { toast } from "~/hr-port/hooks/lib/use-toast"

const t = i18n.t

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // throwOnError: true,
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 1000 * 5,
      structuralSharing: false,
    },
  },
  queryCache: new QueryCache({
    onError: (_error, query) => {
      if (!query.meta?.disableToast) {
        const errorMessage =
          typeof query?.meta?.errorMessage === "function"
            ? query?.meta?.errorMessage(_error)
            : query?.meta?.errorMessage
        toast({
          variant: "destructive",
          title: t("common.toast_messages.error.title"),
          description: errorMessage ?? t("common.toast_messages.error.system"),
        })
      }
    },
  }),
  mutationCache: new MutationCache({
    onSuccess: (data, variable, _context, mutation) => {
      const enableToast =
        !mutation.meta?.disableToast && !mutation.meta?.disableToastSuccess
      if (enableToast) {
        toast({
          variant: "success",
          title:
            mutation?.meta?.title ?? t("common.toast_messages.success.title"),
          description: mutation?.meta?.successMessage,
        })
      }
      const invalidates = mutation.meta?.invalidates
      if (narrowArray(invalidates)) {
        queryClient.invalidateQueries({
          predicate: (query) =>
            // invalidate all matching tags at once
            invalidates?.some((queryKey) => matchQuery({ queryKey }, query)) ??
            false,
        })
      } else if (invalidates) {
        queryClient.invalidateQueries(invalidates({ data, variable }))
      }
    },

    onError: (_error, _variables, _context, mutation) => {
      const enableToast =
        !mutation.meta?.disableToast && !mutation.meta?.disableToastError

      if (enableToast) {
        const errorMessage =
          typeof mutation?.meta?.errorMessage === "function"
            ? mutation?.meta?.errorMessage(_error)
            : mutation?.meta?.errorMessage
        toast({
          variant: "destructive",
          title:
            mutation?.meta?.title ?? t("common.toast_messages.error.title"),
          description: errorMessage ?? t("common.toast_messages.error.system"),
        })
      }
    },
  }),
})
