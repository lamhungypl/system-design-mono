"use client"

import { DemoBlock } from "~/components/ui/demo-block"
import BasicDemo from "~/components/ui/demos/input-number/basic"
import basicCode from "~/components/ui/demos/input-number/basic.tsx?raw"

export default function InputNumberDemo() {
  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-xl font-semibold">InputNumber</h1>
        <p className="mt-1 text-sm text-muted-foreground">Numeric input with increment/decrement controls. Supports min, max, step, prefix/suffix, and precision.</p>
      </header>
      <DemoBlock title="Sizes, affixes, and states" description="Three sizes, prefix/suffix decorators, no-controls mode, disabled, and error status." code={basicCode}>
        <BasicDemo />
      </DemoBlock>
    </div>
  )
}
