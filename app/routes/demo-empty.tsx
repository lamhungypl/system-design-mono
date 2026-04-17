"use client"

import { DemoBlock } from "~/components/ui/demo-block"
import BasicDemo from "~/components/ui/demos/empty/basic"
import basicCode from "~/components/ui/demos/empty/basic.tsx?raw"

export default function EmptyDemo() {
  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Empty</h1>
        <p className="mt-1 text-sm text-muted-foreground">Empty state placeholder used when there's no data to display.</p>
      </header>
      <DemoBlock title="Empty states" description="Default illustration, custom description, and fully custom image with an action button." code={basicCode}>
        <BasicDemo />
      </DemoBlock>
    </div>
  )
}
