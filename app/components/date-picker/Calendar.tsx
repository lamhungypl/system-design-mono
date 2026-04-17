"use client"

import { useRef, useState } from "react"
import { cn } from "~/lib/utils"
import { DatePickerContext } from "./DatePickerContext"
import { DatePickerCalendar } from "./DatePickerCalendar"

export interface CalendarProps {
  value?: Date | null
  defaultValue?: Date | null
  onChange?: (date: Date | null) => void
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  className?: string
}

export function Calendar({
  value,
  defaultValue,
  onChange,
  disabled = false,
  minDate,
  maxDate,
  className,
}: CalendarProps) {
  const [internalValue, setInternalValue] = useState<Date | null>(
    defaultValue ?? null
  )
  const effectiveValue = value !== undefined ? value : internalValue

  function commitValue(date: Date | null) {
    if (value === undefined) setInternalValue(date)
    onChange?.(date)
  }

  const [viewMode, setViewMode] = useState<"days" | "months">("days")
  const [openToDate, setOpenToDate] = useState<Date>(
    effectiveValue ?? new Date()
  )
  const calendarRef = useRef<HTMLDivElement>(null)

  return (
    <DatePickerContext.Provider
      value={{
        effectiveValue,
        commitValue,
        setOpen: () => {},
        disabled,
        minDate,
        maxDate,
        viewMode,
        setViewMode,
        openToDate,
        setOpenToDate,
        calendarRef,
      }}
    >
      <div className={cn("w-fit rounded-xl border border-border bg-card shadow-sm overflow-hidden", className)}>
        <DatePickerCalendar />
      </div>
    </DatePickerContext.Provider>
  )
}
