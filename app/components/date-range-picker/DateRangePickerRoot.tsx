// app/components/date-range-picker/DateRangePickerRoot.tsx
import { useState } from "react"

import { cn } from "~/lib/utils"
import { type DateRange } from "~/lib/dateUtils"
import {
  DateRangePickerContext,
  type CalendarSlotProps,
  type PresetsSlotProps,
} from "./DateRangePickerContext"
import { DateRangePickerCalendar } from "./DateRangePickerCalendar"
import { DateRangePickerPresets } from "./DateRangePickerPresets"

export interface DateRangePickerProps {
  /** Controlled value. When provided, internal state is ignored. */
  value?: DateRange
  /** Initial value for uncontrolled mode. */
  defaultValue?: DateRange
  /** Fires on every change regardless of controlled/uncontrolled mode. */
  onChange?: (range: DateRange) => void
  /** For form association (e.g. passed by react-hook-form Controller). */
  name?: string
  disabled?: boolean
  /**
   * Opt-in composition. When omitted, the default layout
   * (Calendar + Presets) is rendered automatically.
   */
  children?: React.ReactNode
  slotProps?: {
    calendar?: CalendarSlotProps
    presets?: PresetsSlotProps
  }
}

export function DateRangePickerRoot({
  value,
  defaultValue,
  onChange,
  name,
  disabled = false,
  children,
  slotProps,
}: DateRangePickerProps) {
  const calendarSlot = slotProps?.calendar
  const presetsSlot = slotProps?.presets

  // Controlled / uncontrolled value
  const [internalRange, setInternalRange] = useState<DateRange>(
    defaultValue ?? { start: null, end: null },
  )
  const effectiveRange = value ?? internalRange

  function commitRange(next: DateRange) {
    if (value === undefined) setInternalRange(next)
    onChange?.(next)
  }

  // UI-only state
  const [activePreset, setActivePreset] = useState<string>("custom")
  const [viewMode, setViewMode] = useState<"days" | "months">("days")
  const [openToDate, setOpenToDate] = useState<Date>(
    calendarSlot?.openToDate ?? new Date(),
  )

  // Default layout when no children are provided.
  // presetsSlot.hidden is checked here so the component is never mounted in the
  // default layout. When children are provided explicitly, callers control rendering
  // and this guard is not reached.
  const content = children ?? (
    <>
      <DateRangePickerCalendar />
      {!presetsSlot?.hidden && <DateRangePickerPresets />}
    </>
  )

  return (
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
        calendarSlot,
        presetsSlot,
      }}
    >
      <div
        className={cn(
          "flex w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-card shadow-sm",
          disabled && "pointer-events-none opacity-60",
        )}
        aria-disabled={disabled || undefined}
        data-name={name}
      >
        {content}
      </div>
    </DateRangePickerContext.Provider>
  )
}
