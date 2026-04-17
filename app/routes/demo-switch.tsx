"use client"

import { DemoBlock } from "~/components/ui/demo-block"
import BasicDemo from "~/components/ui/demos/switch/basic"
import basicCode from "~/components/ui/demos/switch/basic.tsx?raw"

export default function SwitchDemo() {
  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Switch</h1>
        <p className="mt-1 text-sm text-muted-foreground">Toggle switch for toggling a single setting on or off.</p>
      </header>
      <DemoBlock title="Switch variants" description="Default and small sizes. Disabled, loading, with check/uncheck labels, and with associated text label." code={basicCode}>
        <BasicDemo />
      </DemoBlock>
    </div>
  )
}
