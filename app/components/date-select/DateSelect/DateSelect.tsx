// app/components/date-select/DateSelect/DateSelect.tsx
import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { Popover } from "@base-ui/react/popover"

import { cn } from "~/lib/utils"
import { formatDate } from "~/lib/dateUtils"
import { DateSelectContext } from "../DateSelectContext"
import { DateSelectCalendar } from "../DateSelectCalendar/DateSelectCalendar"

export interface DateSelectProps {
  /** Controlled value. When provided, internal state is ignored. */
  value?: Date | null
  /** Initial value for uncontrolled mode. */
  defaultValue?: Date | null
  /** Fires on every committed change. */
  onChange?: (date: Date | null) => void
  /** For form association (hidden input). */
  name?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  /** Trigger text when no date is selected. Default: "Select date" */
  placeholder?: string
}

export function DateSelect({
  value,
  defaultValue,
  onChange,
  name,
  disabled = false,
  minDate,
  maxDate,
  placeholder = "Select date",
}: DateSelectProps) {
  const [internalValue, setInternalValue] = useState<Date | null>(
    defaultValue ?? null
  )
  const effectiveValue = value !== undefined ? value : internalValue

  function commitValue(date: Date | null) {
    if (value === undefined) setInternalValue(date)
    onChange?.(date)
  }

  const [open, setOpen] = useState(false)

  const label = effectiveValue ? formatDate(effectiveValue) : placeholder

  return (
    <DateSelectContext.Provider
      value={{ effectiveValue, commitValue, setOpen, disabled, minDate, maxDate }}
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
              <DateSelectCalendar />
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </DateSelectContext.Provider>
  )
}
