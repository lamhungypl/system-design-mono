import {
  DefaultError,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query"

import { getFaqSettings, getViewFaqSettings } from "./faq.api"
import {
  AddFaqSettingPayload,
  DeleteFaqSettingPayload,
  GetFaqSettingPayload,
  GetFaqSettingsResult,
  UpdateFaqSettingPayload,
  ViewFaqSettingsMap,
} from "./faq.types"

export const faqKeys = {
  all: ["faq"] as const,
  settings: (payload?: GetFaqSettingPayload) =>
    [...faqKeys.all, "settings", payload].filter(Boolean),
  add: () => [...faqKeys.all, "add"] as const,
  update: () => [...faqKeys.all, "update"] as const,
  delete: () => [...faqKeys.all, "delete"] as const,
  view: () => [...faqKeys.all, "view"] as const,
}

export type GetFaqSettingQueryOptions = Partial<
  UseQueryOptions<
    GetFaqSettingsResult,
    DefaultError,
    GetFaqSettingsResult,
    ReturnType<typeof faqKeys.settings>
  >
>

export type AddFaqSettingMutationOptions = Partial<
  UseMutationOptions<unknown, DefaultError, AddFaqSettingPayload>
>

export type UpdateFaqSettingMutationOptions = Partial<
  UseMutationOptions<unknown, DefaultError, UpdateFaqSettingPayload>
>

export type DeleteFaqSettingMutationOptions = Partial<
  UseMutationOptions<unknown, DefaultError, DeleteFaqSettingPayload>
>

export type ViewFaqSettingQueryOptions = Partial<
  UseQueryOptions<
    ViewFaqSettingsMap,
    DefaultError,
    ViewFaqSettingsMap,
    ReturnType<typeof faqKeys.view>
  >
>

export const faqQueriesOptions = {
  settings: (
    payload: GetFaqSettingPayload,
    options?: GetFaqSettingQueryOptions
  ) => ({
    ...options,
    queryKey: faqKeys.settings(payload),
    queryFn: () => getFaqSettings(payload),
  }),
  view: (options?: ViewFaqSettingQueryOptions) => ({
    ...options,
    queryKey: faqKeys.view(),
    queryFn: () => getViewFaqSettings(),
  }),
}
