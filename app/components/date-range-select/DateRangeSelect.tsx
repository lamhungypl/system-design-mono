// app/components/date-range-select/DateRangeSelect.tsx
import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { CalendarIcon } from "lucide-react"
import { Select } from "@base-ui/react/select"

import { cn } from "~/lib/utils"
import { PRESETS, formatDate, type DateRange, type Preset } from "~/lib/dateUtils"
import { DateRangePickerContext } from "~/components/date-range-picker/DateRangePickerContext"
import { DateRangePickerCalendar } from "~/components/date-range-picker/DateRangePickerCalendar"

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

function getTriggerLabel(effectiveRange: DateRange, placeholder: string): string {
  const { start, end } = effectiveRange
  if (start && end) return `${formatDate(start)} → ${formatDate(end)}`
  if (start) return `${formatDate(start)} → ...`
  return placeholder
}

// ── CalendarPanel ──────────────────────────────────────────────────────────
// Wraps DateRangePickerCalendar with a minimal context provider.
// Owns viewMode and openToDate state (calendar-specific, not part of DateRangeSelect state).

function CalendarPanel({
  effectiveRange,
  commitRange,
  activePreset,
  setActivePreset,
  disabled,
}: {
  effectiveRange: DateRange
  commitRange: (next: DateRange) => void
  activePreset: string
  setActivePreset: (id: string) => void
  disabled: boolean
}) {
  const [viewMode, setViewMode] = useState<"days" | "months">("days")
  const [openToDate, setOpenToDate] = useState<Date>(
    effectiveRange.start ?? new Date(),
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
        calendarSlot: undefined,
        presetsSlot: undefined,
      }}
    >
      <DateRangePickerCalendar />
    </DateRangePickerContext.Provider>
  )
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

  // When "Custom range" is selected, we intercept the Select's close in onOpenChange.
  // onValueChange fires before onOpenChange, so we use a ref to pass that signal.
  const justSelectedCustomRef = useRef(false)

  // Refs for calendar panel positioning and click-outside detection
  const presetPopupRef = useRef<HTMLDivElement>(null)  // on Select.Popup
  const customItemRef = useRef<HTMLDivElement>(null)   // on the "Custom range" Select.Item
  const calendarPanelRef = useRef<HTMLDivElement>(null)

  // ── Preset selection ───────────────────────────────────────────────────

  function handleValueChange(newValue: string | null) {
    if (!newValue) return
    setActivePreset(newValue)
    if (newValue === "custom") {
      justSelectedCustomRef.current = true
      return // calendar will appear; don't commit a range
    }
    const p = presets.find((x) => x.id === newValue)
    if (p?.getRange) commitRange(p.getRange())
  }

  function handleOpenChange(
    isOpen: boolean,
    eventDetails: { reason: string; event: Event },
  ) {
    // If "Custom range" was just selected, keep the Select open so the
    // calendar panel appears alongside the preset list.
    if (!isOpen && justSelectedCustomRef.current) {
      justSelectedCustomRef.current = false
      return
    }
    // If the click that triggered an outside-press was inside our calendar
    // panel, don't close the Select.
    if (!isOpen && eventDetails.reason === "outside-press") {
      const target = eventDetails.event.target
      if (target instanceof Node && calendarPanelRef.current?.contains(target)) {
        return
      }
    }
    setOpen(isOpen)
  }

  // ── Calendar panel positioning ─────────────────────────────────────────

  const [calendarPos, setCalendarPos] = useState<{ bottom: number; right: number } | null>(null)
  const showCalendar = open && activePreset === "custom"

  const updateCalendarPos = useCallback(() => {
    if (!presetPopupRef.current) return
    // Anchor bottom to the "Custom range" item for precise alignment.
    const anchor = customItemRef.current ?? presetPopupRef.current
    const ar = anchor.getBoundingClientRect()
    const pr = presetPopupRef.current.getBoundingClientRect()
    setCalendarPos({
      bottom: window.innerHeight - ar.bottom,
      right: window.innerWidth - pr.left + 8,
    })
  }, [])

  useEffect(() => {
    if (!showCalendar) {
      setCalendarPos(null)
      return
    }
    // Defer one frame to ensure the portal has committed to the DOM and
    // presetPopupRef.current is attached before measuring.
    const frame = requestAnimationFrame(updateCalendarPos)
    const observer = new ResizeObserver(updateCalendarPos)
    if (presetPopupRef.current) observer.observe(presetPopupRef.current)
    window.addEventListener("resize", updateCalendarPos)
    window.addEventListener("scroll", updateCalendarPos, true)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener("resize", updateCalendarPos)
      window.removeEventListener("scroll", updateCalendarPos, true)
    }
  }, [showCalendar, updateCalendarPos])

  const label = getTriggerLabel(effectiveRange, placeholder)

  return (
    <>
      <Select.Root
        value={activePreset}
        onValueChange={handleValueChange}
        open={open}
        onOpenChange={handleOpenChange}
        modal={false}
        disabled={disabled}
        name={name}
      >
        {/* Trigger */}
        <Select.Trigger
          className={cn(
            "inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium shadow-sm transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            disabled && "pointer-events-none opacity-60",
          )}
        >
          <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
          {label}
        </Select.Trigger>

        {/* Preset list panel */}
        <Select.Portal>
          <Select.Positioner side="bottom" align="end" sideOffset={4} alignItemWithTrigger={false}>
            <Select.Popup
              ref={presetPopupRef}
              className="min-w-[10rem] overflow-hidden rounded-xl border border-border bg-card py-1 shadow-md"
            >
              {presets.map((p) => (
                <Select.Item
                  key={p.id}
                  value={p.id}
                  ref={p.id === "custom" ? customItemRef : undefined}
                  className={cn(
                    "flex w-full cursor-pointer items-center px-4 py-2.5 text-sm transition-colors outline-none",
                    "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
                    "data-[selected]:bg-accent/60 data-[selected]:font-medium data-[selected]:text-accent-foreground",
                  )}
                >
                  <Select.ItemText>{p.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>

      {/* Calendar panel — only when Custom range is active */}
      {showCalendar &&
        calendarPos &&
        createPortal(
          <div
            ref={calendarPanelRef}
            role="dialog"
            aria-label="Select custom date range"
            style={{
              position: "fixed",
              bottom: calendarPos.bottom,
              right: calendarPos.right,
              zIndex: 50,
            }}
            className="overflow-hidden rounded-xl border border-border bg-card shadow-md"
          >
            <CalendarPanel
              effectiveRange={effectiveRange}
              commitRange={commitRange}
              activePreset={activePreset}
              setActivePreset={setActivePreset}
              disabled={disabled}
            />
          </div>,
          document.body,
        )}
    </>
  )
}
