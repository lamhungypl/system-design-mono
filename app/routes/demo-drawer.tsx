"use client"

import { DemoBlock } from "~/components/ui/demo-block"
import BasicDemo from "~/components/ui/demos/drawer/basic"
import basicCode from "~/components/ui/demos/drawer/basic.tsx?raw"

export default function DrawerDemo() {
  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Drawer</h1>
        <p className="mt-1 text-sm text-muted-foreground">A panel that slides in from the edge of the screen. Used for forms, detail views, and navigation drawers.</p>
      </header>
      <DemoBlock title="All four placements" description="Right (default), left, top, and bottom placement with header, scrollable body, and footer slot." code={basicCode}>
        <BasicDemo />
      </DemoBlock>
    </div>
  )
}
