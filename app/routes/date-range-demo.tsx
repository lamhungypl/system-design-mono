"use client"

import { useState } from "react"
import { DateRangeSelect } from "~/components/date-range-select/DateRangeSelect"
import { type DateRange, type Preset } from "~/lib/dateUtils"

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

// ── Custom presets for the third example ──────────────────────────────────────

const FISCAL_PRESETS: Preset[] = [
  {
    id: "q1",
    label: "Q1 (Jan – Mar)",
    getRange: () => {
      const y = new Date().getFullYear()
      return { start: new Date(y, 0, 1), end: new Date(y, 2, 31) }
    },
  },
  {
    id: "q2",
    label: "Q2 (Apr – Jun)",
    getRange: () => {
      const y = new Date().getFullYear()
      return { start: new Date(y, 3, 1), end: new Date(y, 5, 30) }
    },
  },
  {
    id: "q3",
    label: "Q3 (Jul – Sep)",
    getRange: () => {
      const y = new Date().getFullYear()
      return { start: new Date(y, 6, 1), end: new Date(y, 8, 30) }
    },
  },
  {
    id: "q4",
    label: "Q4 (Oct – Dec)",
    getRange: () => {
      const y = new Date().getFullYear()
      return { start: new Date(y, 9, 1), end: new Date(y, 11, 31) }
    },
  },
  { id: "custom", label: "Custom range" },
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

export default function DateRangeSelectDemo() {
  const [controlled, setControlled] = useState<DateRange>({ start: null, end: null })
  const [fiscal, setFiscal] = useState<DateRange>({ start: null, end: null })

  return (
    <div className="p-8 max-w-2xl space-y-10">
      <header>
        <h1 className="text-xl font-semibold">DateRangeSelect</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A select-based date-range picker with preset shortcuts and an inline
          calendar for custom ranges.
        </p>
      </header>

      {/* 1 — Controlled */}
      <Section
        title="Controlled"
        description="Value and onChange wired up to React state. The card below reflects every committed change."
      >
        <DateRangeSelect value={controlled} onChange={setControlled} />
        <RangeCard range={controlled} />
      </Section>

      {/* 2 — Uncontrolled */}
      <Section
        title="Uncontrolled"
        description="No value prop — internal state only. Useful when you just need the native form value via the name prop."
      >
        <DateRangeSelect
          defaultValue={{ start: null, end: null }}
          name="report_range"
          placeholder="Pick a report window"
        />
      </Section>

      {/* 3 — Custom presets */}
      <Section
        title="Custom presets"
        description="Override the default presets list. Here we use fiscal quarters instead of the built-in rolling windows."
      >
        <DateRangeSelect
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
        <DateRangeSelect
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
