"use client"

import { DemoBlock } from "~/components/ui/demo-block"

import BasicDemo from "~/components/date-picker/demos/basic"
import basicCode from "~/components/date-picker/demos/basic.tsx?raw"

import WithPresetsDemo from "~/components/date-picker/demos/with-presets"
import withPresetsCode from "~/components/date-picker/demos/with-presets.tsx?raw"

import UncontrolledDemo from "~/components/date-picker/demos/uncontrolled"
import uncontrolledCode from "~/components/date-picker/demos/uncontrolled.tsx?raw"

import MinMaxDemo from "~/components/date-picker/demos/min-max"
import minMaxCode from "~/components/date-picker/demos/min-max.tsx?raw"

import DisabledDemo from "~/components/date-picker/demos/disabled"
import disabledCode from "~/components/date-picker/demos/disabled.tsx?raw"

export default function DatePickerDemo() {
  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-xl font-semibold">DatePicker</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A single-date picker with an optional presets sidebar.
        </p>
      </header>

      <DemoBlock
        title="Basic"
        description="Calendar-only — no presets prop."
        code={basicCode}
      >
        <BasicDemo />
      </DemoBlock>

      <DemoBlock
        title="With presets"
        description="Pass a presets array to show a sidebar alongside the calendar."
        code={withPresetsCode}
      >
        <WithPresetsDemo />
      </DemoBlock>

      <DemoBlock
        title="Uncontrolled"
        description="No value prop — internal state only. Use name for form association."
        code={uncontrolledCode}
      >
        <UncontrolledDemo />
      </DemoBlock>

      <DemoBlock
        title="Min / Max date"
        description="Restrict selectable dates with minDate and maxDate."
        code={minMaxCode}
      >
        <MinMaxDemo />
      </DemoBlock>

      <DemoBlock
        title="Disabled"
        description="Pass disabled to lock the picker."
        code={disabledCode}
      >
        <DisabledDemo />
      </DemoBlock>
    </div>
  )
}
