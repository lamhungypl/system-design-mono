import { useState } from "react"
import { CalendarIcon } from "lucide-react"

import { cn } from "~/lib/utils"
import { PRESETS, formatDate, type DateRange, type Preset } from "~/lib/dateUtils"

// ── Types ──────────────────────────────────────────────────────────────────

export interface DateRangeSelectProps {
  /** Controlled value. When provided, internal state is ignored. */
  value?: DateRange
  /** Initial value for uncontrolled mode. */
  defaultValue?: DateRange
  /** Fires on every committed change. */
  onChange?: (range: DateRange) => void
  /** For form association. */
  name?: string
  disabled?: boolean
  /** Override the default preset list. */
  presets?: Preset[]
  /** Trigger text when no value is selected. Default: "Select date range" */
  placeholder?: string
}

// ── Trigger label ──────────────────────────────────────────────────────────

function getTriggerLabel(
  activePreset: string,
  effectiveRange: DateRange,
  presets: Preset[],
  placeholder: string,
): string {
  if (activePreset !== "custom") {
    const p = presets.find((x) => x.id === activePreset)
    return p?.label ?? placeholder
  }
  const { start, end } = effectiveRange
  if (start && end) return `${formatDate(start)} → ${formatDate(end)}`
  if (start) return `${formatDate(start)} → ...`
  return placeholder
}

// ── DateRangeSelect ────────────────────────────────────────────────────────

export function DateRangeSelect({
  value,
  defaultValue,
  onChange,
  name,
  disabled = false,
  presets = PRESETS,
  placeholder = "Select date range",
}: DateRangeSelectProps) {
  // Controlled / uncontrolled value
  const [internalRange, setInternalRange] = useState<DateRange>(
    defaultValue ?? { start: null, end: null },
  )
  const effectiveRange = value ?? internalRange

  function commitRange(next: DateRange) {
    if (value === undefined) setInternalRange(next)
    onChange?.(next)
  }

  // UI state
  const [open, setOpen] = useState(false)
  const [activePreset, setActivePreset] = useState<string>("custom")

  const label = getTriggerLabel(activePreset, effectiveRange, presets, placeholder)

  // Suppress unused variable warning - commitRange will be used in later tasks
  void commitRange
  void setActivePreset

  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      disabled={disabled}
      data-name={name}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium shadow-sm transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        disabled && "pointer-events-none opacity-60",
      )}
    >
      <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
      {label}
    </button>
  )
}
