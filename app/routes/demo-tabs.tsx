"use client"

import { DemoBlock } from "~/components/ui/demo-block"
import BasicDemo from "~/components/ui/demos/tabs/basic"
import basicCode from "~/components/ui/demos/tabs/basic.tsx?raw"

export default function TabsDemo() {
  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Tabs</h1>
        <p className="mt-1 text-sm text-muted-foreground">Tabs organize content into multiple sections. Users navigate between them without leaving the page.</p>
      </header>
      <DemoBlock title="Line, card, and small" description="Default line tabs with animated indicator, card variant, small size, and disabled tab." code={basicCode}>
        <BasicDemo />
      </DemoBlock>
    </div>
  )
}
