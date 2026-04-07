# DateRangePicker Monolithic Controlled Component — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor `DateRangePicker` into a fully controlled monolithic component with `slotProps` so it works drop-in with `react-hook-form` `<Controller>` and table filters.

**Architecture:** A single file rewrite of `DateRangePicker.tsx`. Internal state runs in uncontrolled mode; when `value` prop is passed, it takes precedence. `slotProps.presets` and `slotProps.calendar` expose customisation escape hatches. No new files — `dateUtils.ts` already exports all types needed.

**Tech Stack:** React 19, `react-datepicker`, `@base-ui/react` (RadioGroup, Radio, Button), TypeScript, Tailwind CSS v4.

> **Note:** No test framework configured. Verify manually in the browser.

---

## File Map

| Action | Path | Change |
|--------|------|--------|
| Modify | `app/lib/dateUtils.ts` | Loosen `Preset.id` from `PresetId` to `string` so custom preset ids work |
| Modify | `app/components/date-range-picker/DateRangePicker.tsx` | Add props interface, controlled/uncontrolled pattern, slotProps |
| Modify | `app/routes/date-range-picker.tsx` | Add demo instances for all integration patterns |

---

## Task 1: Loosen Preset.id type in dateUtils.ts

**Files:**
- Modify: `app/lib/dateUtils.ts`

`Preset.id` is currently `PresetId` (a fixed union of 6 values). Custom presets passed via `slotProps.presets.presets` need arbitrary string ids. Loosening to `string` keeps the built-in PRESETS working while allowing custom ones.

- [ ] **Step 1: Change `Preset.id` from `PresetId` to `string`**

In `app/lib/dateUtils.ts`, update the `Preset` interface:

```ts
export interface Preset {
  id: string          // was: id: PresetId
  label: string
  getRange?: () => { start: Date; end: Date }
}
```

Everything else in the file stays the same. `PRESETS` continues to work because `string` is wider than `PresetId`.

- [ ] **Step 2: Verify no type errors**

```bash
npx tsc --noEmit 2>&1 | grep -v "+types"
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add app/lib/dateUtils.ts
git commit -m "fix: loosen Preset.id to string to support custom preset ids"
```

---

## Task 2: Rewrite DateRangePicker with controlled API and slotProps

**Files:**
- Modify: `app/components/date-range-picker/DateRangePicker.tsx`

- [ ] **Step 1: Replace the file with the controlled implementation**

```tsx
import { useState } from "react"
import DatePicker, {
  type ReactDatePickerCustomHeaderProps,
} from "react-datepicker"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { RadioGroup, Radio } from "@base-ui/react"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "~/lib/utils"
import {
  type DateRange,
  type Preset,
  PRESETS,
  formatDate,
} from "~/lib/dateUtils"

import "./date-range-picker.css"

// ── Slot prop types ────────────────────────────────────────────────────────

export interface CalendarSlotProps {
  minDate?: Date
  maxDate?: Date
  /** Initial month to display. Changes after mount are ignored. */
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

// ── Public props ───────────────────────────────────────────────────────────

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
  slotProps?: {
    calendar?: CalendarSlotProps
    presets?: PresetsSlotProps
  }
}

// ── Types ──────────────────────────────────────────────────────────────────

type ViewMode = "days" | "months"

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

function MonthGridView({
  year,
  onPrevYear,
  onNextYear,
  onPrevDecade,
  onNextDecade,
  onMonthSelect,
}: {
  year: number
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

      <div className="grid grid-cols-3 gap-1" role="grid" aria-label="Select month">
        {MONTH_NAMES.map((m, i) => (
          <button
            key={m}
            type="button"
            role="gridcell"
            onClick={() => onMonthSelect(i)}
            className="rounded-md px-2 py-2.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── DateRangePicker ────────────────────────────────────────────────────────

export function DateRangePicker({
  value,
  defaultValue,
  onChange,
  name,
  disabled = false,
  slotProps,
}: DateRangePickerProps) {
  const calendarSlot = slotProps?.calendar
  const presetsSlot = slotProps?.presets
  const activePresets = presetsSlot?.presets ?? PRESETS

  // ── Controlled / uncontrolled value ───────────────────────────────────
  const [internalRange, setInternalRange] = useState<DateRange>(
    defaultValue ?? { start: null, end: null },
  )
  const effectiveRange = value ?? internalRange

  const startDate = effectiveRange.start
  const endDate = effectiveRange.end

  function commitRange(next: DateRange) {
    if (value === undefined) setInternalRange(next)
    onChange?.(next)
  }

  // ── UI-only state (not part of external value) ─────────────────────────
  const [activePreset, setActivePreset] = useState<string>("custom")
  const [viewMode, setViewMode] = useState<ViewMode>("days")
  const [openToDate, setOpenToDate] = useState<Date>(
    calendarSlot?.openToDate ?? new Date(),
  )

  // ── Handlers ───────────────────────────────────────────────────────────

  function handleRangeChange(dates: [Date | null, Date | null]) {
    const [start, end] = dates
    commitRange({ start, end })
    setActivePreset("custom")
  }

  function handlePresetChange(id: string) {
    const p = activePresets.find((x) => x.id === id)
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

  function handleMonthSelect(month: number) {
    setOpenToDate(new Date(openToDate.getFullYear(), month, 1))
    setViewMode("days")
  }

  function shiftYear(delta: number) {
    setOpenToDate((d) => new Date(d.getFullYear() + delta, d.getMonth(), 1))
  }

  // ── Range label ────────────────────────────────────────────────────────

  const rangeLabel =
    startDate && endDate
      ? `${formatDate(startDate)} → ${formatDate(endDate)}`
      : startDate
        ? `${formatDate(startDate)} → ...`
        : "Select a date range"

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div
      className={cn(
        "flex w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-card shadow-sm",
        disabled && "pointer-events-none opacity-60",
      )}
      aria-disabled={disabled}
      data-name={name}
    >
      {/* ── Calendar panel ── */}
      <div className={cn("rdp-custom flex-1 p-4", calendarSlot?.className)}>
        {viewMode === "months" ? (
          <MonthGridView
            year={openToDate.getFullYear()}
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
            minDate={calendarSlot?.minDate}
            maxDate={calendarSlot?.maxDate}
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

      {/* ── Preset panel ── */}
      {!presetsSlot?.hidden && (
        <div
          className={cn(
            "flex w-56 flex-col border-l border-border",
            presetsSlot?.className,
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
            onValueChange={(v) => handlePresetChange(v as string)}
            aria-label="Date range presets"
            disabled={disabled}
          >
            {activePresets.map((p) => (
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
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep -v "+types"
```

Expected: no output (no errors in our files).

- [ ] **Step 3: Commit**

```bash
git add app/components/date-range-picker/DateRangePicker.tsx
git commit -m "feat: make DateRangePicker a controlled monolithic component with slotProps"
```

---

## Task 2: Smoke-test all integration patterns in the route page

**Files:**
- Modify: `app/routes/date-range-picker.tsx`

Add three demo instances to visually verify all the new props work correctly before shipping.

- [ ] **Step 1: Update the route page with usage demos**

```tsx
import { useState } from "react"
import { DateRangePicker } from "~/components/date-range-picker/DateRangePicker"
import type { DateRange } from "~/lib/dateUtils"

export default function DateRangePickerPage() {
  // Controlled demo
  const [controlled, setControlled] = useState<DateRange>({
    start: null,
    end: null,
  })

  return (
    <div className="flex min-h-svh flex-col items-center gap-10 p-8">
      <div className="w-full max-w-2xl space-y-2">
        <h2 className="text-base font-semibold">Uncontrolled (default)</h2>
        <p className="text-sm text-muted-foreground">
          No props — internal state only.
        </p>
        <DateRangePicker />
      </div>

      <div className="w-full max-w-2xl space-y-2">
        <h2 className="text-base font-semibold">Controlled</h2>
        <p className="text-sm text-muted-foreground">
          Value:{" "}
          {controlled.start
            ? `${controlled.start.toDateString()} → ${controlled.end?.toDateString() ?? "..."}`
            : "none"}
        </p>
        <DateRangePicker value={controlled} onChange={setControlled} />
      </div>

      <div className="w-full max-w-2xl space-y-2">
        <h2 className="text-base font-semibold">
          No presets + maxDate (today)
        </h2>
        <p className="text-sm text-muted-foreground">
          Preset panel hidden, future dates disabled.
        </p>
        <DateRangePicker
          slotProps={{
            presets: { hidden: true },
            calendar: { maxDate: new Date() },
          }}
        />
      </div>

      <div className="w-full max-w-2xl space-y-2">
        <h2 className="text-base font-semibold">Custom presets</h2>
        <p className="text-sm text-muted-foreground">
          Override preset list with domain-specific options.
        </p>
        <DateRangePicker
          slotProps={{
            presets: {
              presets: [
                {
                  id: "last7",
                  label: "Last week",
                  getRange: () => {
                    const end = new Date()
                    const start = new Date()
                    start.setDate(end.getDate() - 6)
                    return { start, end }
                  },
                },
                {
                  id: "last30",
                  label: "Last month",
                  getRange: () => {
                    const end = new Date()
                    const start = new Date()
                    start.setDate(end.getDate() - 29)
                    return { start, end }
                  },
                },
                { id: "custom", label: "Custom" },
              ],
            },
          }}
        />
      </div>

      <div className="w-full max-w-2xl space-y-2">
        <h2 className="text-base font-semibold">Disabled</h2>
        <DateRangePicker
          disabled
          defaultValue={{
            start: new Date(2026, 2, 1),
            end: new Date(2026, 2, 15),
          }}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/routes/date-range-picker.tsx
git commit -m "demo: add usage examples for all DateRangePicker integration patterns"
```

---

## Task 3: Verify in browser

- [ ] **Step 1: Start dev server**

```bash
pnpm dev
```

Navigate to `http://localhost:5173/date-range-picker`.

- [ ] **Step 2: Check each demo**

| Demo | What to verify |
|------|----------------|
| Uncontrolled | Picks a range, presets work, no props needed |
| Controlled | Value label above updates as you pick dates |
| No presets + maxDate | Right panel gone, calendar fills full width, future dates grayed out |
| Custom presets | Only "Last week", "Last month", "Custom" appear |
| Disabled | All interactions inert, component visually dimmed |
