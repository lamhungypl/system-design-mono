"use client"

import { DemoBlock } from "~/components/ui/demo-block"
import BasicDemo from "~/components/ui/demos/card/basic"
import basicCode from "~/components/ui/demos/card/basic.tsx?raw"

export default function CardDemo() {
  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Card</h1>
        <p className="mt-1 text-sm text-muted-foreground">A basic container with a header and body. Supports loading states and Card.Meta for user/entity cards.</p>
      </header>
      <DemoBlock title="Card variants" description="Basic card, card with extra action, meta card for user profiles, and a loading skeleton state." code={basicCode}>
        <BasicDemo />
      </DemoBlock>
    </div>
  )
}
