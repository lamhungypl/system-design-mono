import { apiPrivate } from "~/hr-port/config/axios"
import { Language } from "~/hr-port/constants"

import {
  AddFaqSettingPayload,
  DeleteFaqSettingPayload,
  FaqSetting,
  GetFaqSettingPayload,
  GetFaqSettingsResponse,
  GetFaqSettingsResult,
  GetViewFaqSettingsResponse,
  UpdateFaqSettingPayload,
  ViewFaqSettings,
  ViewFaqSettingsMap,
} from "./faq.types"

export const getFaqSettings = async (payload: GetFaqSettingPayload) => {
  const { data } = await apiPrivate.get<GetFaqSettingsResponse>(
    "/master/faqs/setting/get",
    {
      params: {
        language: payload.language.toUpperCase(),
      },
    }
  )

  const items: FaqSetting[] = data.data.flatMap((groupInfo) => {
    return groupInfo.items.map(
      (item) =>
        ({
          id: item.id,
          group: groupInfo.group,
          screen: item.screen,
          resource_url: item.resource_url,
          updated_at: item.uploaded_time,
          updated_by: item.uploaded_by,
          uploaders: item.uploaders.map((uploader) => ({
            id: uploader.file_id,
            file_name: uploader.file_name,
            file_path: uploader.file_path,
            order: uploader.order,
          })),
          last_modified_at: item.last_modified_at,
        }) satisfies FaqSetting
    )
  })

  const screens = data.data.flatMap((groupInfo) => {
    return groupInfo.screens
  })

  return { items, screens } satisfies GetFaqSettingsResult
}

export const addFaqSetting = async (payload: AddFaqSettingPayload) => {
  return await apiPrivate.post("/master/faqs/setting/create", payload)
}

export const updateFaqSetting = async (payload: UpdateFaqSettingPayload) => {
  return await apiPrivate.post("/master/faqs/setting/update", payload)
}

export const deleteFaqSetting = async (payload: DeleteFaqSettingPayload) => {
  return await apiPrivate.post("/master/faqs/setting/delete", {
    ...payload,
    language: payload.language.toUpperCase(),
  })
}

export const getViewFaqSettings = async () => {
  const { data } = await apiPrivate.get<GetViewFaqSettingsResponse>(
    "master/faqs/view-guidelines"
  )
  const result = data.data.reduce((prev, curr) => {
    prev[curr.screen] = curr.items.reduce(
      (prev, curr) => {
        prev[curr.language.toLowerCase() as Language] = {
          resource_url: curr.resource_url,
          files: curr.files.map((file) => ({
            id: file.file_id,
            file_name: file.file_name,
            file_path: file.file_path,
          })),
        }
        return prev
      },
      {} as Record<Language, ViewFaqSettings>
    )
    return prev
  }, {} as ViewFaqSettingsMap)

  return result
}
