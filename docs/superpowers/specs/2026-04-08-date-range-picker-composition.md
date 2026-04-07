# DateRangePicker — Compound Component Design Spec

**Date:** 2026-04-08  
**Status:** Approved

---

## Overview

Refactor the monolithic `DateRangePicker.tsx` into a compound component using React context. Sub-components (`Calendar`, `Presets`) compose under a shared context provider. The default export remains backward-compatible — `<DateRangePicker />` with no children works identically to today.

---

## Goals

- **Reusability:** Use `DateRangePicker.Calendar` standalone (without presets).
- **Customizability:** Swap or omit sub-components at the call site.
- **Readability:** Each file has one clear responsibility (~100-150 lines each).
- **Backward compat:** Existing usages require zero changes.

---

## File Structure

| File | Responsibility |
|------|---------------|
| `DateRangePickerContext.tsx` | Context type definition + `useDateRangePickerContext()` hook |
| `DateRangePickerRoot.tsx` | State ownership, context provider, default layout fallback |
| `DateRangePickerCalendar.tsx` | Day view + month grid + nav helpers (`NavButton`, `DayViewHeader`, `MonthGridView`) |
| `DateRangePickerPresets.tsx` | Range label display + preset radio group |
| `DateRangePicker.tsx` | Assembly: `Object.assign(Root, { Calendar, Presets })` + type re-exports |

The CSS file (`date-range-picker.css`) and `~/lib/dateUtils.ts` are untouched.

No barrel `index.ts` — consumers import directly from `DateRangePicker.tsx` as today.

---

## API

### Root props (unchanged)

```ts
interface DateRangePickerProps {
  value?: DateRange
  defaultValue?: DateRange
  onChange?: (range: DateRange) => void
  name?: string
  disabled?: boolean
  children?: React.ReactNode          // NEW — opt-in composition
  slotProps?: {
    calendar?: CalendarSlotProps
    presets?: PresetsSlotProps
  }
}
```

### Sub-component props

`DateRangePicker.Calendar` accepts `CalendarSlotProps` directly:

```ts
interface CalendarSlotProps {
  minDate?: Date
  maxDate?: Date
  openToDate?: Date
  className?: string
}
```

`DateRangePicker.Presets` accepts `PresetsSlotProps` directly:

```ts
interface PresetsSlotProps {
  presets?: Preset[]
  hidden?: boolean
  className?: string
}
```

Props passed to sub-components take precedence over `slotProps` on Root (merge, sub-component wins on conflict).

### Usage examples

```tsx
// Unchanged — backward-compatible default layout:
<DateRangePicker value={range} onChange={setRange} />

// Explicit composition — same result, but you control the layout:
<DateRangePicker value={range} onChange={setRange}>
  <DateRangePicker.Calendar maxDate={new Date()} />
  <DateRangePicker.Presets presets={myPresets} />
</DateRangePicker>

// Calendar only (no preset panel):
<DateRangePicker value={range} onChange={setRange}>
  <DateRangePicker.Calendar />
</DateRangePicker>

// react-hook-form Controller (unchanged):
<Controller
  name="dateRange"
  control={control}
  render={({ field }) => (
    <DateRangePicker
      value={field.value}
      onChange={field.onChange}
      name={field.name}
      disabled={field.disabled}
    />
  )}
/>
```

---

## Context

```ts
interface DateRangePickerContextValue {
  // Value
  effectiveRange: DateRange
  commitRange: (next: DateRange) => void

  // UI state
  activePreset: string
  setActivePreset: (id: string) => void
  viewMode: "days" | "months"
  setViewMode: (v: "days" | "months") => void
  openToDate: Date
  setOpenToDate: (d: Date | ((prev: Date) => Date)) => void

  // Config
  disabled: boolean
  calendarSlot?: CalendarSlotProps
  presetsSlot?: PresetsSlotProps
}
```

`useDateRangePickerContext()` throws if called outside a `DateRangePickerRoot`.

---

## Root render logic

```tsx
const content = children ?? (
  <>
    <DateRangePickerCalendar {...calendarSlot} />
    {!presetsSlot?.hidden && <DateRangePickerPresets {...presetsSlot} />}
  </>
)

return (
  <DateRangePickerContext.Provider value={ctx}>
    <div className="flex w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-card shadow-sm ...">
      {content}
    </div>
  </DateRangePickerContext.Provider>
)
```

The outer wrapper div (border, rounded, shadow) always comes from Root. Sub-components own their inner panel markup only.

---

## Sub-component prop merging

When sub-components receive direct props, they merge with context-provided slot values. Direct props win:

```ts
// Inside DateRangePickerCalendar:
function DateRangePickerCalendar(props: CalendarSlotProps) {
  const { calendarSlot } = useDateRangePickerContext()
  const merged = { ...calendarSlot, ...props }
  // use merged.maxDate, merged.className, etc.
}
```

---

## Out of scope

- Popover/trigger wrapper
- Custom outer shell via composition
- Time selection
- Multi-month view

---

## Success criteria

1. `<DateRangePicker />` with no children works identically to today (zero breaking changes).
2. `<DateRangePicker.Calendar />` and `<DateRangePicker.Presets />` render correctly when composed explicitly.
3. `<DateRangePicker.Calendar />` used alone (no `Presets` sibling) renders without errors.
4. Direct sub-component props override `slotProps` on Root.
5. `useDateRangePickerContext()` throws a clear error when used outside Root.
6. No barrel `index.ts` — import path unchanged (`~/components/date-range-picker/DateRangePicker`).
