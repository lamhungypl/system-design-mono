"use client"

import { DemoBlock } from "~/components/ui/demo-block"
import BasicDemo from "~/components/ui/demos/checkbox/basic"
import basicCode from "~/components/ui/demos/checkbox/basic.tsx?raw"

export default function CheckboxDemo() {
  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Checkbox</h1>
        <p className="mt-1 text-sm text-muted-foreground">Checkbox component for selecting one or more options from a set.</p>
      </header>
      <DemoBlock title="Checkbox and CheckboxGroup" description="Standalone controlled checkbox, indeterminate state, disabled states, and grouped variants in both directions." code={basicCode}>
        <BasicDemo />
      </DemoBlock>
    </div>
  )
}
