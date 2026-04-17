import ReactDatePicker from "react-datepicker"

import { useDatePickerContext } from "./DatePickerContext"
import { DayViewHeader } from "./DayViewHeader"
import { MonthGridView } from "./MonthGridView"
import "../date-range-picker/date-range-picker.css"

export function DatePickerCalendar() {
  const {
    effectiveValue,
    commitValue,
    setOpen,
    disabled,
    minDate,
    maxDate,
    viewMode,
    setViewMode,
    openToDate,
    setOpenToDate,
    calendarRef,
  } = useDatePickerContext()

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
    <div ref={calendarRef} className="rdp-custom p-4">
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
        <ReactDatePicker
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
          calendarClassName="!border-0 !shadow-none !bg-transparent"
        />
      )}
    </div>
  )
}
