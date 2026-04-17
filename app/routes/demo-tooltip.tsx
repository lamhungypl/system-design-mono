"use client"

import { DemoBlock } from "~/components/ui/demo-block"
import {
  Tooltip,
  TooltipArrow,
  TooltipPopup,
  TooltipPortal,
  TooltipPositioner,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip"
import { Button } from "~/components/ui/button"

const basicCode = `import {
  Tooltip, TooltipArrow, TooltipPopup,
  TooltipPortal, TooltipPositioner,
  TooltipProvider, TooltipTrigger,
} from "~/components/ui/tooltip"
import { Button } from "~/components/ui/button"

export default function TooltipBasicDemo() {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-3">
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
          <TooltipPortal>
            <TooltipPositioner>
              <TooltipPopup>Default tooltip</TooltipPopup>
            </TooltipPositioner>
          </TooltipPortal>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}`

function TooltipBasicDemo() {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-3">
        {(["top", "right", "bottom", "left"] as const).map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger render={<Button variant="outline">{side.charAt(0).toUpperCase() + side.slice(1)}</Button>} />
            <TooltipPortal>
              <TooltipPositioner side={side}>
                <TooltipPopup>
                  Tooltip on {side}
                  <TooltipArrow />
                </TooltipPopup>
              </TooltipPositioner>
            </TooltipPortal>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}

export default function TooltipDemo() {
  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-xl font-semibold">Tooltip</h1>
        <p className="mt-1 text-sm text-muted-foreground">A simple text popup tip shown on hover. For richer content use Popover.</p>
      </header>
      <DemoBlock title="Placement" description="Tooltip on all four sides with an arrow." code={basicCode}>
        <TooltipBasicDemo />
      </DemoBlock>
    </div>
  )
}
