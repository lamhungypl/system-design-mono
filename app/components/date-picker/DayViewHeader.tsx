import { type ReactDatePickerCustomHeaderProps } from "react-datepicker"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { NavButton } from "./NavButton"

export function DayViewHeader({
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
        <span className="text-xs font-bold">&laquo;</span>
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
        <span className="text-xs font-bold">&raquo;</span>
      </NavButton>
    </div>
  )
}
