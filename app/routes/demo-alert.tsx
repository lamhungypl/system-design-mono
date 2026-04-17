"use client"

import { DemoBlock } from "~/components/ui/demo-block"
import BasicDemo from "~/components/ui/demos/alert/basic"
import basicCode from "~/components/ui/demos/alert/basic.tsx?raw"
import DescriptionDemo from "~/components/ui/demos/alert/with-description"
import descriptionCode from "~/components/ui/demos/alert/with-description.tsx?raw"

export default function AlertDemo() {
  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Alert</h1>
        <p className="mt-1 text-sm text-muted-foreground">Display a short, important message in a way that attracts attention without interrupting the user's task.</p>
      </header>
      <DemoBlock title="Types" description="Four semantic variants: info, success, warning, and error." code={basicCode}>
        <BasicDemo />
      </DemoBlock>
      <DemoBlock title="With description and icon" description="Show an icon alongside a title and descriptive text. Alerts can also be dismissed with closable." code={descriptionCode}>
        <DescriptionDemo />
      </DemoBlock>
    </div>
  )
}
