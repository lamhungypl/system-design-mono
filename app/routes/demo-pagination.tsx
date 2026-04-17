"use client"

import { DemoBlock } from "~/components/ui/demo-block"
import BasicDemo from "~/components/ui/demos/pagination/basic"
import basicCode from "~/components/ui/demos/pagination/basic.tsx?raw"

export default function PaginationDemo() {
  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Pagination</h1>
        <p className="mt-1 text-sm text-muted-foreground">Long list pagination. Shows page numbers with ellipsis, page size selector, and quick jumper.</p>
      </header>
      <DemoBlock title="Controlled, full-featured, simple, and disabled" description="All pagination modes including total display, size changer, quick jumper, and simple compact variant." code={basicCode}>
        <BasicDemo />
      </DemoBlock>
    </div>
  )
}
