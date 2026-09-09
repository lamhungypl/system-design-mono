import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"

import { useRegionSettingQuery } from "~/hr-port/api/region-setting/region-setting.query"
import { mathjs } from "~/hr-port/utils/math"
import { formatCurrency } from "~/hr-port/utils/money"
import { isData } from "~/hr-port/utils/object"

export type SectionSumContext = {
  hasSumItem: boolean
  setSumItem: (id: string | number, value: number) => void
  sum: string
}

const sectionSumContext = createContext<SectionSumContext | undefined>(
  undefined
)

export default function SectionSumProvider({ children }: PropsWithChildren) {
  const [itemsMap, setItemsMap] = useState<Record<string | number, number>>({})
  const { data: regionSettingMap } = useRegionSettingQuery()

  const sum = useMemo(() => {
    if (!isData(regionSettingMap)) return ""
    const total = Object.values(itemsMap).reduce((prev, curr) => {
      const currNum = Number(curr)
      if (isNaN(currNum)) return prev
      return mathjs.fix(prev + currNum, regionSettingMap.rounding_scale)
    }, 0)

    if (isNaN(total)) return ""

    return formatCurrency(total.toString(), {
      currency: regionSettingMap.region_currency,
      precision: regionSettingMap.rounding_scale,
    })
  }, [itemsMap, regionSettingMap])

  const hasSumItem = useMemo(() => {
    return Object.keys(itemsMap).length > 0
  }, [itemsMap])

  const setSumItem = useCallback((id: string | number, value: number) => {
    setItemsMap((prev) => ({ ...prev, [id]: value }))
  }, [])

  const providerValue = useMemo(
    () => ({
      sum,
      setSumItem,
      hasSumItem,
    }),
    [sum, hasSumItem, setSumItem]
  )

  return (
    <sectionSumContext.Provider value={providerValue}>
      {children}
    </sectionSumContext.Provider>
  )
}

export const useSectionSum = () => {
  const context = useContext(sectionSumContext)

  if (!context) {
    throw new Error("useSectionSum must be used within a SectionSumProvider")
  }

  return context
}
