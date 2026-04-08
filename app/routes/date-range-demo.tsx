"use client"

import { useState } from "react"
import { DateRangePicker, type DateRange } from "~/components/ui/date-range-picker"

function formatFull(d: Date) {
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
}

function diffDays(a: Date, b: Date) {
  return Math.round(Math.abs(b.getTime() - a.getTime()) / 86_400_000)
}

export default function DateRangeDemo() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null })

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold">Date Range Picker</h1>
      <p className="mt-1 mb-8 text-sm text-muted-foreground">
        Select a start and end date from the calendar.
      </p>

      <div className="space-y-6">
        <DateRangePicker value={range} onChange={setRange} />

        {range.start && range.end && (
          <div className="max-w-sm rounded-lg border border-border bg-card p-4 text-sm space-y-2">
            <Row label="Start" value={formatFull(range.start)} />
            <Row label="End" value={formatFull(range.end)} />
            <Row label="Duration" value={`${diffDays(range.start, range.end)} days`} />
          </div>
        )}
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-16 shrink-0 text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
