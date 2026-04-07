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

// ── Types ──────────────────────────────────────────────────────────────────

type ViewMode = "days" | "months"

// ── Nav button ─────────────────────────────────────────────────────────────

function NavButton({
  onClick,
  "aria-label": ariaLabel,
  children,
  muted = false,
}: {
  onClick: () => void
  "aria-label": string
  children: React.ReactNode
  muted?: boolean
}) {
  return (
    <ButtonPrimitive
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-md transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        muted
          ? "text-muted-foreground/40 hover:bg-muted hover:text-muted-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
      onClick={(e) => {
        e.preventDefault()
        onClick()
      }}
      aria-label={ariaLabel}
    >
      {children}
    </ButtonPrimitive>
  )
}

// ── Day-view custom header ─────────────────────────────────────────────────

function DayViewHeader({
  date,
  decreaseMonth,
  increaseMonth,
  decreaseYear,
  increaseYear,
  onTitleClick,
}: ReactDatePickerCustomHeaderProps & { onTitleClick: () => void }) {
  const title = date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  return (
    <div className="mb-3 flex items-center gap-1">
      <NavButton onClick={decreaseYear} aria-label="Previous year">
        <span className="text-xs font-bold">«</span>
      </NavButton>
      <NavButton onClick={decreaseMonth} aria-label="Previous month">
        <ChevronLeft className="size-3.5" />
      </NavButton>

      <button
        className="flex flex-1 cursor-pointer items-center justify-center rounded-md px-2 py-1 text-sm font-medium transition-colors hover:bg-accent"
        onClick={onTitleClick}
        aria-label={`Switch to month picker, currently showing ${title}`}
      >
        {title}
      </button>

      <NavButton onClick={increaseMonth} aria-label="Next month">
        <ChevronRight className="size-3.5" />
      </NavButton>
      <NavButton onClick={increaseYear} aria-label="Next year">
        <span className="text-xs font-bold">»</span>
      </NavButton>
    </div>
  )
}

// ── Month-grid view ────────────────────────────────────────────────────────

const MONTH_NAMES = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
]

function MonthGridView({
  year,
  onPrevYear,
  onNextYear,
  onPrevDecade,
  onNextDecade,
  onMonthSelect,
}: {
  year: number
  onPrevYear: () => void
  onNextYear: () => void
  onPrevDecade: () => void
  onNextDecade: () => void
  onMonthSelect: (month: number) => void
}) {
  return (
    <div>
      {/* Header: « ‹ [Year] › » */}
      <div className="mb-4 flex items-center gap-1">
        <NavButton onClick={onPrevDecade} aria-label="Previous decade" muted>
          <span className="text-xs font-bold">«</span>
        </NavButton>
        <NavButton onClick={onPrevYear} aria-label="Previous year">
          <ChevronLeft className="size-3.5" />
        </NavButton>

        <div className="flex flex-1 items-center justify-center">
          <span className="rounded-md bg-accent px-3 py-1 text-sm font-semibold text-accent-foreground">
            {year}
          </span>
        </div>

        <NavButton onClick={onNextYear} aria-label="Next year">
          <ChevronRight className="size-3.5" />
        </NavButton>
        <NavButton onClick={onNextDecade} aria-label="Next decade" muted>
          <span className="text-xs font-bold">»</span>
        </NavButton>
      </div>

      {/* 3×4 month grid */}
      <div className="grid grid-cols-3 gap-1" role="grid" aria-label="Select month">
        {MONTH_NAMES.map((m, i) => (
          <button
            key={m}
            role="gridcell"
            onClick={() => onMonthSelect(i)}
            className="rounded-md px-2 py-2.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── DateRangePicker ────────────────────────────────────────────────────────

export function DateRangePicker() {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [preset, setPreset] = useState<PresetId>("custom")
  const [viewMode, setViewMode] = useState<ViewMode>("days")
  const [openToDate, setOpenToDate] = useState<Date>(new Date())

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
      setOpenToDate(r.start)
    } else {
      setStartDate(null)
      setEndDate(null)
    }
    setViewMode("days")
  }

  function handleMonthSelect(month: number) {
    setOpenToDate(new Date(openToDate.getFullYear(), month, 1))
    setViewMode("days")
  }

  function shiftYear(delta: number) {
    setOpenToDate((d) => new Date(d.getFullYear() + delta, d.getMonth(), 1))
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
        {viewMode === "months" ? (
          <MonthGridView
            year={openToDate.getFullYear()}
            onPrevYear={() => shiftYear(-1)}
            onNextYear={() => shiftYear(1)}
            onPrevDecade={() => shiftYear(-10)}
            onNextDecade={() => shiftYear(10)}
            onMonthSelect={handleMonthSelect}
          />
        ) : (
          <DatePicker
            inline
            selectsRange
            startDate={startDate ?? undefined}
            endDate={endDate ?? undefined}
            onChange={handleRangeChange}
            openToDate={openToDate}
            onMonthChange={(date) => setOpenToDate(date)}
            renderCustomHeader={(props) => (
              <DayViewHeader
                {...props}
                onTitleClick={() => setViewMode("months")}
              />
            )}
            calendarClassName="!border-0 !shadow-none !bg-transparent w-full"
          />
        )}
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
