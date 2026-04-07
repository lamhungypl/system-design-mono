# Date Range Picker — Design Spec

**Date:** 2026-04-07  
**Status:** Approved

---

## Overview

Add a `/date-range-picker` route to the React Router v7 app that showcases a single-calendar date range picker built with Base UI's `Calendar` component. The app is also switched to fully client-side rendering (SPA mode) by setting `ssr: false`.

---

## Goals

- Demonstrate Base UI's `Calendar` in range-selection mode with a contiguous highlight
- Provide preset shortcuts (Today, Yesterday, Last 7 days, Last 30 days, Last 90 days, Custom range)
- Display the selected range as a formatted string
- Full keyboard and screen reader accessibility
- Designed to be easy to extend later with a popover/trigger pattern

---

## Architecture

### Config change

`react-router.config.ts`: set `ssr: false` → SPA mode, no server rendering.

### File structure

```
app/
  routes.ts                          # add route('/date-range-picker', ...)
  routes/
    date-range-picker.tsx            # page: renders <DateRangePicker />
  components/
    date-range-picker/
      DateRangePicker.tsx            # main component (calendar + presets)
```

### State shape

```ts
type Mode = 'preset' | 'custom'

interface DateRange {
  start: Date | null
  end: Date | null
}

// Local state inside DateRangePicker
const [range, setRange] = useState<DateRange>({ start: null, end: null })
const [mode, setMode] = useState<Mode>('preset')
```

No external state management. State lifted to parent when needed later.

---

## Component Layout

```
┌─────────────────────────────────────────────────────┐
│  [📅 Apr 07, 2026  →  Apr 14, 2026]  (aria-live)   │
├──────────────────────────┬──────────────────────────┤
│  Base UI Calendar         │  Preset list             │
│  (range highlight)        │  ○ Today                 │
│                           │  ○ Yesterday             │
│                           │  ○ Last 7 days           │
│                           │  ○ Last 30 days          │
│                           │  ○ Last 90 days          │
│                           │  ● Custom range          │
└──────────────────────────┴──────────────────────────┘
```

- Left: Base UI `Calendar` in range mode. Selected span is highlighted in blue.
- Right: preset list + date display header.
- Clicking a preset → sets `range` to computed dates, sets `mode = 'preset'`.
- Clicking a calendar day → sets `mode = 'custom'`, highlights "Custom range".

---

## Presets

| Label | start | end |
|---|---|---|
| Today | today | today |
| Yesterday | today - 1 | today - 1 |
| Last 7 days | today - 6 | today |
| Last 30 days | today - 29 | today |
| Last 90 days | today - 89 | today |
| Custom range | (calendar-driven) | (calendar-driven) |

---

## Accessibility

- **Calendar keyboard nav**: handled by Base UI internally (arrow keys, Home/End, Page Up/Down).
- **Preset list**: `role="radiogroup"` wrapping `role="radio"` items. Arrow keys cycle through options; Enter/Space selects.
- **Date display**: `aria-live="polite"` — screen readers announce changes when range updates.
- **Calendar region**: `aria-label="Select date range"`.
- **No unexpected focus jumps**: selecting a preset keeps focus in the preset list; clicking a calendar day keeps focus in the calendar.
- **Visible focus indicators**: standard Tailwind `focus-visible:ring` styles applied to all interactive elements.

---

## Styling

- Tailwind CSS v4 utility classes throughout.
- Range highlight: blue background (`bg-primary`) across contiguous selected days.
- Start/end day: fully rounded pill cap; intermediate days: square (or slight radius).
- Weekends visually distinct (lighter text).
- Active preset: highlighted row (`bg-accent`).

---

## Out of Scope (this spec)

- Popover/trigger wrapper (future)
- Two-panel (dual month) view (future)
- Min/max date constraints
- Disabled dates
- Time selection

---

## Success Criteria

1. `ssr: false` set and app builds as SPA.
2. `/date-range-picker` route accessible in the browser.
3. Calendar highlights the selected range across multiple weeks correctly.
4. All 5 presets correctly compute and apply date ranges.
5. Keyboard-only navigation works end-to-end (tab between calendar and presets, arrow keys within each).
6. Screen reader announces range changes via `aria-live`.
