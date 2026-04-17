"use client"

import { DemoBlock } from "~/components/ui/demo-block"
import BasicDemo from "~/components/ui/demos/tag/basic"
import basicCode from "~/components/ui/demos/tag/basic.tsx?raw"
import ClosableDemo from "~/components/ui/demos/tag/closable"
import closableCode from "~/components/ui/demos/tag/closable.tsx?raw"

export default function TagDemo() {
  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Tag</h1>
        <p className="mt-1 text-sm text-muted-foreground">Tag for categorizing or marking content. Can be used for labeling, status, or filtering.</p>
      </header>
      <DemoBlock title="Colors" description="Preset semantic colors: default, primary, success, warning, error, processing." code={basicCode}>
        <BasicDemo />
      </DemoBlock>
      <DemoBlock title="Closable tags" description="Tags can be dismissed by the user with the closable prop." code={closableCode}>
        <ClosableDemo />
      </DemoBlock>
    </div>
  )
}
