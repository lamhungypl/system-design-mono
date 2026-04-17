"use client"

import { Calendar } from "~/components/date-picker/Calendar"
import { DemoSection } from "~/components/ui/demo-block"

const today = new Date()
const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5)
const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10)

export default function CalendarConstraintsDemo() {
  return (
    <div className="flex flex-wrap gap-8">
      <DemoSection label="Min / Max date (±5 days from today)">
        <Calendar minDate={minDate} maxDate={maxDate} defaultValue={today} />
      </DemoSection>
      <DemoSection label="Disabled">
        <Calendar disabled defaultValue={today} />
      </DemoSection>
    </div>
  )
}
