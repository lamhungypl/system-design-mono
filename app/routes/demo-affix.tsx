"use client"

import { DemoBlock } from "~/components/ui/demo-block"

import BasicDemo from "~/components/ui/demos/affix/basic"
import basicCode from "~/components/ui/demos/affix/basic.tsx?raw"

export default function AffixDemo() {
  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Affix</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Wraps its children and pins them to a position in the viewport (or a scroll
          container) once they would otherwise scroll out of view. Useful for
          jump-to-top buttons, floating action bars, or keeping a filter toolbar visible
          while scrolling through a long list.
        </p>
      </header>

      <DemoBlock
        title="Basic"
        description="Pin to the top of a custom scroll container via target. The button becomes fixed when it hits offsetTop pixels from the container top."
        code={basicCode}
      >
        <BasicDemo />
      </DemoBlock>
    </div>
  )
}
