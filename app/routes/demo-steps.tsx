"use client"

import { DemoBlock } from "~/components/ui/demo-block"
import BasicDemo from "~/components/ui/demos/steps/basic"
import basicCode from "~/components/ui/demos/steps/basic.tsx?raw"

export default function StepsDemo() {
  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Steps</h1>
        <p className="mt-1 text-sm text-muted-foreground">Guides users through a sequence of steps in a process or workflow.</p>
      </header>
      <DemoBlock title="Horizontal, vertical, and small" description="Interactive clickable steps, vertical timeline layout, and compact small size." code={basicCode}>
        <BasicDemo />
      </DemoBlock>
    </div>
  )
}
