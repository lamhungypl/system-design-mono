import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons"
import { setDay, setMonth } from "date-fns"
import { useMemo } from "react"
import DatePicker, {
  DatePickerProps,
  ReactDatePickerCustomHeaderProps,
} from "react-datepicker"

import { Language } from "~/hr-port/constants"
import { formatDateDisplay } from "~/hr-port/features/common/utils/datetime"
import { useLanguage } from "~/hr-port/lib/language/hooks/use-language"
import { SelectOption } from "~/hr-port/types/common"

import Select from "../../ui/select/Select"

import "react-datepicker/dist/react-datepicker.css"
import "./calender.scss"

export type CalendarProps = {
  // NOTE: Constrain DatePicker only allow single date selection
  selectsMultiple?: never
  selectsRange?: never
} & DatePickerProps

export const Calendar = (props: CalendarProps) => {
  const { language } = useLanguage()
  const weekdays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) =>
        formatDateDisplay(setDay(new Date(), i), {
          toFormat: "EEE",
        })
      ),
    []
  )

  const monthOptions = useMemo(() => {
    const monthNames = Array.from({ length: 12 }, (_, i) =>
      formatDateDisplay(setMonth(new Date(), i), {
        toFormat: "MMM",
      })
    )
    return monthNames.map((monthName, index) => ({
      value: index.toString(),
      label: monthName,
    }))
  }, [])

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const years = Array.from(
      { length: currentYear + 100 - 1900 + 1 },
      (_, i) => 1900 + i
    )
    return years.map((year) => ({
      value: year.toString(),
      label: (year + (language === Language.TH ? 543 : 0)).toString(),
    }))
  }, [language])

  return (
    <DatePicker
      inline
      renderCustomHeader={CustomHeader({ monthOptions, weekdays, yearOptions })}
      calendarClassName="text-xs"
      renderDayContents={(day) => (
        <div className="inline-flex h-8 w-8 items-center justify-center text-xs">
          {day}
        </div>
      )}
      {...props}
    />
  )
}

type CustomHeaderProps = {
  monthOptions: SelectOption[]
  weekdays: string[]
  yearOptions: SelectOption[]
}

const CustomHeader =
  ({ monthOptions, weekdays, yearOptions }: CustomHeaderProps) =>
  ({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
  }: ReactDatePickerCustomHeaderProps) => {
    return (
      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          {/* Previous Month Button */}
          <button
            onClick={(event) => {
              event.preventDefault()
              decreaseMonth()
            }}
            name="previous-month"
            aria-label="Go to previous month"
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-input opacity-50 hover:bg-accent hover:opacity-100"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>

          {/* Year Dropdown */}
          <Select
            disablePortal
            allowClear={false}
            value={date.getFullYear().toString()}
            onChange={(value) => changeYear(Number(value))}
            className="min-w-[120px] flex-1 rounded border"
            options={yearOptions}
          />

          {/* Month Dropdown */}
          <Select
            disablePortal
            allowClear={false}
            value={date.getMonth().toString()}
            onChange={(value) => changeMonth(Number(value))}
            className="min-w-[120px] flex-1 rounded border"
            options={monthOptions}
          />

          {/* Next Month Button */}
          <button
            onClick={(event) => {
              event.preventDefault()
              increaseMonth()
            }}
            name="next-month"
            aria-label="Go to next month"
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-input opacity-50 hover:bg-accent hover:opacity-100"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="absolute -bottom-6 left-0 w-full">
          <div className="flex items-center justify-between bg-popover">
            {weekdays.map((day) => (
              <div key={day} className="w-8 text-center text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
