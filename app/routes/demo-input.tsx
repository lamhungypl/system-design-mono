"use client"

import { DemoBlock } from "~/components/ui/demo-block"
import BasicDemo from "~/components/ui/demos/input/basic"
import basicCode from "~/components/ui/demos/input/basic.tsx?raw"

export default function InputDemo() {
  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Input</h1>
        <p className="mt-1 text-sm text-muted-foreground">Basic text input field. Supports prefix/suffix icons, addons, clear button, validation states, password, and textarea.</p>
      </header>
      <DemoBlock title="All variants" description="Sizes, prefix, suffix, addons, clear, error/warning status, disabled, password, and textarea." code={basicCode}>
        <BasicDemo />
      </DemoBlock>
    </div>
  )
}
