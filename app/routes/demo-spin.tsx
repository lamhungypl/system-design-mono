"use client"

import { DemoBlock } from "~/components/ui/demo-block"
import BasicDemo from "~/components/ui/demos/spin/basic"
import basicCode from "~/components/ui/demos/spin/basic.tsx?raw"

export default function SpinDemo() {
  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Spin</h1>
        <p className="mt-1 text-sm text-muted-foreground">A loading spinner. Use standalone or wrap content to show a loading overlay.</p>
      </header>
      <DemoBlock title="Sizes and overlay" description="Three sizes. Wrap any content with spinning prop to overlay a blur + spinner." code={basicCode}>
        <BasicDemo />
      </DemoBlock>
    </div>
  )
}
