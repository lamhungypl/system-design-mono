import { useState } from "react"
import DatePicker, {
  type ReactDatePickerCustomHeaderProps,
} from "react-datepicker"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { RadioGroup, Radio } from "@base-ui/react"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "~/lib/utils"
import { type PresetId, PRESETS, formatDate } from "~/lib/dateUtils"

import "./date-range-picker.css"

// ── Custom calendar header ─────────────────────────────────────────────────

function CalendarHeader({
  date,
  decreaseMonth,
  increaseMonth,
  changeMonth,
  changeYear,
}: ReactDatePickerCustomHeaderProps) {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 20 }, (_, i) => currentYear - 10 + i)

  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(2000, i, 1).toLocaleDateString("en-US", { month: "long" }),
  )

  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <ButtonPrimitive
        className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={(e) => {
          e.preventDefault()
          decreaseMonth()
        }}
        aria-label="Go to previous month"
      >
        <ChevronLeft className="size-4" />
      </ButtonPrimitive>

      <div className="flex flex-1 items-center justify-center gap-2">
        <select
          value={date.getMonth()}
          onChange={(e) => changeMonth(Number(e.target.value))}
          aria-label="Select month"
          className="cursor-pointer rounded border border-border bg-background px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {months.map((m, i) => (
            <option key={m} value={i}>
              {m}
            </option>
          ))}
        </select>

        <select
          value={date.getFullYear()}
          onChange={(e) => changeYear(Number(e.target.value))}
          aria-label="Select year"
          className="cursor-pointer rounded border border-border bg-background px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <ButtonPrimitive
        className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={(e) => {
          e.preventDefault()
          increaseMonth()
        }}
        aria-label="Go to next month"
      >
        <ChevronRight className="size-4" />
      </ButtonPrimitive>
    </div>
  )
}

// ── DateRangePicker ────────────────────────────────────────────────────────

export function DateRangePicker() {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [preset, setPreset] = useState<PresetId>("custom")

  function handleRangeChange(dates: [Date | null, Date | null]) {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
    setPreset("custom")
  }

  function handlePresetChange(id: string) {
    const p = PRESETS.find((x) => x.id === id)
    if (!p) return
    setPreset(id as PresetId)
    if (p.getRange) {
      const r = p.getRange()
      setStartDate(r.start)
      setEndDate(r.end)
    } else {
      setStartDate(null)
      setEndDate(null)
    }
  }

  const rangeLabel =
    startDate && endDate
      ? `${formatDate(startDate)} → ${formatDate(endDate)}`
      : startDate
        ? `${formatDate(startDate)} → ...`
        : "Select a date range"

  return (
    <div className="flex w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {/* ── Calendar panel ── */}
      <div className="rdp-custom flex-1 p-4">
        <DatePicker
          inline
          selectsRange
          startDate={startDate ?? undefined}
          endDate={endDate ?? undefined}
          onChange={handleRangeChange}
          renderCustomHeader={(props) => <CalendarHeader {...props} />}
          calendarClassName="!border-0 !shadow-none !bg-transparent w-full"
        />
      </div>

      {/* ── Preset panel ── */}
      <div className="flex w-56 flex-col border-l border-border">
        {/* Range display */}
        <div
          className="flex items-center gap-2 border-b border-border px-4 py-3"
          aria-live="polite"
          aria-atomic="true"
          aria-label={`Selected range: ${rangeLabel}`}
        >
          <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{rangeLabel}</span>
        </div>

        {/* Preset list */}
        <RadioGroup
          className="flex flex-col py-1"
          value={preset}
          onValueChange={(v) => handlePresetChange(v as string)}
          aria-label="Date range presets"
        >
          {PRESETS.map((p) => (
            <Radio.Root
              key={p.id}
              value={p.id}
              className={cn(
                "flex w-full cursor-pointer items-center px-4 py-2.5 text-sm transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                "hover:bg-accent hover:text-accent-foreground",
                preset === p.id
                  ? "bg-accent/60 font-medium text-accent-foreground"
                  : "text-foreground",
              )}
            >
              {p.label}
            </Radio.Root>
          ))}
        </RadioGroup>
      </div>
    </div>
  )
}
