"use client"

import { DemoBlock } from "~/components/ui/demo-block"
import BasicDemo from "~/components/ui/demos/typography/basic"
import basicCode from "~/components/ui/demos/typography/basic.tsx?raw"

export default function TypographyDemo() {
  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Typography</h1>
        <p className="mt-1 text-sm text-muted-foreground">Basic text writing, including headings, body text, links, and decorative text modifiers.</p>
      </header>
      <DemoBlock title="Title, Text, Paragraph, and Link" description="All typography components with their variants — semantic types, text decorations, and truncation." code={basicCode}>
        <BasicDemo />
      </DemoBlock>
    </div>
  )
}
