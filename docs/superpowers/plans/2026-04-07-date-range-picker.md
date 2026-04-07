# Date Range Picker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/date-range-picker` route with a single-calendar range picker built on `react-datepicker` (inline, selectsRange) + a preset panel on the right; switch app to SPA mode (SSR=false).

**Architecture:** `react-datepicker` handles the calendar grid, range selection, and keyboard navigation. A custom header provides month/year dropdowns (native `<select>`) and Base UI nav buttons. A co-located preset panel (Base UI RadioGroup) drives the range state. CSS overrides in a dedicated file style the range highlight to match the design (blue strip with circular caps).

**Tech Stack:** React Router v7, `react-datepicker`, `@base-ui/react` (Button, RadioGroup, Radio), Tailwind CSS v4, lucide-react, TypeScript.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `react-router.config.ts` | Set `ssr: false` |
| Modify | `app/routes.ts` | Register `/date-range-picker` route |
| Create | `app/lib/dateUtils.ts` | Pure date helpers (presets, formatting) |
| Create | `app/components/date-range-picker/date-range-picker.css` | react-datepicker CSS overrides for range styling |
| Create | `app/components/date-range-picker/DateRangePicker.tsx` | Full component (calendar + preset panel) |
| Create | `app/routes/date-range-picker.tsx` | Route page — renders `<DateRangePicker />` |

---

## Task 1: Install react-datepicker, switch to SPA mode, register route

**Files:**
- Modify: `react-router.config.ts`
- Modify: `app/routes.ts`

- [ ] **Step 1: Install react-datepicker**

```bash
pnpm add react-datepicker
pnpm add -D @types/react-datepicker
```

Expected: `react-datepicker` and `@types/react-datepicker` appear in `package.json`.

- [ ] **Step 2: Set `ssr: false` in react-router.config.ts**

```ts
import type { Config } from "@react-router/dev/config"

export default {
  ssr: false,
} satisfies Config
```

- [ ] **Step 3: Add the new route in app/routes.ts**

```ts
import { type RouteConfig, index, route } from "@react-router/dev/routes"

export default [
  index("routes/home.tsx"),
  route("/date-range-picker", "routes/date-range-picker.tsx"),
] satisfies RouteConfig
```

- [ ] **Step 4: Commit**

```bash
git add react-router.config.ts app/routes.ts package.json pnpm-lock.yaml
git commit -m "feat: install react-datepicker, switch to SPA mode, add route"
```

---

## Task 2: Create date utility helpers

**Files:**
- Create: `app/lib/dateUtils.ts`

- [ ] **Step 1: Create `app/lib/dateUtils.ts`**

```ts
export type PresetId =
  | "today"
  | "yesterday"
  | "last7"
  | "last30"
  | "last90"
  | "custom"

export interface DateRange {
  start: Date | null
  end: Date | null
}

export interface Preset {
  id: PresetId
  label: string
  getRange?: () => { start: Date; end: Date }
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

/** Formats a date as "Apr 07, 2026". */
export function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
}

export const PRESETS: Preset[] = [
  {
    id: "today",
    label: "Today",
    getRange: () => {
      const t = startOfDay(new Date())
      return { start: t, end: t }
    },
  },
  {
    id: "yesterday",
    label: "Yesterday",
    getRange: () => {
      const t = startOfDay(new Date())
      const y = new Date(t.getFullYear(), t.getMonth(), t.getDate() - 1)
      return { start: y, end: y }
    },
  },
  {
    id: "last7",
    label: "Last 7 days",
    getRange: () => {
      const end = startOfDay(new Date())
      const start = new Date(end.getFullYear(), end.getMonth(), end.getDate() - 6)
      return { start, end }
    },
  },
  {
    id: "last30",
    label: "Last 30 days",
    getRange: () => {
      const end = startOfDay(new Date())
      const start = new Date(end.getFullYear(), end.getMonth(), end.getDate() - 29)
      return { start, end }
    },
  },
  {
    id: "last90",
    label: "Last 90 days",
    getRange: () => {
      const end = startOfDay(new Date())
      const start = new Date(end.getFullYear(), end.getMonth(), end.getDate() - 89)
      return { start, end }
    },
  },
  {
    id: "custom",
    label: "Custom range",
  },
]
```

- [ ] **Step 2: Commit**

```bash
git add app/lib/dateUtils.ts
git commit -m "feat: add date utility helpers (presets, formatDate)"
```

---

## Task 3: Create react-datepicker CSS overrides

**Files:**
- Create: `app/components/date-range-picker/date-range-picker.css`

- [ ] **Step 1: Create CSS override file**

The goal: range days get a blue strip background; start/end caps are solid circles; in-selecting-range hover preview works the same way.

```css
/* app/components/date-range-picker/date-range-picker.css */
@import "react-datepicker/dist/react-datepicker.css";

.rdp-custom {
  /* Remove react-datepicker's own border/shadow — our wrapper handles it */
  .react-datepicker {
    font-family: inherit;
    border: 0;
    background: transparent;
  }

  .react-datepicker__header {
    background: transparent;
    border-bottom: 0;
    padding: 0;
  }

  .react-datepicker__month {
    margin: 0;
  }

  .react-datepicker__week {
    display: flex;
    align-items: center;
  }

  .react-datepicker__day-names {
    display: flex;
    align-items: center;
    margin-top: 0.5rem;
  }

  .react-datepicker__day-name {
    width: 2.25rem;
    line-height: 2rem;
    text-align: center;
    color: var(--color-muted-foreground);
    font-size: 0.75rem;
    font-weight: 500;
    margin: 0;
  }

  /* ── Day cells ── */
  .react-datepicker__day {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    margin: 0;
    border-radius: 9999px;
    font-size: 0.875rem;
    color: var(--color-foreground);
    transition: background-color 150ms, color 150ms;
    position: relative;
    z-index: 1;
  }

  .react-datepicker__day:hover:not([aria-disabled="true"]) {
    background-color: var(--color-accent);
    color: var(--color-accent-foreground);
    border-radius: 9999px;
  }

  .react-datepicker__day--keyboard-selected {
    background-color: transparent;
    color: var(--color-foreground);
  }

  /* Today */
  .react-datepicker__day--today {
    font-weight: 600;
    background-color: transparent;
    color: var(--color-foreground);
  }

  /* Outside current month */
  .react-datepicker__day--outside-month {
    opacity: 0.4;
  }

  /* ── Range strip ── */

  /* Days inside the range (not start/end) */
  .react-datepicker__day--in-range,
  .react-datepicker__day--in-selecting-range {
    background-color: transparent;
    color: var(--color-foreground);
    border-radius: 0;
  }

  /* Use a wrapper trick: react-datepicker wraps each day in a container.
     We apply the strip via a pseudo-element on the day itself when it has
     the in-range class, but keep the circle on top via z-index. */
  .react-datepicker__day--in-range::before,
  .react-datepicker__day--in-selecting-range::before {
    content: "";
    position: absolute;
    inset: 0;
    background-color: color-mix(in oklch, var(--color-primary) 15%, transparent);
    z-index: -1;
    border-radius: 0;
  }

  /* Range start */
  .react-datepicker__day--range-start,
  .react-datepicker__day--selecting-range-start {
    background-color: var(--color-primary) !important;
    color: var(--color-primary-foreground) !important;
    border-radius: 9999px !important;
    font-weight: 600;
  }

  .react-datepicker__day--range-start::before,
  .react-datepicker__day--selecting-range-start::before {
    content: "";
    position: absolute;
    inset: 0;
    background-color: color-mix(in oklch, var(--color-primary) 15%, transparent);
    z-index: -1;
    border-radius: 0;
    /* strip only on right half */
    left: 50%;
    right: 0;
  }

  /* Range end */
  .react-datepicker__day--range-end,
  .react-datepicker__day--selecting-range-end {
    background-color: var(--color-primary) !important;
    color: var(--color-primary-foreground) !important;
    border-radius: 9999px !important;
    font-weight: 600;
  }

  .react-datepicker__day--range-end::before,
  .react-datepicker__day--selecting-range-end::before {
    content: "";
    position: absolute;
    inset: 0;
    background-color: color-mix(in oklch, var(--color-primary) 15%, transparent);
    z-index: -1;
    border-radius: 0;
    /* strip only on left half */
    left: 0;
    right: 50%;
  }

  /* Single day selected (start == end) */
  .react-datepicker__day--range-start.react-datepicker__day--range-end {
    border-radius: 9999px !important;
  }

  .react-datepicker__day--range-start.react-datepicker__day--range-end::before {
    display: none;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/date-range-picker/date-range-picker.css
git commit -m "feat: add react-datepicker CSS overrides for range highlight"
```

---

## Task 4: Build the DateRangePicker component

**Files:**
- Create: `app/components/date-range-picker/DateRangePicker.tsx`

- [ ] **Step 1: Create `app/components/date-range-picker/DateRangePicker.tsx`**

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
  type PresetId,
  PRESETS,
  formatDate,
} from "~/lib/dateUtils"

import "./date-range-picker.css"

// ── Custom calendar header ─────────────────────────────────────────────────

function CalendarHeader({
  date,
  decreaseMonth,
  increaseMonth,
  changeMonth,
  changeYear,
}: ReactDatePickerCustomHeaderProps) {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 20 }, (_, i) => currentYear - 10 + i)

  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(2000, i, 1).toLocaleDateString("en-US", { month: "long" }),
  )

  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <ButtonPrimitive
        className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={(e) => {
          e.preventDefault()
          decreaseMonth()
        }}
        aria-label="Go to previous month"
      >
        <ChevronLeft className="size-4" />
      </ButtonPrimitive>

      <div className="flex flex-1 items-center justify-center gap-2">
        <select
          value={date.getMonth()}
          onChange={(e) => changeMonth(Number(e.target.value))}
          aria-label="Select month"
          className="cursor-pointer rounded border border-border bg-background px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {months.map((m, i) => (
            <option key={m} value={i}>
              {m}
            </option>
          ))}
        </select>

        <select
          value={date.getFullYear()}
          onChange={(e) => changeYear(Number(e.target.value))}
          aria-label="Select year"
          className="cursor-pointer rounded border border-border bg-background px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <ButtonPrimitive
        className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={(e) => {
          e.preventDefault()
          increaseMonth()
        }}
        aria-label="Go to next month"
      >
        <ChevronRight className="size-4" />
      </ButtonPrimitive>
    </div>
  )
}

// ── DateRangePicker ────────────────────────────────────────────────────────

export function DateRangePicker() {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [preset, setPreset] = useState<PresetId>("custom")

  function handleRangeChange(dates: [Date | null, Date | null]) {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
    setPreset("custom")
  }

  function handlePresetChange(id: string) {
    const p = PRESETS.find((x) => x.id === id)
    if (!p) return
    setPreset(id as PresetId)
    if (p.getRange) {
      const r = p.getRange()
      setStartDate(r.start)
      setEndDate(r.end)
    } else {
      setStartDate(null)
      setEndDate(null)
    }
  }

  const rangeLabel =
    startDate && endDate
      ? `${formatDate(startDate)} → ${formatDate(endDate)}`
      : startDate
        ? `${formatDate(startDate)} → ...`
        : "Select a date range"

  return (
    <div className="flex w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {/* ── Calendar panel ── */}
      <div className="rdp-custom flex-1 p-4">
        <DatePicker
          inline
          selectsRange
          startDate={startDate ?? undefined}
          endDate={endDate ?? undefined}
          onChange={handleRangeChange}
          renderCustomHeader={CalendarHeader}
          calendarClassName="!border-0 !shadow-none !bg-transparent w-full"
          monthClassName={() => "w-full"}
        />
      </div>

      {/* ── Preset panel ── */}
      <div className="flex w-56 flex-col border-l border-border">
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
          value={preset}
          onValueChange={(v) => handlePresetChange(v as string)}
          aria-label="Date range presets"
        >
          {PRESETS.map((p) => (
            <Radio.Root
              key={p.id}
              value={p.id}
              className={cn(
                "flex w-full cursor-pointer items-center px-4 py-2.5 text-sm transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                "hover:bg-accent hover:text-accent-foreground",
                preset === p.id
                  ? "bg-accent/60 font-medium text-accent-foreground"
                  : "text-foreground",
              )}
            >
              {p.label}
            </Radio.Root>
          ))}
        </RadioGroup>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/date-range-picker/DateRangePicker.tsx
git commit -m "feat: add DateRangePicker using react-datepicker with preset panel"
```

---

## Task 5: Create the route page

**Files:**
- Create: `app/routes/date-range-picker.tsx`

- [ ] **Step 1: Create `app/routes/date-range-picker.tsx`**

```tsx
import { DateRangePicker } from "~/components/date-range-picker/DateRangePicker"

export default function DateRangePickerPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <div className="w-full max-w-2xl">
        <h1 className="mb-1 text-lg font-semibold">Date Range Picker</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Pick a custom range or choose a preset.
        </p>
        <DateRangePicker />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/routes/date-range-picker.tsx
git commit -m "feat: add /date-range-picker route page"
```

---

## Task 6: Verify in browser

- [ ] **Step 1: Run dev server**

```bash
pnpm dev
```

Expected: No TypeScript errors. Server starts on `http://localhost:5173`.

- [ ] **Step 2: Check SPA mode**

Navigate to `http://localhost:5173`. Disable JS in DevTools → page should be blank (no SSR).

- [ ] **Step 3: Check the picker**

Navigate to `http://localhost:5173/date-range-picker`. Verify:
- Calendar renders with month/year selects and chevron nav buttons
- Clicking a day starts range selection; clicking a second day completes it with blue strip
- In-selecting hover preview shows the strip before second click
- Each preset sets the correct range and highlights in the preset list
- Range display updates on every change

- [ ] **Step 4: Check keyboard**

Tab to preset list → arrow keys cycle options → Enter selects. Tab to calendar → arrow keys navigate days → Enter selects.
