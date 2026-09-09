import { apiPrivate } from "~/hr-port/config/axios"

import { GetLanguagePayload } from "./language.types"

export const getLanguage = async (payload: GetLanguagePayload) => {
  const response = await apiPrivate.get("master/file/language", {
    params: payload,
  })
  return response.data
}
