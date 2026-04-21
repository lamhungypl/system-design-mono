"use client"

import { useRef, useState } from "react"
import { Affix } from "~/components/ui/affix"
import { Button } from "~/components/ui/button"
import { DemoSection } from "~/components/ui/demo-block"

export default function AffixBasicDemo() {
  const [affixed, setAffixed] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  return (
    <div className="flex flex-col gap-4">
      <DemoSection label={`Scroll the inner area — the button pins (${affixed ? "pinned" : "unpinned"})`}>
        <div ref={scrollRef} className="relative h-48 overflow-auto rounded-lg border border-border p-4">
          <div className="h-24 text-xs text-muted-foreground">
            Scroll down inside this container…
          </div>
          <Affix offsetTop={8} target={() => scrollRef.current} onChange={setAffixed}>
            <Button size="sm" variant={affixed ? "default" : "outline"}>
              {affixed ? "I'm pinned!" : "Scroll me to pin"}
            </Button>
          </Affix>
          <div className="h-72 mt-4 text-xs text-muted-foreground">
            Keep going — the button sticks to the top of the scroll container.
          </div>
        </div>
      </DemoSection>
    </div>
  )
}
