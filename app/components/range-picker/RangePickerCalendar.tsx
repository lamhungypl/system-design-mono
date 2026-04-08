import { DateRangePickerContext } from "~/components/date-range-picker/DateRangePickerContext"
import { DateRangePickerCalendar } from "~/components/date-range-picker/DateRangePickerCalendar"
import { useRangePickerContext } from "./RangePickerContext"

export function RangePickerCalendar() {
  const {
    effectiveRange,
    commitRange,
    activePreset,
    setActivePreset,
    viewMode,
    setViewMode,
    openToDate,
    setOpenToDate,
    disabled,
    calendarRef,
  } = useRangePickerContext()

  return (
    <div ref={calendarRef}>
    <DateRangePickerContext.Provider
      value={{
        effectiveRange,
        commitRange,
        activePreset,
        setActivePreset,
        viewMode,
        setViewMode,
        openToDate,
        setOpenToDate,
        disabled,
        calendarSlot: undefined,
        presetsSlot: undefined,
      }}
    >
      <DateRangePickerCalendar />
    </DateRangePickerContext.Provider>
    </div>
  )
}
