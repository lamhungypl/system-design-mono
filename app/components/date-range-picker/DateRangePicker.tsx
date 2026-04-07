import { useState } from "react"
import DatePicker, {
  type ReactDatePickerCustomHeaderProps,
} from "react-datepicker"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { RadioGroup, Radio } from "@base-ui/react"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "~/lib/utils"
import {
  type DateRange,
  type Preset,
  PRESETS,
  formatDate,
} from "~/lib/dateUtils"

import "./date-range-picker.css"

// ── Slot prop types ────────────────────────────────────────────────────────

export interface CalendarSlotProps {
  minDate?: Date
  maxDate?: Date
  /** Initial month to display. Changes after mount are ignored. */
  openToDate?: Date
  className?: string
}

export interface PresetsSlotProps {
  /** Override the default preset list. */
  presets?: Preset[]
  /** Hide the preset panel entirely; calendar fills full width. */
  hidden?: boolean
  className?: string
}

// ── Public props ───────────────────────────────────────────────────────────

export interface DateRangePickerProps {
  /** Controlled value. When provided, internal state is ignored. */
  value?: DateRange
  /** Initial value for uncontrolled mode. */
  defaultValue?: DateRange
  /** Fires on every change regardless of controlled/uncontrolled mode. */
  onChange?: (range: DateRange) => void
  /** For form association (e.g. passed by react-hook-form Controller). */
  name?: string
  disabled?: boolean
  slotProps?: {
    calendar?: CalendarSlotProps
    presets?: PresetsSlotProps
  }
}

// ── Types ──────────────────────────────────────────────────────────────────

type ViewMode = "days" | "months"

// ── Nav button ─────────────────────────────────────────────────────────────

function NavButton({
  onClick,
  "aria-label": ariaLabel,
  children,
  muted = false,
  disabled = false,
}: {
  onClick: () => void
  "aria-label": string
  children: React.ReactNode
  muted?: boolean
  disabled?: boolean
}) {
  return (
    <ButtonPrimitive
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-md transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        muted
          ? "text-muted-foreground/40 hover:bg-muted hover:text-muted-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        disabled && "pointer-events-none opacity-40",
      )}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
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
        type="button"
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

// Returns the highlight state for a given month cell relative to the range.
// Compares by month boundaries (ignores day-within-month).
function getMonthHighlight(
  year: number,
  month: number,
  range: DateRange,
): "none" | "single" | "start" | "end" | "in-range" {
  const { start, end } = range
  if (!start) return "none"

  const thisMonth = new Date(year, month, 1).getTime()
  const startMonth = new Date(start.getFullYear(), start.getMonth(), 1).getTime()
  const endMonth = end
    ? new Date(end.getFullYear(), end.getMonth(), 1).getTime()
    : startMonth

  if (thisMonth === startMonth && thisMonth === endMonth) return "single"
  if (thisMonth === startMonth) return "start"
  if (thisMonth === endMonth) return "end"
  if (thisMonth > startMonth && thisMonth < endMonth) return "in-range"
  return "none"
}

function MonthGridView({
  year,
  range,
  onPrevYear,
  onNextYear,
  onPrevDecade,
  onNextDecade,
  onMonthSelect,
}: {
  year: number
  range: DateRange
  onPrevYear: () => void
  onNextYear: () => void
  onPrevDecade: () => void
  onNextDecade: () => void
  onMonthSelect: (month: number) => void
}) {
  return (
    <div>
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

      {/* No gap between cells — wrappers provide a connected strip background */}
      <div className="grid grid-cols-3" role="grid" aria-label="Select month">
        {MONTH_NAMES.map((m, i) => {
          const highlight = getMonthHighlight(year, i, range)
          const isSelected =
            highlight === "start" || highlight === "end" || highlight === "single"

          return (
            <div
              key={m}
              className={cn(
                highlight === "in-range" && "bg-primary/15",
                highlight === "start" &&
                  "bg-gradient-to-r from-transparent from-50% to-primary/15 to-50%",
                highlight === "end" &&
                  "bg-gradient-to-l from-transparent from-50% to-primary/15 to-50%",
              )}
            >
              <button
                type="button"
                role="gridcell"
                onClick={() => onMonthSelect(i)}
                aria-selected={highlight !== "none"}
                aria-label={m}
                className={cn(
                  "relative z-10 w-full rounded-full py-2.5 text-sm transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isSelected
                    ? "bg-primary font-semibold text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground",
                )}
              >
                {m}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── DateRangePicker ────────────────────────────────────────────────────────

export function DateRangePicker({
  value,
  defaultValue,
  onChange,
  name,
  disabled = false,
  slotProps,
}: DateRangePickerProps) {
  const calendarSlot = slotProps?.calendar
  const presetsSlot = slotProps?.presets
  const activePresets = presetsSlot?.presets ?? PRESETS

  // ── Controlled / uncontrolled value ───────────────────────────────────
  const [internalRange, setInternalRange] = useState<DateRange>(
    defaultValue ?? { start: null, end: null },
  )
  const effectiveRange = value ?? internalRange

  const startDate = effectiveRange.start
  const endDate = effectiveRange.end

  function commitRange(next: DateRange) {
    if (value === undefined) setInternalRange(next)
    onChange?.(next)
  }

  // ── UI-only state (not part of external value) ─────────────────────────
  const [activePreset, setActivePreset] = useState<string>("custom")
  const [viewMode, setViewMode] = useState<ViewMode>("days")
  const [openToDate, setOpenToDate] = useState<Date>(
    calendarSlot?.openToDate ?? new Date(),
  )

  // ── Handlers ───────────────────────────────────────────────────────────

  function handleRangeChange(dates: [Date | null, Date | null]) {
    const [start, end] = dates
    commitRange({ start, end })
    setActivePreset("custom")
  }

  function handlePresetChange(id: string) {
    const p = activePresets.find((x) => x.id === id)
    if (!p) return
    setActivePreset(id)
    if (p.getRange) {
      const r = p.getRange()
      commitRange(r)
      setOpenToDate(r.start)
    } else {
      commitRange({ start: null, end: null })
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

  // ── Range label ────────────────────────────────────────────────────────

  const rangeLabel =
    startDate && endDate
      ? `${formatDate(startDate)} → ${formatDate(endDate)}`
      : startDate
        ? `${formatDate(startDate)} → ...`
        : "Select a date range"

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div
      className={cn(
        "flex w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-card shadow-sm",
        disabled && "pointer-events-none opacity-60",
      )}
      aria-disabled={disabled}
      data-name={name}
    >
      {/* ── Calendar panel ── */}
      <div className={cn("rdp-custom flex-1 p-4", calendarSlot?.className)}>
        {viewMode === "months" ? (
          <MonthGridView
            year={openToDate.getFullYear()}
            range={{ start: startDate, end: endDate }}
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
            minDate={calendarSlot?.minDate}
            maxDate={calendarSlot?.maxDate}
            disabled={disabled}
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
      {!presetsSlot?.hidden && (
        <div
          className={cn(
            "flex w-56 flex-col border-l border-border",
            presetsSlot?.className,
          )}
        >
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
            value={activePreset}
            onValueChange={handlePresetChange}
            aria-label="Date range presets"
            disabled={disabled}
          >
            {activePresets.map((p) => (
              <Radio.Root
                key={p.id}
                value={p.id}
                disabled={disabled}
                className={cn(
                  "flex w-full cursor-pointer items-center px-4 py-2.5 text-sm transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                  "hover:bg-accent hover:text-accent-foreground",
                  activePreset === p.id
                    ? "bg-accent/60 font-medium text-accent-foreground"
                    : "text-foreground",
                  disabled && "cursor-not-allowed",
                )}
              >
                {p.label}
              </Radio.Root>
            ))}
          </RadioGroup>
        </div>
      )}
    </div>
  )
}
