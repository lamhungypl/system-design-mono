import { useRef, useState } from "react"
import { CalendarIcon } from "lucide-react"
import { Popover } from "@base-ui/react/popover"

import { cn } from "~/lib/utils"
import { formatDate, type DatePreset } from "~/lib/dateUtils"
import { DatePickerContext } from "./DatePickerContext"
import { DatePickerCalendar } from "./DatePickerCalendar"
import { DatePickerPresets } from "./DatePickerPresets"

export interface DatePickerProps {
  value?: Date | null
  defaultValue?: Date | null
  onChange?: (date: Date | null) => void
  name?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  placeholder?: string
  presets?: DatePreset[]
}

export function DatePicker({
  value,
  defaultValue,
  onChange,
  name,
  disabled = false,
  minDate,
  maxDate,
  placeholder = "Select date",
  presets,
}: DatePickerProps) {
  const [internalValue, setInternalValue] = useState<Date | null>(
    defaultValue ?? null
  )
  const effectiveValue = value !== undefined ? value : internalValue

  function commitValue(date: Date | null) {
    if (value === undefined) setInternalValue(date)
    onChange?.(date)
  }

  const [open, setOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"days" | "months">("days")
  const [openToDate, setOpenToDate] = useState<Date>(
    effectiveValue ?? new Date()
  )
  const calendarRef = useRef<HTMLDivElement>(null)

  const label = effectiveValue ? formatDate(effectiveValue) : placeholder

  return (
    <DatePickerContext.Provider
      value={{
        effectiveValue,
        commitValue,
        setOpen,
        disabled,
        minDate,
        maxDate,
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
          value={effectiveValue?.toISOString() ?? ""}
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
                  <DatePickerPresets presets={presets} />
                )}
                <DatePickerCalendar />
              </div>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </DatePickerContext.Provider>
  )
}
