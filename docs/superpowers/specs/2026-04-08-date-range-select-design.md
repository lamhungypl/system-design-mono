# DateRangeSelect — Design Spec

**Date:** 2026-04-08  
**Status:** Approved

---

## Overview

A compact select-style component for picking a date range. Looks and behaves like a single-select dropdown where the options are preset ranges. A "Custom range" option at the bottom expands to show a calendar panel for manual date picking.

The existing inline `DateRangePicker` compound component is untouched. `DateRangePickerCalendar` is reused as the calendar panel content.

---

## Visual Layout

**Collapsed (trigger only):**
```
[📅 Last 7 days     ]
```

**Open — named preset active:**
```
                    [📅 Last 7 days     ]

                    ┌──────────────────┐
                    │ Today            │
                    │ Yesterday        │
                    │ ● Last 7 days    │
                    │ Last 30 days     │
                    │ Last 90 days     │
                    │ Custom range     │
                    └──────────────────┘
```

**Open — Custom range selected:**
```
                    [📅 Apr 01 → Apr 08 ]

┌──────────────────┐┌──────────────────┐
│   April 2026     ││ Today            │
│ Su Mo Tu ...     ││ Yesterday        │
│ ...              ││ Last 7 days      │
│ ...              ││ Last 30 days     │
└──────────────────┘│ Last 90 days     │
    ← 8px gap →    │ ● Custom range   │
                    └──────────────────┘
```

- Calendar panel bottom edge aligns with preset list bottom edge
- Calendar panel right edge is 8px to the left of preset list left edge
- Both panels have independent border, border-radius, and shadow

---

## Public API

```ts
interface DateRangeSelectProps {
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
```

---

## Trigger Button

- Calendar icon (`CalendarIcon` from lucide-react) + value text
- No chevron
- Label logic:
  - No value → `placeholder` (default `"Select date range"`)
  - Named preset active → preset label (e.g. `"Last 7 days"`)
  - Custom + complete range → `"Apr 01, 2026 → Apr 08, 2026"` (via `formatDate`)
  - Custom + start only → `"Apr 01, 2026 → ..."`
- Click toggles `open`
- Styled as a compact rounded button (not input-style)

---

## Internal State

All state is internal — not exposed as props.

```ts
open: boolean          // whether the preset list panel is visible
activePreset: string   // committed preset id ("custom" or a named id)
internalRange: DateRange  // single source of truth for value (uncontrolled mode)
```

`effectiveRange = value ?? internalRange` (controlled takes precedence, using `value === undefined` check).

`open` and `activePreset` are purely UI state — not part of the public value.

---

## Preset List Panel

- Rendered in a portal, `position: fixed`, anchored below the trigger (right-aligned)
- Listbox pattern: `role="listbox"` with `role="option"` items
- Arrow keys move focus (roving tabindex), Space/Enter or click commits selection
- Shows all presets from `props.presets ?? PRESETS`
- Selected item (`aria-selected`) = `activePreset`

---

## Calendar Panel

- Visible only when `open && activePreset === "custom"`
- Rendered in a portal, `position: fixed`
- Positioning (computed from preset list panel's bounding rect):
  - `right edge` = preset list `left` − 8px
  - `bottom edge` = preset list `bottom`
- Re-computes via `ResizeObserver` on the preset list panel element
- Contains a `CalendarPanel` wrapper component (see Architecture)
- Own border, border-radius, shadow — visually a separate block

---

## Open / Close Behaviour

| Action | Result |
|--------|--------|
| Click trigger (closed) | Open preset list |
| Click trigger (open) | Close everything |
| Commit named preset (click / Space / Enter) | Commit value, close everything |
| Commit "Custom range" | Keep preset list open, show calendar panel |
| Arrow-key navigate while Custom is committed | Calendar stays visible (focus moves, no commit) |
| Complete range in calendar (start + end both set) | Commit value, **both panels stay open** |
| Esc | Close everything, no value change |
| Click outside both panels | Close everything, no value change |

---

## Architecture

### Files

| Action | Path |
|--------|------|
| Create | `app/components/date-range-select/DateRangeSelect.tsx` |

No other files. The CSS from `date-range-picker.css` applies automatically (already imported in `DateRangePickerCalendar`).

### Internal components (private, same file)

**`CalendarPanel`** — wraps `DateRangePickerCalendar` with a minimal `DateRangePickerContext.Provider`. Owns `viewMode` and `openToDate` state (initialized from `effectiveRange.start ?? new Date()`). This keeps calendar-specific state out of `DateRangeSelect`.

```tsx
function CalendarPanel({ effectiveRange, commitRange, activePreset, setActivePreset, disabled }) {
  const [viewMode, setViewMode] = useState<"days" | "months">("days")
  const [openToDate, setOpenToDate] = useState<Date>(
    effectiveRange.start ?? new Date()
  )
  return (
    <DateRangePickerContext.Provider value={{
      effectiveRange, commitRange,
      activePreset, setActivePreset,
      viewMode, setViewMode,
      openToDate, setOpenToDate,
      disabled,
      calendarSlot: undefined,
      presetsSlot: undefined,
    }}>
      <DateRangePickerCalendar />
    </DateRangePickerContext.Provider>
  )
}
```

### Click-outside + Esc handling

Managed manually (no Base UI Popover):
- `useEffect` registers `keydown` listener for Esc → close
- `useEffect` registers `pointerdown` listener on `document` → close if click target is outside both panel refs
- Both panels are guarded by their own `ref` for the outside-click check

### Positioning

```ts
// On open or resize:
const presetRect = presetPanelRef.current.getBoundingClientRect()
setCalendarPos({
  bottom: window.innerHeight - presetRect.bottom,
  right: window.innerWidth - presetRect.left + 8,
})
```

Calendar panel uses:
```css
position: fixed;
bottom: {calendarPos.bottom}px;
right: {calendarPos.right}px;
```

---

## Out of Scope

- Month/year grid view in the calendar panel (inherited from `DateRangePickerCalendar` — already works)
- `slotProps` customization (not needed for compact select use case)
- Popover placement variants (always: preset list below trigger right-aligned, calendar to the left bottom-aligned)

---

## Success Criteria

1. Trigger shows calendar icon + correct label for all states (no value, named preset, custom complete, custom in-progress)
2. Clicking trigger opens preset list; clicking again closes everything
3. Named preset selection commits value and closes everything
4. Custom range selection shows calendar panel; other presets remain navigable without hiding calendar
5. Completing a range in the calendar commits value but keeps both panels open
6. Esc and click-outside close everything without changing value if mid-selection
7. Calendar panel is positioned to the left of the preset list, bottom edges aligned, 8px gap
8. Existing `DateRangePicker` is completely untouched
