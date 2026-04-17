"use client"

import { DemoBlock } from "~/components/ui/demo-block"
import BasicDemo from "~/components/ui/demos/select/basic"
import basicCode from "~/components/ui/demos/select/basic.tsx?raw"

export default function SelectDemo() {
  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Select</h1>
        <p className="mt-1 text-sm text-muted-foreground">Select component to select a value from options. Supports grouping, sizes, and status.</p>
      </header>
      <DemoBlock title="Select variants" description="Sizes, grouped options, error/warning status, and disabled state." code={basicCode}>
        <BasicDemo />
      </DemoBlock>
    </div>
  )
}
