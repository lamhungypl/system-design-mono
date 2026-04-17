"use client"

import { DemoBlock } from "~/components/ui/demo-block"
import BasicDemo from "~/components/ui/demos/badge/basic"
import basicCode from "~/components/ui/demos/badge/basic.tsx?raw"
import StatusDemo from "~/components/ui/demos/badge/status"
import statusCode from "~/components/ui/demos/badge/status.tsx?raw"

export default function BadgeDemo() {
  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Badge</h1>
        <p className="mt-1 text-sm text-muted-foreground">Small numerical value or status descriptor for UI elements.</p>
      </header>
      <DemoBlock title="Count and dot" description="Overlay a numeric count or dot on any element. Use overflowCount to cap the display." code={basicCode}>
        <BasicDemo />
      </DemoBlock>
      <DemoBlock title="Status badge" description="Standalone status indicator with optional label text." code={statusCode}>
        <StatusDemo />
      </DemoBlock>
    </div>
  )
}
