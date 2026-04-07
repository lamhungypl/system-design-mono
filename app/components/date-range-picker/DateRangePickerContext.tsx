import { createContext, useContext } from "react"
import type { DateRange, Preset } from "~/lib/dateUtils"

export interface CalendarSlotProps {
  minDate?: Date
  maxDate?: Date
  /** Initial month to display. Changes after mount are ignored by Root (used only for initial state). */
  openToDate?: Date
  className?: string
}

export interface PresetsSlotProps {
  /** Override the default preset list. */
  presets?: Preset[]
  /** Hide the preset panel entirely; calendar fills full width. */
  hidden?: boolean
  className?: string
}

type ViewMode = "days" | "months"

export interface DateRangePickerContextValue {
  // Value
  effectiveRange: DateRange
  commitRange: (next: DateRange) => void

  // UI state
  activePreset: string
  setActivePreset: (id: string) => void
  viewMode: ViewMode
  setViewMode: (v: ViewMode) => void
  openToDate: Date
  setOpenToDate: (d: Date | ((prev: Date) => Date)) => void

  // Config
  disabled: boolean
  calendarSlot?: CalendarSlotProps
  presetsSlot?: PresetsSlotProps
}

export const DateRangePickerContext =
  createContext<DateRangePickerContextValue | null>(null)

export function useDateRangePickerContext(): DateRangePickerContextValue {
  const ctx = useContext(DateRangePickerContext)
  if (!ctx) {
    throw new Error(
      "useDateRangePickerContext must be used inside DateRangePickerRoot",
    )
  }
  return ctx
}
