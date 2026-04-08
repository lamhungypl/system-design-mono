// app/components/date-select/DateSelectCalendar/DateSelectCalendar.tsx
import { useState } from "react"
import DatePicker from "react-datepicker"

import { useDateSelectContext } from "../DateSelectContext"
import { DayViewHeader } from "./DayViewHeader"
import { MonthGridView } from "./MonthGridView"
import "../../date-range-picker/date-range-picker.css"

export function DateSelectCalendar() {
  const { effectiveValue, commitValue, setOpen, disabled, minDate, maxDate } =
    useDateSelectContext()

  const [viewMode, setViewMode] = useState<"days" | "months">("days")
  const [openToDate, setOpenToDate] = useState<Date>(
    effectiveValue ?? new Date()
  )

  function handleDateChange(date: Date | null) {
    commitValue(date)
    if (date) setOpen(false)
  }

  function handleMonthSelect(month: number) {
    setOpenToDate(new Date(openToDate.getFullYear(), month, 1))
    setViewMode("days")
  }

  function shiftYear(delta: number) {
    setOpenToDate((d) => new Date(d.getFullYear() + delta, d.getMonth(), 1))
  }

  return (
    <div className="rdp-custom p-4">
      {viewMode === "months" ? (
        <MonthGridView
          year={openToDate.getFullYear()}
          selected={effectiveValue}
          onPrevYear={() => shiftYear(-1)}
          onNextYear={() => shiftYear(1)}
          onPrevDecade={() => shiftYear(-10)}
          onNextDecade={() => shiftYear(10)}
          onMonthSelect={handleMonthSelect}
        />
      ) : (
        <DatePicker
          inline
          selected={effectiveValue ?? undefined}
          onChange={handleDateChange}
          openToDate={openToDate}
          onMonthChange={(date) => setOpenToDate(date)}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          renderCustomHeader={(headerProps) => (
            <DayViewHeader
              {...headerProps}
              onTitleClick={() => setViewMode("months")}
            />
          )}
          calendarClassName="!border-0 !shadow-none !bg-transparent w-full"
        />
      )}
    </div>
  )
}
