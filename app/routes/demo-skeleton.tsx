"use client"

import { DemoBlock } from "~/components/ui/demo-block"
import BasicDemo from "~/components/ui/demos/skeleton/basic"
import basicCode from "~/components/ui/demos/skeleton/basic.tsx?raw"

export default function SkeletonDemo() {
  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Skeleton</h1>
        <p className="mt-1 text-sm text-muted-foreground">Placeholder preview while content is loading, reducing layout shift and perceived wait time.</p>
      </header>
      <DemoBlock title="Variants" description="Composite skeleton with optional avatar and paragraph rows. Sub-components: Skeleton.Button, Skeleton.Input." code={basicCode}>
        <BasicDemo />
      </DemoBlock>
    </div>
  )
}
