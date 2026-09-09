import { RowData } from "@tanstack/react-table"
import { useTranslation } from "react-i18next"

import MultiSelect, {
  MultiSelectProps,
} from "~/hr-port/components/base/multi-select"
import FormLayout from "~/hr-port/components/form/form-layout/form-layout"
import { TableFilterComponentProps } from "~/hr-port/components/ui/data-table/types"

type Props<T extends RowData> = Partial<MultiSelectProps> &
  TableFilterComponentProps<T>

const FilterMultiSelect = <T,>(props: Props<T>) => {
  const { t } = useTranslation()
  const {
    title,
    options,
    column,
    placeholder,
    clearPlaceholder = t("common.select_option.all"),
    ...rest
  } = props
  const { setFilterValue, getFilterValue, id, columnDef } = column
  const rawValue = getFilterValue()
  const isRawValueMultiple = Array.isArray(rawValue)
  let filterValue = []
  if (rawValue) {
    filterValue = isRawValueMultiple ? rawValue : [rawValue]
  }
  const isEmptyFilter =
    !filterValue || (Array.isArray(filterValue) && filterValue.length === 0)
  const optionsParse =
    options?.map((item) => ({
      label: item.label.toString(),
      value: item.value.toString(),
    })) || []

  const label = title || columnDef.header?.toString() || id

  return (
    <FormLayout label={label} vertical>
      <MultiSelect
        {...rest}
        onChange={(value) => {
          setFilterValue(value)
        }}
        value={filterValue}
        options={optionsParse}
        clearPlaceholder={clearPlaceholder}
        placeholder={
          isEmptyFilter ? (placeholder ?? clearPlaceholder) : placeholder
        }
      />
    </FormLayout>
  )
}

export default FilterMultiSelect
