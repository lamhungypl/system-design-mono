# DateRangePicker — Monolithic Controlled Component Design Spec

**Date:** 2026-04-07  
**Status:** Approved

---

## Overview

Refactor the existing `DateRangePicker` into a fully controlled monolithic component with `slotProps` for customization. The goal is clean reuse in forms (via `react-hook-form` `<Controller>`) and table filters without changing the established UI layout.

---

## API

```ts
interface DateRange {
  start: Date | null
  end: Date | null
}

interface CalendarSlotProps {
  minDate?: Date
  maxDate?: Date
  openToDate?: Date
  className?: string
}

interface PresetsSlotProps {
  presets?: Preset[]   // override the default preset list
  hidden?: boolean     // hide the preset panel entirely
  className?: string
}

interface DateRangePickerProps {
  // Controlled
  value?: DateRange
  defaultValue?: DateRange
  onChange?: (range: DateRange) => void

  // Form integration
  name?: string
  disabled?: boolean

  // Slot customization
  slotProps?: {
    calendar?: CalendarSlotProps
    presets?: PresetsSlotProps
  }
}
```

### Controlled / uncontrolled

- If `value` is passed → controlled mode, internal state is ignored
- If only `defaultValue` is passed → uncontrolled, internal state owns the value
- `onChange` fires on every change in both modes

### Form library usage

```tsx
// react-hook-form
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

// Table filter (uncontrolled, listen via onChange)
<DateRangePicker
  defaultValue={{ start: null, end: null }}
  onChange={(range) => applyFilter(range)}
  slotProps={{ presets: { hidden: false } }}
/>
```

---

## Architecture

### Files

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `app/lib/dateUtils.ts` | Export `DateRange` and `Preset` types (already exist, no change) |
| Rewrite | `app/components/date-range-picker/DateRangePicker.tsx` | Controlled component with slotProps |

No new files needed — the CSS, utils, and route page stay as-is.

### State management

```ts
// Internal state (uncontrolled mode)
const [internalRange, setInternalRange] = useState<DateRange>(
  defaultValue ?? { start: null, end: null }
)

// Effective value (controlled takes precedence)
const range = value ?? internalRange

function handleChange(next: DateRange) {
  if (value === undefined) setInternalRange(next)  // uncontrolled
  onChange?.(next)
}
```

The preset state (`activePreset`) remains internal — it's UI state, not value state.

---

## Preset panel a11y

Uses Base UI `RadioGroup` + `Radio.Root`:
- Container: `role="radiogroup"`, `aria-label="Date range presets"`
- Each item: `role="radio"`, `aria-checked` (managed by Base UI)
- Arrow keys cycle within the group; Tab enters/exits as a unit
- Rationale: mutually exclusive persistent selection maps exactly to radio semantics

The `presets` slotProp replaces the default list entirely when provided. The default list (`PRESETS` from `dateUtils.ts`) is used otherwise. `hidden: true` removes the panel and the border — the calendar fills the full width.

---

## slotProps behaviour

| Prop | Effect |
|------|--------|
| `slotProps.calendar.minDate` | Passed to `DatePicker` — disables days before this date |
| `slotProps.calendar.maxDate` | Passed to `DatePicker` — disables days after this date |
| `slotProps.calendar.openToDate` | Overrides the initial displayed month |
| `slotProps.calendar.className` | Merged onto the calendar panel `div` |
| `slotProps.presets.presets` | Replaces default PRESETS array |
| `slotProps.presets.hidden` | Hides the right panel; calendar expands to fill |
| `slotProps.presets.className` | Merged onto the preset panel `div` |

---

## Out of scope

- Popover/trigger wrapper (separate component, future)
- Time selection
- Multi-month view
- Min/max range duration constraints

---

## Success criteria

1. Passing `value` + `onChange` controls the component externally.
2. Omitting `value` (with optional `defaultValue`) works uncontrolled.
3. `react-hook-form` `<Controller>` integration works with no adapter code.
4. `slotProps.presets.hidden = true` hides the panel; calendar fills full width.
5. `slotProps.presets.presets` replaces the preset list.
6. `slotProps.calendar.minDate` / `maxDate` disables out-of-range days.
7. `name` and `disabled` props propagate correctly.
