import { apiPrivate } from "~/hr-port/config/axios"
import {
  RegionCodeToRegionCurrency,
  RegionCodeToRegionCurrencySymbol,
} from "~/hr-port/constants"
import { getMapFromArray } from "~/hr-port/utils/object"

import {
  GetRegionSettingResponse,
  RegionSettingMap,
} from "./region-setting.types"

export const getRegionSetting = async () => {
  const { data } = await apiPrivate.get<GetRegionSettingResponse>(
    "/master/region-setting/list-all"
  )

  const regionSettings = data.data

  const regionSettingsMap = getMapFromArray(regionSettings, "key", (item) => {
    if (item.value === null) return null
    if (item.value_type === "TEXT") return item.value
    if (item.value_type === "NUMBER") return parseInt(item.value)
    if (item.value_type === "DECIMAL") return parseFloat(item.value)
    return null
  }) as RegionSettingMap

  regionSettingsMap.region_currency =
    RegionCodeToRegionCurrency[regionSettingsMap.region_code]
  regionSettingsMap.region_currency_symbol =
    RegionCodeToRegionCurrencySymbol[regionSettingsMap.region_code]
  return regionSettingsMap
}
