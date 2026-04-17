"use client"

import { useState } from "react"
import { Calendar } from "~/components/date-picker/Calendar"
import { DemoSection } from "~/components/ui/demo-block"

export default function CalendarBasicDemo() {
  const [value, setValue] = useState<Date | null>(new Date())

  return (
    <div className="flex flex-col gap-8">
      <DemoSection label={`Selected: ${value ? value.toLocaleDateString() : "none"}`}>
        <Calendar value={value} onChange={setValue} />
      </DemoSection>
    </div>
  )
}
