"use client"

import { DemoBlock } from "~/components/ui/demo-block"
import BasicDemo from "~/components/ui/demos/button/basic"
import basicCode from "~/components/ui/demos/button/basic.tsx?raw"

export default function ButtonDemo() {
  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Button</h1>
        <p className="mt-1 text-sm text-muted-foreground">Triggers an action or event. Variants convey importance; sizes adapt to context.</p>
      </header>
      <DemoBlock title="Variants and sizes" description="Six variants (primary, secondary, outline, ghost, destructive, link), four sizes, disabled and loading states." code={basicCode}>
        <BasicDemo />
      </DemoBlock>
    </div>
  )
}
