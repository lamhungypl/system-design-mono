// app/components/date-range-picker/DateRangePickerPresets.tsx
import { RadioGroup, Radio } from "@base-ui/react"
import { CalendarIcon } from "lucide-react"

import { cn } from "~/lib/utils"
import { PRESETS, formatDate } from "~/lib/dateUtils"
import {
  useDateRangePickerContext,
  type PresetsSlotProps,
} from "./DateRangePickerContext"

export function DateRangePickerPresets(props: PresetsSlotProps) {
  const {
    effectiveRange,
    commitRange,
    activePreset,
    setActivePreset,
    setOpenToDate,
    setViewMode,
    disabled,
    presetsSlot,
  } = useDateRangePickerContext()

  // Direct props override slotProps from Root
  const { presets = PRESETS, className } = { ...presetsSlot, ...props }

  const startDate = effectiveRange.start
  const endDate = effectiveRange.end

  const rangeLabel =
    startDate && endDate
      ? `${formatDate(startDate)} → ${formatDate(endDate)}`
      : startDate
        ? `${formatDate(startDate)} → ...`
        : "Select a date range"

  function handlePresetChange(id: string) {
    const p = presets.find((x) => x.id === id)
    if (!p) return
    setActivePreset(id)
    if (p.getRange) {
      const r = p.getRange()
      commitRange(r)
      setOpenToDate(r.start)
    } else {
      commitRange({ start: null, end: null })
      setOpenToDate(new Date())
    }
    setViewMode("days")
  }

  return (
    <div
      className={cn(
        "flex w-56 flex-col border-l border-border",
        className,
      )}
    >
      {/* Range display */}
      <div
        className="flex items-center gap-2 border-b border-border px-4 py-3"
        aria-live="polite"
        aria-atomic="true"
        aria-label={`Selected range: ${rangeLabel}`}
      >
        <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{rangeLabel}</span>
      </div>

      {/* Preset list */}
      <RadioGroup
        className="flex flex-col py-1"
        value={activePreset}
        onValueChange={handlePresetChange}
        aria-label="Date range presets"
        disabled={disabled}
      >
        {presets.map((p) => (
          <Radio.Root
            key={p.id}
            value={p.id}
            className={cn(
              "flex w-full cursor-pointer items-center px-4 py-2.5 text-sm transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
              "hover:bg-accent hover:text-accent-foreground",
              activePreset === p.id
                ? "bg-accent/60 font-medium text-accent-foreground"
                : "text-foreground",
              disabled && "cursor-not-allowed",
            )}
          >
            {p.label}
          </Radio.Root>
        ))}
      </RadioGroup>
    </div>
  )
}
