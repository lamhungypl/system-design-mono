"use client"

import { DemoBlock } from "~/components/ui/demo-block"
import BasicDemo from "~/components/ui/demos/radio/basic"
import basicCode from "~/components/ui/demos/radio/basic.tsx?raw"

export default function RadioDemo() {
  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Radio</h1>
        <p className="mt-1 text-sm text-muted-foreground">Radio button for selecting a single option from a set.</p>
      </header>
      <DemoBlock title="Radio and RadioGroup" description="Standalone radio, grouped options, button-style group with outline and solid variants." code={basicCode}>
        <BasicDemo />
      </DemoBlock>
    </div>
  )
}
