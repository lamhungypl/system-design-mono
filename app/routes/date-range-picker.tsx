"use client"

import { useState } from "react"
import { startOfDay, subDays, startOfYesterday, endOfYesterday } from "date-fns"
import { DatePicker } from "~/components/date-picker/DatePicker"
import { RangePicker } from "~/components/range-picker/RangePicker"
import type { DateRange, DatePreset, RangePreset } from "~/lib/dateUtils"

const DATE_PRESETS: DatePreset[] = [
  { label: "Today", value: () => startOfDay(new Date()) },
  { label: "Yesterday", value: () => startOfDay(subDays(new Date(), 1)) },
  { label: "A week ago", value: () => startOfDay(subDays(new Date(), 7)) },
  { label: "A month ago", value: () => startOfDay(subDays(new Date(), 30)) },
  { label: "Custom" },
]

const RANGE_PRESETS: RangePreset[] = [
  {
    label: "Today",
    value: () => {
      const t = startOfDay(new Date())
      return [t, t]
    },
  },
  {
    label: "Yesterday",
    value: () => [startOfYesterday(), endOfYesterday()],
  },
  {
    label: "Last 7 days",
    value: () => [startOfDay(subDays(new Date(), 6)), startOfDay(new Date())],
  },
  {
    label: "Last 30 days",
    value: () => [startOfDay(subDays(new Date(), 29)), startOfDay(new Date())],
  },
  { label: "Custom range" },
]

function formatFull(d: Date) {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

function diffDays(a: Date, b: Date) {
  return Math.round(Math.abs(b.getTime() - a.getTime()) / 86_400_000)
}

function DateCard({ date }: { date: Date | null }) {
  if (!date) {
    return (
      <p className="text-sm text-muted-foreground italic">No date selected.</p>
    )
  }
  return (
    <div className="rounded-lg border border-border bg-card p-4 text-sm">
      <span className="text-muted-foreground">Selected: </span>
      <span className="font-medium">{formatFull(date)}</span>
    </div>
  )
}

function RangeCard({ range }: { range: DateRange }) {
  if (!range.start && !range.end) {
    return (
      <p className="text-sm text-muted-foreground italic">No range selected.</p>
    )
  }
  return (
    <div className="rounded-lg border border-border bg-card p-4 text-sm space-y-2">
      <Row label="Start" value={range.start ? formatFull(range.start) : "—"} />
      <Row label="End" value={range.end ? formatFull(range.end) : "—"} />
      {range.start && range.end && (
        <Row
          label="Duration"
          value={`${diffDays(range.start, range.end)} days`}
        />
      )}
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

function Section({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  )
}

export default function DateRangePickerPage() {
  const [singleDate, setSingleDate] = useState<Date | null>(null)
  const [range, setRange] = useState<DateRange>({ start: null, end: null })

  return (
    <div className="flex min-h-svh flex-col items-center p-8">
      <div className="w-full max-w-6xl space-y-12">
        <header>
          <h1 className="text-xl font-semibold">Date &amp; Range Pickers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Single-date and date-range pickers side by side.
          </p>
        </header>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Left: DatePicker */}
          <div className="space-y-10">
            <div>
              <h2 className="text-lg font-semibold">DatePicker</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Single-date picker with optional presets sidebar.
              </p>
            </div>

            <Section
              title="Controlled with presets"
              description="Value and onChange wired to React state."
            >
              <DatePicker
                presets={DATE_PRESETS}
                value={singleDate}
                onChange={setSingleDate}
              />
              <DateCard date={singleDate} />
            </Section>

            <Section
              title="Basic (no presets)"
              description="Calendar-only — no presets prop."
            >
              <DatePicker />
            </Section>

            <Section
              title="Min / Max date"
              description="Restrict selectable dates."
            >
              <DatePicker
                minDate={subDays(new Date(), 30)}
                maxDate={new Date()}
                placeholder="Last 30 days only"
              />
            </Section>

            <Section
              title="Disabled"
              description="Pass disabled to lock the picker."
            >
              <DatePicker disabled defaultValue={new Date()} />
            </Section>
          </div>

          {/* Right: RangePicker */}
          <div className="space-y-10">
            <div>
              <h2 className="text-lg font-semibold">RangePicker</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Compact trigger — calendar opens in a popover.
              </p>
            </div>

            <Section
              title="Controlled with presets"
              description="Value and onChange wired to React state."
            >
              <RangePicker
                presets={RANGE_PRESETS}
                value={range}
                onChange={setRange}
              />
              <RangeCard range={range} />
            </Section>

            <Section
              title="Basic (no presets)"
              description="Calendar-only — no presets prop."
            >
              <RangePicker />
            </Section>

            <Section
              title="Uncontrolled"
              description="No value prop — internal state only."
            >
              <RangePicker
                name="report_range"
                placeholder="Pick a report window"
                presets={RANGE_PRESETS}
              />
            </Section>

            <Section
              title="Disabled"
              description="Pass disabled to lock the picker."
            >
              <RangePicker
                disabled
                defaultValue={{
                  start: new Date(2025, 0, 1),
                  end: new Date(2025, 11, 31),
                }}
              />
            </Section>
          </div>
        </div>
      </div>
    </div>
  )
}
