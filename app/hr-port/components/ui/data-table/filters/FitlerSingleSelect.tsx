import { RowData } from "@tanstack/react-table"

import FormLayout from "~/hr-port/components/form/form-layout/form-layout"
import { TableFilterComponentProps } from "~/hr-port/components/ui/data-table/types"
import Select, { SelectProps } from "~/hr-port/components/ui/select/Select"

type Props<T extends RowData> = Partial<SelectProps> &
  TableFilterComponentProps<T>

const FilterSingleSelect = <T,>(props: Props<T>) => {
  const {
    title,
    column,
    options,
    placeholder,
    showSelectAllOption = true,
    ...rest
  } = props
  const { getFilterValue, setFilterValue, id, columnDef } = column
  const filterValue = getFilterValue() as string

  const label = title || columnDef.header?.toString() || id

  return (
    <FormLayout label={label} vertical>
      <Select
        {...rest}
        value={filterValue}
        onChange={(value) => {
          setFilterValue(value)
        }}
        options={options}
        placeholder={placeholder}
        showSelectAllOption={showSelectAllOption}
      />
    </FormLayout>
  )
}

export default FilterSingleSelect
