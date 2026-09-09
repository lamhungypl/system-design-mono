import { RowData } from "@tanstack/react-table"
import { useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import CalendarPicker, {
  CalendarPickerProps,
} from "~/hr-port/components/base/calendar/calendar-picker"
import FormLayout from "~/hr-port/components/form/form-layout/form-layout"
import { TableFilterComponentProps } from "~/hr-port/components/ui/data-table/types"
import {
  date_db_format,
  dateToString,
  isDateInRange,
  stringToDate,
} from "~/hr-port/utils/date"

type Props<T extends RowData> = {
  /**
   * @description Received from API - The format of the date string in the input field.
   * @default 'yyyy-MM-dd'
   */
  valueFormat?: string
} & Partial<CalendarPickerProps> &
  TableFilterComponentProps<T>

export const FilterCalendar = <T,>(props: Props<T>) => {
  const { title, column, valueFormat = date_db_format, ...rest } = props
  const { t } = useTranslation()
  const { getFilterValue, setFilterValue, id, columnDef } = column
  const filterValue = getFilterValue() as string

  const label = title || columnDef.header?.toString() || id

  const tempDate = useRef<Date | null>(null)

  const dateValue = useMemo<Date | null>(
    () => (filterValue ? stringToDate(filterValue, valueFormat) : null),
    [filterValue, valueFormat]
  )

  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    tempDate.current = dateValue
    if (dateValue) {
      const validDate = isDateInRange(dateValue)
      setErrorMessage(
        !validDate ? t("common.validation.date.default_rule") : ""
      )
    } else {
      setErrorMessage("")
    }
  }, [dateValue, t])

  return (
    <FormLayout label={label} error={errorMessage} vertical>
      <CalendarPicker
        {...rest}
        defaultValue={dateValue}
        onChange={(date) => {
          tempDate.current = date
        }}
        onBlur={() => {
          setFilterValue(dateToString(tempDate.current, valueFormat))
        }}
      />
    </FormLayout>
  )
}
