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
