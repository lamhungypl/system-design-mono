"use client"

import { DemoBlock } from "~/components/ui/demo-block"
import BasicDemo from "~/components/ui/demos/progress/basic"
import basicCode from "~/components/ui/demos/progress/basic.tsx?raw"

export default function ProgressDemo() {
  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Progress</h1>
        <p className="mt-1 text-sm text-muted-foreground">Display the current progress of an operation flow. Supports line and circle types with status variants.</p>
      </header>
      <DemoBlock title="Line and circle progress" description="All status variants (normal, active, success, exception), circle type, and interactive percent control." code={basicCode}>
        <BasicDemo />
      </DemoBlock>
    </div>
  )
}
