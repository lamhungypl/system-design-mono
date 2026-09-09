import { RowData } from "@tanstack/react-table"
import { ComponentProps } from "react"

import { Switch } from "~/hr-port/components/base/switch"
import FormLayout from "~/hr-port/components/form/form-layout/form-layout"
import { TableFilterComponentProps } from "~/hr-port/components/ui/data-table/types"

type Props<T extends RowData> = Partial<ComponentProps<typeof Switch>> &
  TableFilterComponentProps<T>

const FilterSwitch = <T,>(props: Props<T>) => {
  const { title, column, ...rest } = props
  const { getFilterValue, setFilterValue, id, columnDef } = column
  const filterValue = getFilterValue() as string

  const label = title || columnDef.header?.toString() || id

  return (
    <FormLayout label={label} vertical>
      <div className="flex h-9 items-center">
        <Switch
          {...rest}
          checked={filterValue === "true"}
          onCheckedChange={(value) => {
            setFilterValue(value ? "true" : "false")
          }}
        />
      </div>
    </FormLayout>
  )
}

export default FilterSwitch
