"use client"

import { DemoBlock } from "~/components/ui/demo-block"
import BasicDemo from "~/components/ui/demos/slider/basic"
import basicCode from "~/components/ui/demos/slider/basic.tsx?raw"

export default function SliderDemo() {
  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Slider</h1>
        <p className="mt-1 text-sm text-muted-foreground">A slider component for selecting a value or range from a bounded range.</p>
      </header>
      <DemoBlock title="Basic, range, marks, and disabled" description="Single value, range (two thumbs), custom mark labels at specific values, and disabled state." code={basicCode}>
        <BasicDemo />
      </DemoBlock>
    </div>
  )
}
