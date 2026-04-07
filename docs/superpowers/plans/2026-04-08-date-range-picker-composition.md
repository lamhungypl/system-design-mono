# DateRangePicker Compound Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the monolithic `DateRangePicker.tsx` into a compound component using React context, while keeping the existing public API fully backward-compatible.

**Architecture:** A shared React context (owned by `DateRangePickerRoot`) holds all state and config. Two sub-components (`DateRangePickerCalendar`, `DateRangePickerPresets`) read from this context. The assembly file (`DateRangePicker.tsx`) attaches sub-components as static properties via `Object.assign` so callers use `<DateRangePicker.Calendar />` etc.

**Tech Stack:** React 19, TypeScript, react-datepicker, @base-ui/react, Tailwind CSS v4, React Router v7 (SPA mode)

---

## File Map

| Action | Path | Responsibility |
|--------|------|---------------|
| Create | `app/components/date-range-picker/DateRangePickerContext.tsx` | Context type, `DateRangePickerContext`, `useDateRangePickerContext()` hook, slot prop types |
| Create | `app/components/date-range-picker/DateRangePickerCalendar.tsx` | Calendar panel: `NavButton`, `DayViewHeader`, `MonthGridView`, `getMonthHighlight`, `DateRangePickerCalendar` |
| Create | `app/components/date-range-picker/DateRangePickerPresets.tsx` | Preset panel: range label + radio group |
| Create | `app/components/date-range-picker/DateRangePickerRoot.tsx` | State ownership, context provider, default layout fallback, `DateRangePickerProps` |
| Rewrite | `app/components/date-range-picker/DateRangePicker.tsx` | Assembly only: `Object.assign(Root, { Calendar, Presets })` + type re-exports |

CSS (`date-range-picker.css`) and `app/lib/dateUtils.ts` are **not touched**.

---

### Task 1: Create `DateRangePickerContext.tsx`

**Files:**
- Create: `app/components/date-range-picker/DateRangePickerContext.tsx`

This file owns the context type, the context object, and the consumer hook. It also re-exports the slot prop types so other files have a single import source for them.

- [ ] **Step 1: Create the context file**

```tsx
// app/components/date-range-picker/DateRangePickerContext.tsx
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm typecheck 2>&1 | tail -5
```

Expected: no errors (or only pre-existing errors unrelated to this file).

- [ ] **Step 3: Commit**

```bash
git add app/components/date-range-picker/DateRangePickerContext.tsx
git commit -m "feat: add DateRangePickerContext with shared state types"
```

---

### Task 2: Create `DateRangePickerCalendar.tsx`

**Files:**
- Create: `app/components/date-range-picker/DateRangePickerCalendar.tsx`

Move all calendar-related code here: `NavButton`, `DayViewHeader`, `MONTH_NAMES`, `getMonthHighlight`, `MonthGridView`, and the new `DateRangePickerCalendar` component that reads from context. The CSS import moves here since this is where `rdp-custom` is used.

- [ ] **Step 1: Create the calendar file**

```tsx
// app/components/date-range-picker/DateRangePickerCalendar.tsx
import DatePicker, {
  type ReactDatePickerCustomHeaderProps,
} from "react-datepicker"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "~/lib/utils"
import type { DateRange } from "~/lib/dateUtils"
import {
  useDateRangePickerContext,
  type CalendarSlotProps,
} from "./DateRangePickerContext"

import "./date-range-picker.css"

// ── Nav button ─────────────────────────────────────────────────────────────

function NavButton({
  onClick,
  "aria-label": ariaLabel,
  children,
  muted = false,
  disabled = false,
}: {
  onClick: () => void
  "aria-label": string
  children: React.ReactNode
  muted?: boolean
  disabled?: boolean
}) {
  return (
    <ButtonPrimitive
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-md transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        muted
          ? "text-muted-foreground/40 hover:bg-muted hover:text-muted-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        disabled && "pointer-events-none opacity-40",
      )}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {children}
    </ButtonPrimitive>
  )
}

// ── Day-view custom header ─────────────────────────────────────────────────

function DayViewHeader({
  date,
  decreaseMonth,
  increaseMonth,
  decreaseYear,
  increaseYear,
  onTitleClick,
}: ReactDatePickerCustomHeaderProps & { onTitleClick: () => void }) {
  const title = date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  return (
    <div className="mb-3 flex items-center gap-1">
      <NavButton onClick={decreaseYear} aria-label="Previous year">
        <span className="text-xs font-bold">«</span>
      </NavButton>
      <NavButton onClick={decreaseMonth} aria-label="Previous month">
        <ChevronLeft className="size-3.5" />
      </NavButton>

      <button
        type="button"
        className="flex flex-1 cursor-pointer items-center justify-center rounded-md px-2 py-1 text-sm font-medium transition-colors hover:bg-accent"
        onClick={onTitleClick}
        aria-label={`Switch to month picker, currently showing ${title}`}
      >
        {title}
      </button>

      <NavButton onClick={increaseMonth} aria-label="Next month">
        <ChevronRight className="size-3.5" />
      </NavButton>
      <NavButton onClick={increaseYear} aria-label="Next year">
        <span className="text-xs font-bold">»</span>
      </NavButton>
    </div>
  )
}

// ── Month-grid view ────────────────────────────────────────────────────────

const MONTH_NAMES = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
]

function getMonthHighlight(
  year: number,
  month: number,
  range: DateRange,
): "none" | "single" | "start" | "end" | "in-range" {
  const { start, end } = range
  if (!start) return "none"

  const thisMonth = new Date(year, month, 1).getTime()
  const startMonth = new Date(start.getFullYear(), start.getMonth(), 1).getTime()
  const endMonth = end
    ? new Date(end.getFullYear(), end.getMonth(), 1).getTime()
    : startMonth

  if (thisMonth === startMonth && thisMonth === endMonth) return "single"
  if (thisMonth === startMonth) return "start"
  if (thisMonth === endMonth) return "end"
  if (thisMonth > startMonth && thisMonth < endMonth) return "in-range"
  return "none"
}

function MonthGridView({
  year,
  range,
  onPrevYear,
  onNextYear,
  onPrevDecade,
  onNextDecade,
  onMonthSelect,
}: {
  year: number
  range: DateRange
  onPrevYear: () => void
  onNextYear: () => void
  onPrevDecade: () => void
  onNextDecade: () => void
  onMonthSelect: (month: number) => void
}) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-1">
        <NavButton onClick={onPrevDecade} aria-label="Previous decade" muted>
          <span className="text-xs font-bold">«</span>
        </NavButton>
        <NavButton onClick={onPrevYear} aria-label="Previous year">
          <ChevronLeft className="size-3.5" />
        </NavButton>

        <div className="flex flex-1 items-center justify-center">
          <span className="rounded-md bg-accent px-3 py-1 text-sm font-semibold text-accent-foreground">
            {year}
          </span>
        </div>

        <NavButton onClick={onNextYear} aria-label="Next year">
          <ChevronRight className="size-3.5" />
        </NavButton>
        <NavButton onClick={onNextDecade} aria-label="Next decade" muted>
          <span className="text-xs font-bold">»</span>
        </NavButton>
      </div>

      <div className="grid grid-cols-3" role="grid" aria-label="Select month">
        {MONTH_NAMES.map((m, i) => {
          const highlight = getMonthHighlight(year, i, range)
          const isSelected =
            highlight === "start" || highlight === "end" || highlight === "single"

          return (
            <div
              key={m}
              className={cn(
                highlight === "in-range" && "bg-primary/15",
                highlight === "start" &&
                  "bg-gradient-to-r from-transparent from-50% to-primary/15 to-50%",
                highlight === "end" &&
                  "bg-gradient-to-l from-transparent from-50% to-primary/15 to-50%",
              )}
            >
              <button
                type="button"
                role="gridcell"
                onClick={() => onMonthSelect(i)}
                aria-selected={highlight !== "none"}
                aria-label={m}
                className={cn(
                  "relative z-10 w-full rounded-full py-2.5 text-sm transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isSelected
                    ? "bg-primary font-semibold text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground",
                )}
              >
                {m}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── DateRangePickerCalendar ────────────────────────────────────────────────

export function DateRangePickerCalendar(props: CalendarSlotProps) {
  const {
    effectiveRange,
    commitRange,
    viewMode,
    setViewMode,
    openToDate,
    setOpenToDate,
    disabled,
    calendarSlot,
    setActivePreset,
  } = useDateRangePickerContext()

  // Direct props override slotProps from Root
  const { minDate, maxDate, className } = { ...calendarSlot, ...props }

  const startDate = effectiveRange.start
  const endDate = effectiveRange.end

  function handleRangeChange(dates: [Date | null, Date | null]) {
    const [start, end] = dates
    commitRange({ start, end })
    setActivePreset("custom")
  }

  function handleMonthSelect(month: number) {
    setOpenToDate(new Date(openToDate.getFullYear(), month, 1))
    setViewMode("days")
  }

  function shiftYear(delta: number) {
    setOpenToDate((d) => new Date(d.getFullYear() + delta, d.getMonth(), 1))
  }

  return (
    <div className={cn("rdp-custom flex-1 p-4", className)}>
      {viewMode === "months" ? (
        <MonthGridView
          year={openToDate.getFullYear()}
          range={{ start: startDate, end: endDate }}
          onPrevYear={() => shiftYear(-1)}
          onNextYear={() => shiftYear(1)}
          onPrevDecade={() => shiftYear(-10)}
          onNextDecade={() => shiftYear(10)}
          onMonthSelect={handleMonthSelect}
        />
      ) : (
        <DatePicker
          inline
          selectsRange
          startDate={startDate ?? undefined}
          endDate={endDate ?? undefined}
          onChange={handleRangeChange}
          openToDate={openToDate}
          onMonthChange={(date) => setOpenToDate(date)}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          renderCustomHeader={(props) => (
            <DayViewHeader
              {...props}
              onTitleClick={() => setViewMode("months")}
            />
          )}
          calendarClassName="!border-0 !shadow-none !bg-transparent w-full"
        />
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm typecheck 2>&1 | tail -5
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/components/date-range-picker/DateRangePickerCalendar.tsx
git commit -m "feat: extract DateRangePickerCalendar sub-component"
```

---

### Task 3: Create `DateRangePickerPresets.tsx`

**Files:**
- Create: `app/components/date-range-picker/DateRangePickerPresets.tsx`

Move the preset panel (range label + radio group) here. Reads all needed state from context.

- [ ] **Step 1: Create the presets file**

```tsx
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
          </Radio.Root>
        ))}
      </RadioGroup>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm typecheck 2>&1 | tail -5
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/components/date-range-picker/DateRangePickerPresets.tsx
git commit -m "feat: extract DateRangePickerPresets sub-component"
```

---

### Task 4: Create `DateRangePickerRoot.tsx`

**Files:**
- Create: `app/components/date-range-picker/DateRangePickerRoot.tsx`

Own all state, provide context, render default layout when `children` is absent.

- [ ] **Step 1: Create the root file**

```tsx
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

  // Default layout when no children are provided
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
        aria-disabled={disabled}
        data-name={name}
      >
        {content}
      </div>
    </DateRangePickerContext.Provider>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm typecheck 2>&1 | tail -5
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/components/date-range-picker/DateRangePickerRoot.tsx
git commit -m "feat: add DateRangePickerRoot with context provider and default layout"
```

---

### Task 5: Rewrite `DateRangePicker.tsx` as assembly file

**Files:**
- Rewrite: `app/components/date-range-picker/DateRangePicker.tsx`

Replace the monolith with a thin assembly file. The import path used by consumers (`~/components/date-range-picker/DateRangePicker`) does not change. The CSS import moves to `DateRangePickerCalendar.tsx` (Task 2), so remove it here.

- [ ] **Step 1: Rewrite the file**

```tsx
// app/components/date-range-picker/DateRangePicker.tsx
import { DateRangePickerRoot } from "./DateRangePickerRoot"
import { DateRangePickerCalendar } from "./DateRangePickerCalendar"
import { DateRangePickerPresets } from "./DateRangePickerPresets"

export type { DateRangePickerProps } from "./DateRangePickerRoot"
export type { CalendarSlotProps, PresetsSlotProps } from "./DateRangePickerContext"

export const DateRangePicker = Object.assign(DateRangePickerRoot, {
  Calendar: DateRangePickerCalendar,
  Presets: DateRangePickerPresets,
})
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm typecheck 2>&1 | tail -5
```

Expected: no errors.

- [ ] **Step 3: Manually verify in browser**

Start the dev server (requires Node.js 22+):

```bash
nvm use 22 && pnpm dev
```

Open `http://localhost:5173/date-range-picker`. Verify all 5 demo cases work:

1. **Uncontrolled (default)** — select a range, strip highlights correctly
2. **Controlled** — value display above picker updates as you select
3. **No presets + maxDate** — preset panel is hidden, future dates are disabled
4. **Custom presets** — "Last week" / "Last month" presets appear and select correctly
5. **Disabled** — picker is visually dimmed, not interactive

Click the month/year title to verify month-grid view opens and range highlighting shows correctly.

- [ ] **Step 4: Verify compound API works**

Open `app/routes/date-range-picker.tsx` and temporarily add one explicit composition example (can be reverted after checking):

```tsx
<DateRangePicker>
  <DateRangePicker.Calendar />
  <DateRangePicker.Presets />
</DateRangePicker>
```

Confirm it renders identically to `<DateRangePicker />` with no children, then revert the change.

- [ ] **Step 5: Commit**

```bash
git add app/components/date-range-picker/DateRangePicker.tsx
git commit -m "refactor: convert DateRangePicker to compound component"
```

---

### Task 6: Add composition demo to route page

**Files:**
- Modify: `app/routes/date-range-picker.tsx`

Add one new demo section that exercises the explicit compound API, so the route page documents both patterns.

- [ ] **Step 1: Add compound demo section**

In `app/routes/date-range-picker.tsx`, add after the existing "Disabled" section (before the closing `</div>`):

```tsx
<div className="w-full max-w-2xl space-y-2">
  <h2 className="text-base font-semibold">Compound composition</h2>
  <p className="text-sm text-muted-foreground">
    Explicit children — Calendar only, no preset panel.
  </p>
  <DateRangePicker>
    <DateRangePicker.Calendar />
  </DateRangePicker>
</div>
```

- [ ] **Step 2: Verify in browser**

Open `http://localhost:5173/date-range-picker`. The new section should show a calendar with no preset panel, filling the full width.

- [ ] **Step 3: Commit**

```bash
git add app/routes/date-range-picker.tsx
git commit -m "demo: add compound composition example to date-range-picker route"
```
