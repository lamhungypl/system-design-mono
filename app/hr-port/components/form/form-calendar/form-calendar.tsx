import { FC, useMemo } from "react"
import { useController, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"

import CalendarPicker from "~/hr-port/components/base/calendar/calendar-picker"
import FormFieldViewOnly from "~/hr-port/components/form/form-field-view-only/form-field-view-only"
import { formatDateDisplay } from "~/hr-port/features/common/utils/datetime"
import { date_db_format, dateToString } from "~/hr-port/utils/date"
import { parseDate } from "~/hr-port/utils/date-utils"
import { cn } from "~/hr-port/utils/style"

import FormLayout from "../form-layout/form-layout"
import { FormFieldProps } from "../types"

interface FormCalendarProps extends FormFieldProps {
  disabled?: boolean
  displayFormat?: string
  required?: boolean
  valueFormat?: string
}

const FormCalendar: FC<FormCalendarProps> = (props) => {
  const { t } = useTranslation()

  const {
    name,
    label,
    required,
    disabled,
    viewOnly,
    vertical,
    tooltip,
    valueFormat = date_db_format,
    displayFormat = t("common.date_format"),
    className,
  } = props
  const { control } = useFormContext()
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  })

  const isError = !!error

  const dateValue = useMemo(() => {
    if (!field.value) return null
    const parsedDate = parseDate(field.value, valueFormat, undefined, true)
    if (!parsedDate) return null
    return parsedDate
  }, [field.value, valueFormat])

  if (viewOnly) {
    return (
      <FormFieldViewOnly
        {...props}
        transformValue={() => {
          return formatDateDisplay(dateValue, {
            toFormat: displayFormat,
          })
        }}
      />
    )
  }

  return (
    <FormLayout
      label={label}
      tooltip={tooltip}
      error={error?.message}
      required={required}
      vertical={vertical}
    >
      <CalendarPicker
        {...field}
        displayFormat={displayFormat}
        disabled={disabled}
        value={dateValue}
        onChange={(newDate) => {
          console.log(newDate, dateToString(newDate, valueFormat))
          if (!newDate) {
            field.onChange("")
          } else {
            field.onChange(dateToString(newDate, valueFormat))
          }
        }}
        onBlur={() => {
          field.onBlur()
        }}
        slotProps={{
          input: {
            className: cn(
              {
                "border-action-red": isError,
              },
              className
            ),
          },
        }}
      />
    </FormLayout>
  )
}

export default FormCalendar
