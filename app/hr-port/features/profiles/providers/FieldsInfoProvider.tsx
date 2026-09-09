import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react"

import { FieldMap } from "~/hr-port/features/dynamic-form/types"

export type FieldsInfoContext = {
  deductionCheckedMap: Record<string, boolean>
  disableAll?: boolean
  fieldMap: FieldMap
  setDeductionCheckedMap: Dispatch<SetStateAction<Record<string, boolean>>>
  visibleFieldMap?: Record<string, boolean>
  visibleSectionMap?: Record<string, boolean>
}

const fieldsInfoContext = createContext<FieldsInfoContext | undefined>(
  undefined
)

export type FieldsInfoProviderProps = {
  disableAll?: boolean
  fieldMap: FieldMap
  visibleFieldMap?: Record<string, boolean>
  visibleSectionMap?: Record<string, boolean>
}

export default function FieldsInfoProvider({
  children,
  ...props
}: PropsWithChildren<FieldsInfoProviderProps>) {
  const [deductionCheckedMap, setDeductionCheckedMap] = useState<
    Record<string, boolean>
  >({})

  const contextValue = useMemo(
    () => ({ ...props, deductionCheckedMap, setDeductionCheckedMap }),
    [props, deductionCheckedMap]
  )

  return (
    <fieldsInfoContext.Provider value={contextValue}>
      {children}
    </fieldsInfoContext.Provider>
  )
}

export const useFieldsInfo = () => {
  const context = useContext(fieldsInfoContext)

  if (!context) {
    throw new Error("useSectionSum must be used within a SectionSumProvider")
  }

  return context
}
