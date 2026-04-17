"use client"

import { DemoBlock } from "~/components/ui/demo-block"

import BasicDemo from "~/components/date-picker/demos/calendar-basic"
import basicCode from "~/components/date-picker/demos/calendar-basic.tsx?raw"

import ConstraintsDemo from "~/components/date-picker/demos/calendar-constraints"
import constraintsCode from "~/components/date-picker/demos/calendar-constraints.tsx?raw"

export default function CalendarDemo() {
  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Calendar</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Inline calendar for date selection without a popover trigger.
        </p>
      </header>

      <DemoBlock
        title="Basic"
        description="Controlled inline calendar — click any day to select it."
        code={basicCode}
      >
        <BasicDemo />
      </DemoBlock>

      <DemoBlock
        title="Min / Max date & disabled"
        description="Restrict the selectable range with minDate and maxDate, or lock the calendar entirely with disabled."
        code={constraintsCode}
      >
        <ConstraintsDemo />
      </DemoBlock>
    </div>
  )
}
