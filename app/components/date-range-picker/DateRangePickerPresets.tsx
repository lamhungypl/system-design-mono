// app/components/date-range-picker/DateRangePickerPresets.tsx
import { useEffect, useRef, useState } from "react"
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

  // Roving tabindex — tracks which item owns tabIndex=0 (focus position).
  // Arrow keys move focus only; Space/Enter commits the selection.
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [focusedIndex, setFocusedIndex] = useState(() => {
    const i = presets.findIndex((p) => p.id === activePreset)
    return i >= 0 ? i : 0
  })

  // Keep focus position in sync when activePreset changes externally
  // (e.g. calendar date selection resets to "custom").
  useEffect(() => {
    const i = presets.findIndex((p) => p.id === activePreset)
    if (i >= 0) setFocusedIndex(i)
  }, [activePreset]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      const next = (index + 1) % presets.length
      setFocusedIndex(next)
      itemRefs.current[next]?.focus()
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      const prev = (index - 1 + presets.length) % presets.length
      setFocusedIndex(prev)
      itemRefs.current[prev]?.focus()
    } else if (e.key === " " || e.key === "Enter") {
      e.preventDefault()
      handlePresetChange(presets[index].id)
    }
  }

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

      {/* Preset list — listbox pattern: arrows move focus, Space/Enter selects */}
      <div
        role="listbox"
        aria-label="Date range presets"
        aria-orientation="vertical"
        className="flex flex-col py-1"
      >
        {presets.map((p, i) => (
          <button
            key={p.id}
            role="option"
            ref={(el) => { itemRefs.current[i] = el }}
            tabIndex={i === focusedIndex ? 0 : -1}
            aria-selected={activePreset === p.id}
            onClick={() => {
              setFocusedIndex(i)
              handlePresetChange(p.id)
            }}
            onKeyDown={(e) => handleKeyDown(e, i)}
            disabled={disabled}
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
          </button>
        ))}
      </div>
    </div>
  )
}
