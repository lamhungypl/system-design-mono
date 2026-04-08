import { useRef, useState } from "react"
import { CalendarIcon } from "lucide-react"
import { Popover } from "@base-ui/react/popover"

import { cn } from "~/lib/utils"
import { formatDate, type DateRange, type RangePreset } from "~/lib/dateUtils"
import { RangePickerContext } from "./RangePickerContext"
import { RangePickerCalendar } from "./RangePickerCalendar"
import { RangePickerPresets } from "./RangePickerPresets"

export interface RangePickerProps {
  value?: DateRange
  defaultValue?: DateRange
  onChange?: (range: DateRange) => void
  name?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  placeholder?: string
  presets?: RangePreset[]
}

function getTriggerLabel(range: DateRange, placeholder: string): string {
  const { start, end } = range
  if (start && end) return `${formatDate(start)} \u2192 ${formatDate(end)}`
  if (start) return `${formatDate(start)} \u2192 ...`
  return placeholder
}

export function RangePicker({
  value,
  defaultValue,
  onChange,
  name,
  disabled = false,
  minDate,
  maxDate,
  placeholder = "Select date range",
  presets,
}: RangePickerProps) {
  const [internalRange, setInternalRange] = useState<DateRange>(
    defaultValue ?? { start: null, end: null }
  )
  const effectiveRange = value ?? internalRange

  function commitRange(next: DateRange) {
    if (value === undefined) setInternalRange(next)
    onChange?.(next)
  }

  const [open, setOpen] = useState(false)
  const [activePreset, setActivePreset] = useState("")
  const [viewMode, setViewMode] = useState<"days" | "months">("days")
  const [openToDate, setOpenToDate] = useState<Date>(
    effectiveRange.start ?? new Date()
  )
  const calendarRef = useRef<HTMLDivElement>(null)

  // Wrap commitRange to auto-close when a full range is selected
  function handleCommitRange(next: DateRange) {
    commitRange(next)
    if (next.start && next.end) {
      setOpen(false)
    }
  }

  const label = getTriggerLabel(effectiveRange, placeholder)

  return (
    <RangePickerContext.Provider
      value={{
        effectiveRange,
        commitRange: handleCommitRange,
        setOpen,
        disabled,
        minDate,
        maxDate,
        activePreset,
        setActivePreset,
        viewMode,
        setViewMode,
        openToDate,
        setOpenToDate,
        calendarRef,
      }}
    >
      {name && (
        <input
          type="hidden"
          name={name}
          value={
            effectiveRange.start && effectiveRange.end
              ? `${effectiveRange.start.toISOString()}/${effectiveRange.end.toISOString()}`
              : ""
          }
        />
      )}

      <Popover.Root open={open} onOpenChange={setOpen} modal={false}>
        <Popover.Trigger
          disabled={disabled}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium shadow-sm transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
            disabled && "pointer-events-none opacity-60"
          )}
        >
          <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
          {label}
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Positioner side="bottom" align="start" sideOffset={4}>
            <Popover.Popup className="overflow-hidden rounded-xl border border-border bg-card shadow-md outline-none">
              <div className="flex">
                {presets && presets.length > 0 && (
                  <RangePickerPresets presets={presets} />
                )}
                <RangePickerCalendar />
              </div>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </RangePickerContext.Provider>
  )
}
