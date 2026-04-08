// app/components/date-range-select/DateRangeSelect.tsx
import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { CalendarIcon } from "lucide-react"

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

function getTriggerLabel(
  effectiveRange: DateRange,
  placeholder: string,
): string {
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

  // Refs for positioning and click-outside
  const triggerRef = useRef<HTMLButtonElement>(null)
  const presetPanelRef = useRef<HTMLDivElement>(null)
  const calendarPanelRef = useRef<HTMLDivElement>(null)

  // Roving tabindex for preset list
  const presetItemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [focusedPresetIndex, setFocusedPresetIndex] = useState(0)

  // Sync focus position when activePreset changes
  useEffect(() => {
    const i = presets.findIndex((p) => p.id === activePreset)
    if (i >= 0) setFocusedPresetIndex(i)
  }, [activePreset]) // eslint-disable-line react-hooks/exhaustive-deps

  // Preset list position: fixed, right-aligned to trigger.
  // Opens below by default; flips above when there's not enough space below.
  const [presetPos, setPresetPos] = useState<{
    top?: number
    bottom?: number
    right: number
  } | null>(null)

  const updatePresetPos = useCallback(() => {
    if (!triggerRef.current) return
    const r = triggerRef.current.getBoundingClientRect()
    const estimatedHeight = presets.length * 40 + 8
    const spaceBelow = window.innerHeight - r.bottom
    const right = window.innerWidth - r.right
    if (spaceBelow < estimatedHeight && r.top > spaceBelow) {
      // Flip above
      setPresetPos({ bottom: window.innerHeight - r.top + 4, right })
    } else {
      setPresetPos({ top: r.bottom + 4, right })
    }
  }, [presets.length])

  useEffect(() => {
    if (!open) return
    updatePresetPos()
    const observer = new ResizeObserver(updatePresetPos)
    if (triggerRef.current) observer.observe(triggerRef.current)
    window.addEventListener("resize", updatePresetPos)
    window.addEventListener("scroll", updatePresetPos, true)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", updatePresetPos)
      window.removeEventListener("scroll", updatePresetPos, true)
    }
  }, [open, updatePresetPos])

  // Calendar panel position: fixed, left of preset list, bottom-aligned
  const [calendarPos, setCalendarPos] = useState<{ bottom: number; right: number } | null>(null)
  const showCalendar = open && activePreset === "custom"

  const updateCalendarPos = useCallback(() => {
    if (!presetPanelRef.current) return
    // Anchor to the "Custom range" item if available, otherwise the panel bottom.
    const customIndex = presets.findIndex((p) => p.id === "custom")
    const anchor =
      (customIndex >= 0 ? presetItemRefs.current[customIndex] : null) ??
      presetPanelRef.current
    const ar = anchor.getBoundingClientRect()
    const pr = presetPanelRef.current.getBoundingClientRect()
    setCalendarPos({
      bottom: window.innerHeight - ar.bottom,
      right: window.innerWidth - pr.left + 8,
    })
  }, [presets]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!showCalendar) {
      setCalendarPos(null)
      return
    }
    // Defer one frame to ensure the portal has committed to the DOM and
    // presetPanelRef.current is attached before measuring.
    const frame = requestAnimationFrame(updateCalendarPos)
    const observer = new ResizeObserver(updateCalendarPos)
    if (presetPanelRef.current) observer.observe(presetPanelRef.current)
    window.addEventListener("resize", updateCalendarPos)
    window.addEventListener("scroll", updateCalendarPos, true)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener("resize", updateCalendarPos)
      window.removeEventListener("scroll", updateCalendarPos, true)
    }
  }, [showCalendar, updateCalendarPos])

  // Esc key — USE setOpen(false) DIRECTLY to avoid stale closure
  useEffect(() => {
    if (!open) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open])

  // Click outside (all three elements: trigger, preset panel, calendar panel)
  // USE setOpen(false) DIRECTLY to avoid stale closure; add instanceof Node guard
  useEffect(() => {
    if (!open) return
    function handlePointerDown(e: PointerEvent) {
      const target = e.target
      if (!(target instanceof Node)) { setOpen(false); return }
      if (
        triggerRef.current?.contains(target) ||
        presetPanelRef.current?.contains(target) ||
        calendarPanelRef.current?.contains(target)
      )
        return
      setOpen(false)
    }
    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [open])

  // Preset commit
  function commitPreset(id: string) {
    const p = presets.find((x) => x.id === id)
    if (!p) return
    setActivePreset(id)
    if (id === "custom") return // show calendar, stay open
    if (p.getRange) commitRange(p.getRange())
    setOpen(false)
    triggerRef.current?.focus()
  }

  // Keyboard navigation inside preset list
  function handlePresetKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      const next = (index + 1) % presets.length
      setFocusedPresetIndex(next)
      presetItemRefs.current[next]?.focus()
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      const prev = (index - 1 + presets.length) % presets.length
      setFocusedPresetIndex(prev)
      presetItemRefs.current[prev]?.focus()
    } else if (e.key === " " || e.key === "Enter") {
      e.preventDefault()
      commitPreset(presets[index].id)
    }
  }

  const label = getTriggerLabel(effectiveRange, placeholder)

  return (
    <>
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={disabled}
        data-name={name}
        aria-expanded={open}
        aria-haspopup="listbox"
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

      {/* Preset list panel */}
      {open &&
        presetPos &&
        createPortal(
          <div
            ref={presetPanelRef}
            role="listbox"
            aria-label="Date range presets"
            aria-orientation="vertical"
            style={{
              position: "fixed",
              top: presetPos.top,
              bottom: presetPos.bottom,
              right: presetPos.right,
              zIndex: 50,
            }}
            className="min-w-[10rem] overflow-hidden rounded-xl border border-border bg-card py-1 shadow-md"
          >
            {presets.map((p, i) => (
              <button
                key={p.id}
                role="option"
                ref={(el) => {
                  presetItemRefs.current[i] = el
                }}
                tabIndex={i === focusedPresetIndex ? 0 : -1}
                aria-selected={activePreset === p.id}
                onClick={() => {
                  setFocusedPresetIndex(i)
                  commitPreset(p.id)
                }}
                onKeyDown={(e) => handlePresetKeyDown(e, i)}
                className={cn(
                  "flex w-full cursor-pointer items-center px-4 py-2.5 text-sm transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                  "hover:bg-accent hover:text-accent-foreground",
                  activePreset === p.id
                    ? "bg-accent/60 font-medium text-accent-foreground"
                    : "text-foreground",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>,
          document.body,
        )}

      {/* Calendar panel — only when Custom range is committed */}
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
