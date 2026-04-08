// app/components/date-select/DateSelectCalendar/MonthGridView.tsx
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "~/lib/utils"
import { NavButton } from "./NavButton"

const MONTH_NAMES = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
]

export function MonthGridView({
  year,
  selected,
  onPrevYear,
  onNextYear,
  onPrevDecade,
  onNextDecade,
  onMonthSelect,
}: {
  year: number
  selected: Date | null
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

      <div className="grid grid-cols-3" role="grid" aria-label="Select month">
        {MONTH_NAMES.map((m, i) => {
          const isSelected =
            selected !== null &&
            selected.getFullYear() === year &&
            selected.getMonth() === i

          return (
            <button
              key={m}
              type="button"
              role="gridcell"
              onClick={() => onMonthSelect(i)}
              aria-selected={isSelected}
              aria-label={m}
              className={cn(
                "w-full rounded-full py-2.5 text-sm transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isSelected
                  ? "bg-primary font-semibold text-primary-foreground"
                  : "hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {m}
            </button>
          )
        })}
      </div>
    </div>
  )
}
