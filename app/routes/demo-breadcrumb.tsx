"use client"

import { DemoBlock } from "~/components/ui/demo-block"
import BasicDemo from "~/components/ui/demos/breadcrumb/basic"
import basicCode from "~/components/ui/demos/breadcrumb/basic.tsx?raw"

export default function BreadcrumbDemo() {
  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Breadcrumb</h1>
        <p className="mt-1 text-sm text-muted-foreground">Captures the current page location within a navigational hierarchy.</p>
      </header>
      <DemoBlock title="Basic and custom separator" description="Default chevron separator, slash separator, and multi-level navigation paths." code={basicCode}>
        <BasicDemo />
      </DemoBlock>
    </div>
  )
}
