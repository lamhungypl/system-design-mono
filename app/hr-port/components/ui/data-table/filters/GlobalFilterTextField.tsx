import { RowData, Table } from "@tanstack/react-table"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useDebouncedCallback } from "use-debounce"

import FormLayout from "~/hr-port/components/form/form-layout/form-layout"
import AppInput, {
  AppInputProps,
} from "~/hr-port/components/ui/app-input/app-input"
import { TableFilterComponentProps } from "~/hr-port/components/ui/data-table/types"
import { NON_BREAKING_SPACE } from "~/hr-port/features/common/constants"
import { cn } from "~/hr-port/utils/style"

type Props<T extends RowData> = {
  debounceTime?: number
  table: Table<T>
} & AppInputProps &
  Partial<Pick<TableFilterComponentProps<T>, "title">>

const GlobalFilterTextField = <T extends RowData>(props: Props<T>) => {
  const { t } = useTranslation()
  const {
    title,
    table,
    placeholder = t("common.placeholder.search"),
    debounceTime = 300,
    ...rest
  } = props
  const { getState, setGlobalFilter } = table
  const { globalFilter } = getState()

  const debouncedSetGlobalFilterSearch = useDebouncedCallback(
    (keyword: string) => setGlobalFilter(keyword || undefined),
    debounceTime
  )
  const [searchValue, setSearchValue] = useState(globalFilter || "")

  //NOTE: Need manually reset search value because of the debounced update
  useEffect(() => {
    if (!globalFilter) {
      setSearchValue("")
    }
  }, [globalFilter, setSearchValue])

  return (
    <FormLayout
      label={title}
      vertical
      labelClassName={cn({
        invisible: title === NON_BREAKING_SPACE,
      })}
    >
      <AppInput
        {...rest}
        prefix={<Search />}
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => {
          const nextValue = e.target.value
          setSearchValue(nextValue)
          debouncedSetGlobalFilterSearch(nextValue)
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
          }
        }}
      />
    </FormLayout>
  )
}

export default GlobalFilterTextField
