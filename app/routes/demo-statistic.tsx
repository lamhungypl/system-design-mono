"use client"

import { DemoBlock } from "~/components/ui/demo-block"
import BasicDemo from "~/components/ui/demos/statistic/basic"
import basicCode from "~/components/ui/demos/statistic/basic.tsx?raw"

export default function StatisticDemo() {
  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Statistic</h1>
        <p className="mt-1 text-sm text-muted-foreground">Display a statistic number with a label. Supports prefix, suffix, and precision formatting.</p>
      </header>
      <DemoBlock title="Basic statistics" description="Numeric values with labels. Use prefix/suffix for units and precision for decimal formatting." code={basicCode}>
        <BasicDemo />
      </DemoBlock>
    </div>
  )
}
