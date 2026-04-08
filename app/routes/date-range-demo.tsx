"use client"

import { useState } from "react"
import { startOfDay, subDays, startOfYesterday, endOfYesterday } from "date-fns"
import { RangePicker } from "~/components/range-picker/RangePicker"
import { type DateRange, type RangePreset } from "~/lib/dateUtils"

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

function RangeCard({ range }: { range: DateRange }) {
  if (!range.start && !range.end) {
    return (
      <p className="text-sm text-muted-foreground italic">No range selected.</p>
    )
  }
  return (
    <div className="max-w-sm rounded-lg border border-border bg-card p-4 text-sm space-y-2">
      <Row label="Start" value={range.start ? formatFull(range.start) : "\u2014"} />
      <Row label="End" value={range.end ? formatFull(range.end) : "\u2014"} />
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

// ── Custom presets for the third example ──────────────────────────────────────

const PRESETS: RangePreset[] = [
  {
    label: "Today",
    value: () => {
      const t = startOfDay(new Date())
      return [t, t]
    },
  },
  { label: "Yesterday", value: () => [startOfYesterday(), endOfYesterday()] },
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

const FISCAL_PRESETS: RangePreset[] = [
  {
    label: "Q1 (Jan \u2013 Mar)",
    value: () => {
      const y = new Date().getFullYear()
      return [new Date(y, 0, 1), new Date(y, 2, 31)]
    },
  },
  {
    label: "Q2 (Apr \u2013 Jun)",
    value: () => {
      const y = new Date().getFullYear()
      return [new Date(y, 3, 1), new Date(y, 5, 30)]
    },
  },
  {
    label: "Q3 (Jul \u2013 Sep)",
    value: () => {
      const y = new Date().getFullYear()
      return [new Date(y, 6, 1), new Date(y, 8, 30)]
    },
  },
  {
    label: "Q4 (Oct \u2013 Dec)",
    value: () => {
      const y = new Date().getFullYear()
      return [new Date(y, 9, 1), new Date(y, 11, 31)]
    },
  },
  { label: "Custom range" },
]

// ── Demo sections ──────────────────────────────────────────────────────────────

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

export default function DateRangeDemo() {
  const [controlled, setControlled] = useState<DateRange>({ start: null, end: null })
  const [fiscal, setFiscal] = useState<DateRange>({ start: null, end: null })

  return (
    <div className="p-8 max-w-2xl space-y-10">
      <header>
        <h1 className="text-xl font-semibold">RangePicker</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A date-range picker with optional presets sidebar and inline calendar.
        </p>
      </header>

      {/* 1 — Controlled */}
      <Section
        title="Controlled"
        description="Value and onChange wired up to React state."
      >
        <RangePicker presets={PRESETS} value={controlled} onChange={setControlled} />
        <RangeCard range={controlled} />
      </Section>

      {/* 2 — Uncontrolled */}
      <Section
        title="Uncontrolled"
        description="No value prop — internal state only. Use name for form association."
      >
        <RangePicker
          name="report_range"
          placeholder="Pick a report window"
          presets={PRESETS}
        />
      </Section>

      {/* 3 — Custom presets */}
      <Section
        title="Custom presets"
        description="Override the default presets. Here we use fiscal quarters."
      >
        <RangePicker
          presets={FISCAL_PRESETS}
          placeholder="Select a quarter"
          value={fiscal}
          onChange={setFiscal}
        />
        <RangeCard range={fiscal} />
      </Section>

      {/* 4 — Disabled */}
      <Section
        title="Disabled"
        description="Pass disabled to lock the component."
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
  )
}
