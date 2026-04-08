import { createContext, useContext, type RefObject } from "react"

export interface DatePickerContextValue {
  effectiveValue: Date | null
  commitValue: (date: Date | null) => void
  setOpen: (open: boolean) => void
  disabled: boolean
  minDate?: Date
  maxDate?: Date
  viewMode: "days" | "months"
  setViewMode: (v: "days" | "months") => void
  openToDate: Date
  setOpenToDate: (d: Date | ((prev: Date) => Date)) => void
  /** Ref to the calendar wrapper — used to focus the first day cell. */
  calendarRef: RefObject<HTMLDivElement | null>
}

export const DatePickerContext = createContext<DatePickerContextValue | null>(
  null
)

export function useDatePickerContext(): DatePickerContextValue {
  const ctx = useContext(DatePickerContext)
  if (!ctx)
    throw new Error("useDatePickerContext must be used inside DatePicker")
  return ctx
}
