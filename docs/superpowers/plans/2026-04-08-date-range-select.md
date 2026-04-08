# DateRangeSelect Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a compact select-style date range component with a trigger button, a preset list panel, and a calendar panel that appears to the left when "Custom range" is selected.

**Architecture:** Single file `DateRangeSelect.tsx`. The trigger is a plain button. The preset list is a `position:fixed` portal div with a listbox pattern. The calendar panel is a second `position:fixed` portal div anchored to the left/bottom of the preset list, containing `DateRangePickerCalendar` wrapped in a minimal `DateRangePickerContext.Provider`. Close behavior (Esc + click-outside) is managed with `useEffect` document listeners.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, lucide-react, `react-dom` createPortal. Reuses `DateRangePickerContext` and `DateRangePickerCalendar` from the existing compound component.

---

## File Map

| Action | Path | Responsibility |
|--------|------|---------------|
| Create | `app/components/date-range-select/DateRangeSelect.tsx` | Full component — trigger, preset panel, calendar panel |
| Modify | `app/routes/date-range-picker.tsx` | Add demo section |

---

### Task 1: Scaffold, types, and trigger button

**Files:**
- Create: `app/components/date-range-select/DateRangeSelect.tsx`

Create the file with the component shell, controlled/uncontrolled value pattern, and the trigger button. No portal or popover yet — just verifies the trigger renders and the label logic works.

- [ ] **Step 1: Create the file**

```tsx
// app/components/date-range-select/DateRangeSelect.tsx
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
```

- [ ] **Step 2: Temporarily add to the route to verify it renders**

In `app/routes/date-range-picker.tsx`, add at the top:
```tsx
import { DateRangeSelect } from "~/components/date-range-select/DateRangeSelect"
```

And inside the JSX (anywhere):
```tsx
<div className="w-full max-w-2xl space-y-2">
  <h2 className="text-base font-semibold">DateRangeSelect (WIP)</h2>
  <DateRangeSelect />
</div>
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | tail -5
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/components/date-range-select/DateRangeSelect.tsx app/routes/date-range-picker.tsx
git commit -m "feat: scaffold DateRangeSelect with trigger button and label logic"
```

---

### Task 2: Preset list panel, commit logic, Esc + click-outside

**Files:**
- Modify: `app/components/date-range-select/DateRangeSelect.tsx`

Add portal-rendered preset list anchored below the trigger, listbox keyboard pattern (arrows move focus, Space/Enter/click commits), commit logic (named preset closes all; "custom" keeps open), Esc handler, and click-outside handler.

- [ ] **Step 1: Replace the file with the updated version**

```tsx
// app/components/date-range-select/DateRangeSelect.tsx
import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
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

  // Refs for positioning and click-outside
  const triggerRef = useRef<HTMLButtonElement>(null)
  const presetPanelRef = useRef<HTMLDivElement>(null)

  // Roving tabindex for preset list
  const presetItemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [focusedPresetIndex, setFocusedPresetIndex] = useState(0)

  // Sync focus position when activePreset changes externally
  useEffect(() => {
    const i = presets.findIndex((p) => p.id === activePreset)
    if (i >= 0) setFocusedPresetIndex(i)
  }, [activePreset]) // eslint-disable-line react-hooks/exhaustive-deps

  // Preset list position (fixed, below trigger, right-aligned)
  const [presetPos, setPresetPos] = useState<{ top: number; right: number } | null>(null)

  const updatePresetPos = useCallback(() => {
    if (!triggerRef.current) return
    const r = triggerRef.current.getBoundingClientRect()
    setPresetPos({ top: r.bottom + 4, right: window.innerWidth - r.right })
  }, [])

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

  // Close everything
  function closeAll() {
    setOpen(false)
  }

  // Esc key
  useEffect(() => {
    if (!open) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeAll()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open])

  // Click outside
  useEffect(() => {
    if (!open) return
    function handlePointerDown(e: PointerEvent) {
      const target = e.target as Node
      if (
        triggerRef.current?.contains(target) ||
        presetPanelRef.current?.contains(target)
      )
        return
      closeAll()
    }
    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [open])

  // Preset commit
  function commitPreset(id: string) {
    const p = presets.find((x) => x.id === id)
    if (!p) return
    setActivePreset(id)
    if (id === "custom") {
      // Show calendar panel — do not close
      return
    }
    if (p.getRange) commitRange(p.getRange())
    closeAll()
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

  const label = getTriggerLabel(activePreset, effectiveRange, presets, placeholder)

  return (
    <>
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          if (open) {
            closeAll()
          } else {
            setOpen(true)
          }
        }}
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
    </>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | tail -5
```

Expected: no errors.

- [ ] **Step 3: Manual verification**

Start dev server: `nvm use 22 && pnpm dev`

Open `http://localhost:5173/date-range-picker`, find the "DateRangeSelect (WIP)" section.

Verify:
- Clicking trigger opens the preset list below, right-aligned
- Arrow keys move focus without committing
- Clicking or pressing Enter on "Today" commits and closes
- Clicking or pressing Enter on "Custom range" keeps the list open
- Esc closes the list
- Clicking outside the list closes it

- [ ] **Step 4: Commit**

```bash
git add app/components/date-range-select/DateRangeSelect.tsx
git commit -m "feat: add preset list panel with listbox pattern and close behavior"
```

---

### Task 3: CalendarPanel and positioning

**Files:**
- Modify: `app/components/date-range-select/DateRangeSelect.tsx`

Add the `CalendarPanel` internal component (wraps `DateRangePickerCalendar` with a minimal context provider), the calendar panel portal (positioned to the left/bottom of the preset list), and the positioning logic. Also extend click-outside to cover the calendar panel.

- [ ] **Step 1: Replace the file with the final complete version**

```tsx
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

  // Preset list position: fixed, below trigger, right-aligned to trigger
  const [presetPos, setPresetPos] = useState<{ top: number; right: number } | null>(null)

  const updatePresetPos = useCallback(() => {
    if (!triggerRef.current) return
    const r = triggerRef.current.getBoundingClientRect()
    setPresetPos({ top: r.bottom + 4, right: window.innerWidth - r.right })
  }, [])

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
    const r = presetPanelRef.current.getBoundingClientRect()
    setCalendarPos({
      bottom: window.innerHeight - r.bottom,
      right: window.innerWidth - r.left + 8,
    })
  }, [])

  useEffect(() => {
    if (!showCalendar) {
      setCalendarPos(null)
      return
    }
    // Wait one frame for the preset panel to paint before measuring
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

  // Close everything
  function closeAll() {
    setOpen(false)
  }

  // Esc key
  useEffect(() => {
    if (!open) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeAll()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open])

  // Click outside (all three elements: trigger, preset panel, calendar panel)
  useEffect(() => {
    if (!open) return
    function handlePointerDown(e: PointerEvent) {
      const target = e.target as Node
      if (
        triggerRef.current?.contains(target) ||
        presetPanelRef.current?.contains(target) ||
        calendarPanelRef.current?.contains(target)
      )
        return
      closeAll()
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
    closeAll()
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

  const label = getTriggerLabel(activePreset, effectiveRange, presets, placeholder)

  return (
    <>
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? closeAll() : setOpen(true))}
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | tail -5
```

Expected: no errors.

- [ ] **Step 3: Manual verification**

Open `http://localhost:5173/date-range-picker`.

Verify:
- Clicking "Custom range" shows the calendar panel to the left of the preset list, bottom-aligned, with an 8px gap
- Arrow-key navigating over other presets while Custom is committed: calendar stays visible
- Picking a date range in the calendar: trigger label updates (e.g. "Apr 01, 2026 → Apr 08, 2026"), both panels stay open
- Clicking "Last 7 days" after Custom: calendar disappears, panels close, trigger shows "Last 7 days"
- Esc closes both panels
- Clicking outside both panels closes everything
- Calendar panel correctly bottom-aligns with the preset list

- [ ] **Step 4: Commit**

```bash
git add app/components/date-range-select/DateRangeSelect.tsx
git commit -m "feat: add CalendarPanel and fixed positioning for DateRangeSelect"
```

---

### Task 4: Final demo route

**Files:**
- Modify: `app/routes/date-range-picker.tsx`

Replace the temporary WIP demo with a proper, final demo section for `DateRangeSelect`.

- [ ] **Step 1: Replace the WIP demo section**

In `app/routes/date-range-picker.tsx`, replace the temporary "DateRangeSelect (WIP)" section with:

```tsx
<div className="w-full max-w-2xl space-y-2">
  <h2 className="text-base font-semibold">DateRangeSelect</h2>
  <p className="text-sm text-muted-foreground">
    Compact select-style trigger. Custom range opens a calendar panel.
  </p>
  <DateRangeSelect />
</div>
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | tail -5
```

Expected: no errors.

- [ ] **Step 3: Final manual check**

Open `http://localhost:5173/date-range-picker`. Scroll to "DateRangeSelect" and verify the complete flow works end-to-end.

- [ ] **Step 4: Commit**

```bash
git add app/routes/date-range-picker.tsx
git commit -m "demo: add DateRangeSelect to date-range-picker route"
```
