import { createContext, useContext, type RefObject } from "react"
import type { DateRange } from "~/lib/dateUtils"

export interface RangePickerContextValue {
  effectiveRange: DateRange
  commitRange: (next: DateRange) => void
  setOpen: (open: boolean) => void
  disabled: boolean
  minDate?: Date
  maxDate?: Date
  activePreset: string
  setActivePreset: (id: string) => void
  viewMode: "days" | "months"
  setViewMode: (v: "days" | "months") => void
  openToDate: Date
  setOpenToDate: (d: Date | ((prev: Date) => Date)) => void
  /** Ref to the calendar wrapper — used to focus the first day cell. */
  calendarRef: RefObject<HTMLDivElement | null>
}

export const RangePickerContext = createContext<RangePickerContextValue | null>(
  null
)

export function useRangePickerContext(): RangePickerContextValue {
  const ctx = useContext(RangePickerContext)
  if (!ctx)
    throw new Error("useRangePickerContext must be used inside RangePicker")
  return ctx
}
