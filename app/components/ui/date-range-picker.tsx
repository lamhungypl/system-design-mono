"use client"

import { useState, useRef, useEffect, useCallback, useId } from "react"
import { cn } from "~/lib/utils"

// ── Utils ─────────────────────────────────────────────────────────────────────

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]
const WEEKDAYS_LONG  = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
const WEEKDAYS_SHORT = ["Su","Mo","Tu","We","Th","Fr","Sa"]

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate()
}

function startOf(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function addDays(d: Date, n: number) {
  const r = new Date(d); r.setDate(r.getDate() + n); return r
}

function addMonths(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1)
}

function clampToMonth(d: Date, year: number, month: number) {
  const max = new Date(year, month + 1, 0).getDate()
  return new Date(year, month, Math.min(d.getDate(), max))
}

function calendarWeeks(year: number, month: number): (Date | null)[][] {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const flat: (Date | null)[] = Array(firstDay).fill(null)
  for (let d = 1; d <= daysInMonth; d++) flat.push(new Date(year, month, d))
  while (flat.length % 7 !== 0) flat.push(null)
  const weeks: (Date | null)[][] = []
  for (let i = 0; i < flat.length; i += 7) weeks.push(flat.slice(i, i + 7))
  return weeks
}

function fullLabel(d: Date) {
  return d.toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric", year:"numeric" })
}

function shortLabel(d: Date) {
  return d.toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" })
}

function inRange(d: Date, a: Date, b: Date) {
  const t = d.getTime()
  return t > Math.min(a.getTime(), b.getTime()) && t < Math.max(a.getTime(), b.getTime())
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DateRange { start: Date | null; end: Date | null }

interface DateRangePickerProps {
  value?: DateRange
  onChange?: (range: DateRange) => void
  placeholder?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

export function DateRangePicker({ value, onChange, placeholder = "Select date range" }: DateRangePickerProps) {
  const today = startOf(new Date())
  const gridId = useId()
  const headingId = useId()

  const [open, setOpen]       = useState(false)
  const [start, setStart]     = useState<Date | null>(value?.start ?? null)
  const [end, setEnd]         = useState<Date | null>(value?.end ?? null)
  const [hover, setHover]     = useState<Date | null>(null)
  const [phase, setPhase]     = useState<"start" | "end">("start")
  const [viewYear, setViewYear]   = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [focusedDay, setFocusedDay] = useState<Date>(today)
  // Announce month changes to screen readers
  const [announcement, setAnnouncement] = useState("")

  const triggerRef   = useRef<HTMLButtonElement>(null)
  const popoverRef   = useRef<HTMLDivElement>(null)
  const dayRefs      = useRef<Map<string, HTMLButtonElement>>(new Map())

  const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`

  // ── Open / close ──────────────────────────────────────────────────────────

  function openPicker() {
    setStart(null); setEnd(null); setPhase("start")
    const initial = today
    setFocusedDay(initial)
    setViewYear(initial.getFullYear())
    setViewMonth(initial.getMonth())
    setOpen(true)
  }

  function closePicker() {
    setOpen(false)
    setHover(null)
    triggerRef.current?.focus()
  }

  // Focus the tracked day whenever open or focusedDay changes
  useEffect(() => {
    if (!open) return
    const key = dayKey(focusedDay)
    const btn = dayRefs.current.get(key)
    btn?.focus()
  }, [open, focusedDay])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) {
      if (
        popoverRef.current && !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) closePicker()
    }
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [open])

  // ── Month navigation ──────────────────────────────────────────────────────

  function navigateMonth(delta: number) {
    const next = addMonths(new Date(viewYear, viewMonth, 1), delta)
    setViewYear(next.getFullYear())
    setViewMonth(next.getMonth())
    // Keep focused day in new month if possible
    setFocusedDay(clampToMonth(focusedDay, next.getFullYear(), next.getMonth()))
    const label = `${MONTHS[next.getMonth()]} ${next.getFullYear()}`
    setAnnouncement(label)
  }

  // ── Day selection ─────────────────────────────────────────────────────────

  function selectDay(day: Date) {
    if (phase === "start") {
      setStart(day); setEnd(null); setPhase("end")
    } else {
      const s = start!
      const [finalStart, finalEnd] = day < s ? [day, s] : [s, day]
      setStart(finalStart); setEnd(finalEnd); setPhase("start")
      setOpen(false)
      setHover(null)
      onChange?.({ start: finalStart, end: finalEnd })
      triggerRef.current?.focus()
    }
  }

  // ── Keyboard navigation inside grid ──────────────────────────────────────

  const handleGridKeyDown = useCallback((e: React.KeyboardEvent) => {
    let next: Date | null = null

    switch (e.key) {
      case "ArrowRight": next = addDays(focusedDay, 1); break
      case "ArrowLeft":  next = addDays(focusedDay, -1); break
      case "ArrowDown":  next = addDays(focusedDay, 7); break
      case "ArrowUp":    next = addDays(focusedDay, -7); break
      case "Home":       next = addDays(focusedDay, -focusedDay.getDay()); break  // start of week
      case "End":        next = addDays(focusedDay, 6 - focusedDay.getDay()); break // end of week
      case "PageUp":
        next = clampToMonth(focusedDay, viewYear, viewMonth - 1)
        break
      case "PageDown":
        next = clampToMonth(focusedDay, viewYear, viewMonth + 1)
        break
      case "Escape":
        e.preventDefault()
        closePicker()
        return
      case "Enter":
      case " ":
        e.preventDefault()
        selectDay(focusedDay)
        return
      default:
        return
    }

    if (!next) return
    e.preventDefault()

    // If navigated out of current month, switch month view
    if (next.getMonth() !== viewMonth || next.getFullYear() !== viewYear) {
      setViewYear(next.getFullYear())
      setViewMonth(next.getMonth())
      const label = `${MONTHS[next.getMonth()]} ${next.getFullYear()}`
      setAnnouncement(label)
    }
    setFocusedDay(next)
  }, [focusedDay, viewYear, viewMonth, phase, start])

  // ── Render helpers ────────────────────────────────────────────────────────

  const previewEnd  = phase === "end" && hover ? hover : end
  const weeks = calendarWeeks(viewYear, viewMonth)

  function triggerLabel() {
    if (!start) return placeholder
    if (!end)   return shortLabel(start) + " → …"
    return shortLabel(start) + " → " + shortLabel(end)
  }

  function dayAriaLabel(day: Date) {
    const base = fullLabel(day)
    if (start && sameDay(day, start)) return `${base}, start date`
    if (end   && sameDay(day, end))   return `${base}, end date`
    if (start && previewEnd && inRange(day, start, previewEnd)) return `${base}, in range`
    if (sameDay(day, today))           return `${base}, today`
    return base
  }

  return (
    <div className="relative w-fit">
      {/* Screen reader live region for announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={start && end
          ? `Date range: ${fullLabel(start)} to ${fullLabel(end)}. Press to change.`
          : placeholder
        }
        onClick={openPicker}
        className={cn(
          "flex h-9 items-center gap-2 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs",
          "hover:bg-accent hover:text-accent-foreground transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          !start && "text-muted-foreground",
        )}
      >
        <CalendarIcon aria-hidden="true" />
        <span aria-hidden="true">{triggerLabel()}</span>
      </button>

      {/* Calendar dialog */}
      {open && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-modal="true"
          aria-label={phase === "start" ? "Choose start date" : "Choose end date"}
          className="absolute left-0 top-[calc(100%+8px)] z-50 rounded-xl border border-border bg-card p-4 shadow-xl"
          onKeyDown={handleGridKeyDown}
        >
          {/* Month navigation */}
          <div className="mb-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => navigateMonth(-1)}
              aria-label={`Go to ${MONTHS[viewMonth === 0 ? 11 : viewMonth - 1]} ${viewMonth === 0 ? viewYear - 1 : viewYear}`}
              className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
            >
              <ChevronLeft aria-hidden="true" />
            </button>

            <h2 id={headingId} className="text-sm font-semibold" aria-live="polite" aria-atomic="true">
              {MONTHS[viewMonth]} {viewYear}
            </h2>

            <button
              type="button"
              onClick={() => navigateMonth(1)}
              aria-label={`Go to ${MONTHS[viewMonth === 11 ? 0 : viewMonth + 1]} ${viewMonth === 11 ? viewYear + 1 : viewYear}`}
              className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </div>

          {/* Calendar grid */}
          <table
            id={gridId}
            role="grid"
            aria-labelledby={headingId}
            aria-multiselectable="true"
            className="w-full border-collapse"
          >
            <thead>
              <tr role="row">
                {WEEKDAYS_SHORT.map((d, i) => (
                  <th
                    key={d}
                    role="columnheader"
                    scope="col"
                    abbr={WEEKDAYS_LONG[i]}
                    className="h-8 w-8 text-center text-xs font-medium text-muted-foreground"
                  >
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((week, wi) => (
                <tr key={wi} role="row">
                  {week.map((day, di) => {
                    if (!day) {
                      return <td key={di} role="gridcell" aria-disabled="true" />
                    }

                    const isStart      = start ? sameDay(day, start) : false
                    const isEnd        = end   ? sameDay(day, end)   : false
                    const isPreviewEnd = previewEnd ? sameDay(day, previewEnd) : false
                    const isToday      = sameDay(day, today)
                    const isSelected   = isStart || isEnd || isPreviewEnd
                    const isInRange    = start && previewEnd ? inRange(day, start, previewEnd) : false
                    const isFocused    = sameDay(day, focusedDay)

                    // A range exists when start is set and previewEnd (hover or end) is set
                    const rangeActive = !!(start && previewEnd)
                    const isSingleDay = rangeActive && start && previewEnd && sameDay(start, previewEnd)

                    // Band segments: left half and right half coloured independently
                    // so the band "caps" cleanly at start (right half) and end (left half)
                    const bandLeft  = rangeActive && !isSingleDay && (isInRange || (isEnd || isPreviewEnd))
                    const bandRight = rangeActive && !isSingleDay && (isInRange || isStart)

                    return (
                      <td
                        key={di}
                        role="gridcell"
                        aria-selected={isSelected || isInRange}
                        className="relative p-0"
                      >
                        {/* Range band rendered as two half-width strips behind the circle */}
                        <div className="pointer-events-none absolute inset-y-1 left-0 right-0 flex" aria-hidden="true">
                          <div className={cn("h-full w-1/2", bandLeft  ? "bg-primary/15" : "")} />
                          <div className={cn("h-full w-1/2", bandRight ? "bg-primary/15" : "")} />
                        </div>

                        <button
                          ref={el => {
                            const k = dayKey(day)
                            if (el) dayRefs.current.set(k, el)
                            else dayRefs.current.delete(k)
                          }}
                          type="button"
                          tabIndex={isFocused ? 0 : -1}
                          aria-label={dayAriaLabel(day)}
                          aria-current={isToday ? "date" : undefined}
                          aria-pressed={isSelected}
                          onClick={() => { setFocusedDay(day); selectDay(day) }}
                          onMouseEnter={() => { if (phase === "end") setHover(day) }}
                          onMouseLeave={() => setHover(null)}
                          onFocus={() => setFocusedDay(day)}
                          className={cn(
                            "relative z-10 flex size-8 w-full items-center justify-center rounded-full text-xs transition-colors",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                            !isSelected && "hover:bg-accent hover:text-accent-foreground",
                            isToday && !isSelected && "font-semibold text-primary",
                            isSelected && "bg-primary text-primary-foreground font-semibold hover:bg-primary/90",
                          )}
                        >
                          {day.getDate()}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Phase hint */}
          <p aria-live="polite" className="mt-3 text-center text-xs text-muted-foreground">
            {phase === "start" ? "Select start date" : "Now select end date"}
          </p>

          {/* Keyboard hint */}
          <p className="mt-1 text-center text-xs text-muted-foreground/40" aria-hidden="true">
            Arrows navigate · Enter selects · Esc closes
          </p>
        </div>
      )}
    </div>
  )
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0" {...props}>
      <rect x="1.5" y="2.5" width="13" height="12" rx="1.5" />
      <path d="M5 1v3M11 1v3M1.5 6.5h13" />
    </svg>
  )
}

function ChevronLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4" {...props}>
      <path d="M10 3L5 8l5 5" />
    </svg>
  )
}

function ChevronRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4" {...props}>
      <path d="M6 3l5 5-5 5" />
    </svg>
  )
}
