// app/components/date-range-picker/DateRangePicker.tsx
import { DateRangePickerRoot } from "./DateRangePickerRoot"
import { DateRangePickerCalendar } from "./DateRangePickerCalendar"
import { DateRangePickerPresets } from "./DateRangePickerPresets"

export type { DateRangePickerProps } from "./DateRangePickerRoot"
export type { CalendarSlotProps, PresetsSlotProps } from "./DateRangePickerContext"

export const DateRangePicker = Object.assign(DateRangePickerRoot, {
  Calendar: DateRangePickerCalendar,
  Presets: DateRangePickerPresets,
})
