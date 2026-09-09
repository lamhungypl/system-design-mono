import { useMutation, useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

import { addFaqSetting, deleteFaqSetting, updateFaqSetting } from "./faq.api"
import { GetFaqSettingPayload } from "./faq.types"
import {
  AddFaqSettingMutationOptions,
  DeleteFaqSettingMutationOptions,
  faqKeys,
  faqQueriesOptions,
  GetFaqSettingQueryOptions,
  UpdateFaqSettingMutationOptions,
  ViewFaqSettingQueryOptions,
} from "./query-keys-factories"

export const useFaqSettingsQuery = (
  payload: GetFaqSettingPayload,
  options?: GetFaqSettingQueryOptions
) => {
  return useQuery(faqQueriesOptions.settings(payload, options))
}

export const useAddFaqSettingMutation = (
  options?: AddFaqSettingMutationOptions
) => {
  const { t } = useTranslation()
  return useMutation({
    ...options,
    mutationFn: addFaqSetting,
    mutationKey: faqKeys.add(),
    meta: {
      ...options?.meta,
      invalidates: [faqKeys.settings()],
      successMessage: t("common.toast_messages.success.added"),
    },
  })
}

export const useUpdateFaqSettingMutation = (
  options?: UpdateFaqSettingMutationOptions
) => {
  const { t } = useTranslation()
  return useMutation({
    ...options,
    mutationFn: updateFaqSetting,
    mutationKey: faqKeys.update(),
    meta: {
      ...options?.meta,
      invalidates: [faqKeys.settings()],
      successMessage: t("common.toast_messages.success.changed"),
    },
  })
}

export const useDeleteFaqSettingMutation = (
  options?: DeleteFaqSettingMutationOptions
) => {
  const { t } = useTranslation()
  return useMutation({
    ...options,
    mutationFn: deleteFaqSetting,
    mutationKey: faqKeys.delete(),
    meta: {
      ...options?.meta,
      invalidates: [faqKeys.settings()],
      successMessage: t("common.toast_messages.success.deleted"),
    },
  })
}

export const useViewFaqSettingQuery = (
  options?: ViewFaqSettingQueryOptions
) => {
  return useQuery(faqQueriesOptions.view(options))
}
