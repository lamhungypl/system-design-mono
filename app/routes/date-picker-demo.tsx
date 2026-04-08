"use client"

import { useState } from "react"
import { startOfDay, subDays } from "date-fns"
import { DatePicker } from "~/components/date-picker/DatePicker"
import { type DatePreset } from "~/lib/dateUtils"

const PRESETS: DatePreset[] = [
  { label: "Today", value: () => startOfDay(new Date()) },
  { label: "Yesterday", value: () => startOfDay(subDays(new Date(), 1)) },
  { label: "A week ago", value: () => startOfDay(subDays(new Date(), 7)) },
  { label: "A month ago", value: () => startOfDay(subDays(new Date(), 30)) },
  { label: "Custom" },
]

function DateCard({ date }: { date: Date | null }) {
  if (!date) {
    return (
      <p className="text-sm text-muted-foreground italic">No date selected.</p>
    )
  }
  return (
    <div className="max-w-sm rounded-lg border border-border bg-card p-4 text-sm">
      <span className="text-muted-foreground">Selected: </span>
      <span className="font-medium">
        {date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </span>
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

export default function DatePickerDemo() {
  const [basic, setBasic] = useState<Date | null>(null)
  const [withPresets, setWithPresets] = useState<Date | null>(null)

  return (
    <div className="p-8 max-w-2xl space-y-10">
      <header>
        <h1 className="text-xl font-semibold">DatePicker</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A single-date picker with an optional presets sidebar.
        </p>
      </header>

      {/* 1 — Basic (no presets) */}
      <Section
        title="Basic"
        description="Calendar-only — no presets prop."
      >
        <DatePicker value={basic} onChange={setBasic} />
        <DateCard date={basic} />
      </Section>

      {/* 2 — With presets */}
      <Section
        title="With presets"
        description="Pass a presets array to show a sidebar alongside the calendar."
      >
        <DatePicker
          presets={PRESETS}
          value={withPresets}
          onChange={setWithPresets}
        />
        <DateCard date={withPresets} />
      </Section>

      {/* 3 — Uncontrolled */}
      <Section
        title="Uncontrolled"
        description="No value prop — internal state only. Use name for form association."
      >
        <DatePicker
          name="due_date"
          placeholder="Pick a due date"
          presets={PRESETS}
        />
      </Section>

      {/* 4 — Min / Max */}
      <Section
        title="Min / Max date"
        description="Restrict selectable dates with minDate and maxDate."
      >
        <DatePicker
          minDate={subDays(new Date(), 30)}
          maxDate={new Date()}
          placeholder="Last 30 days only"
        />
      </Section>

      {/* 5 — Disabled */}
      <Section title="Disabled" description="Pass disabled to lock the picker.">
        <DatePicker disabled defaultValue={new Date()} />
      </Section>
    </div>
  )
}
