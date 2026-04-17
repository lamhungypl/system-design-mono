import { Popover } from "~/components/ui/popover"
import { Button } from "~/components/ui/button"
import { DemoSection } from "~/components/ui/demo-block"

export default function PopoverBasicDemo() {
  return (
    <div className="flex flex-col gap-6">
      <DemoSection label="Placements">
        <div className="flex flex-wrap gap-3">
          <Popover title="Title" content="This is the popover content. Place any information here." placement="top">
            <Button variant="outline">Top</Button>
          </Popover>
          <Popover title="Title" content="Popover content on the right side." placement="right">
            <Button variant="outline">Right</Button>
          </Popover>
          <Popover title="Title" content="Popover content on the bottom." placement="bottom">
            <Button variant="outline">Bottom</Button>
          </Popover>
          <Popover title="Title" content="Popover content on the left side." placement="left">
            <Button variant="outline">Left</Button>
          </Popover>
        </div>
      </DemoSection>
      <DemoSection label="Rich content">
        <Popover
          content={
            <div className="flex flex-col gap-1">
              <p className="font-medium">Rich content</p>
              <p className="text-muted-foreground text-xs">Popover can contain any React node, including interactive elements.</p>
              <Button size="xs" className="mt-1 self-start">Action</Button>
            </div>
          }
        >
          <Button>Rich popover</Button>
        </Popover>
      </DemoSection>
    </div>
  )
}
