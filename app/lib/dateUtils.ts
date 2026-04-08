import {
  format,
  startOfDay,
  subDays,
  startOfYesterday,
  endOfYesterday,
} from "date-fns"

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
  id: string
  label: string
  getRange?: () => { start: Date; end: Date }
}

/** Formats a date as "Apr 07, 2026". */
export function formatDate(d: Date): string {
  return format(d, "MMM dd, yyyy")
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
    getRange: () => ({
      start: startOfYesterday(),
      end: endOfYesterday(),
    }),
  },
  {
    id: "last7",
    label: "Last 7 days",
    getRange: () => ({
      start: startOfDay(subDays(new Date(), 6)),
      end: startOfDay(new Date()),
    }),
  },
  {
    id: "last30",
    label: "Last 30 days",
    getRange: () => ({
      start: startOfDay(subDays(new Date(), 29)),
      end: startOfDay(new Date()),
    }),
  },
  {
    id: "last90",
    label: "Last 90 days",
    getRange: () => ({
      start: startOfDay(subDays(new Date(), 89)),
      end: startOfDay(new Date()),
    }),
  },
  {
    id: "custom",
    label: "Custom range",
  },
]

// ── Antd-style preset types ───────────────────────────────────────────────

export interface DatePreset {
  label: string
  /** When omitted the preset acts as a "Custom" trigger — keeps the popover open for calendar selection. */
  value?: Date | (() => Date)
}

export interface RangePreset {
  label: string
  /** When omitted the preset acts as a "Custom range" trigger — keeps the popover open for calendar selection. */
  value?: [Date, Date] | (() => [Date, Date])
}

export function resolveDatePreset(p: DatePreset): Date | null {
  if (p.value == null) return null
  return typeof p.value === "function" ? p.value() : p.value
}

export function resolveRangePreset(p: RangePreset): [Date, Date] | null {
  if (p.value == null) return null
  return typeof p.value === "function" ? p.value() : p.value
}
