"use client"

import { DemoBlock } from "~/components/ui/demo-block"
import BasicDemo from "~/components/ui/demos/popover/basic"
import basicCode from "~/components/ui/demos/popover/basic.tsx?raw"

export default function PopoverDemo() {
  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Popover</h1>
        <p className="mt-1 text-sm text-muted-foreground">The floating card popped by clicking or hovering. Richer than a tooltip — supports a title, body, and any React content.</p>
      </header>
      <DemoBlock title="Placements and rich content" description="All four side placements and a popover containing interactive elements." code={basicCode}>
        <BasicDemo />
      </DemoBlock>
    </div>
  )
}
