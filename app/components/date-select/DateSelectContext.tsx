// app/components/date-select/DateSelectContext.tsx
import { createContext, useContext } from "react"

export interface DateSelectContextValue {
  effectiveValue: Date | null
  commitValue: (date: Date | null) => void
  /** Close the popover — called by the calendar after a date is selected. */
  setOpen: (open: boolean) => void
  disabled: boolean
  minDate?: Date
  maxDate?: Date
}

export const DateSelectContext = createContext<DateSelectContextValue | null>(null)

export function useDateSelectContext(): DateSelectContextValue {
  const ctx = useContext(DateSelectContext)
  if (!ctx)
    throw new Error("useDateSelectContext must be used inside DateSelect")
  return ctx
}
