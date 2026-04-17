import { Card } from "~/components/ui/card"
import { Avatar } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { DemoSection } from "~/components/ui/demo-block"

export default function CardBasicDemo() {
  return (
    <div className="flex flex-col gap-5 max-w-sm">
      <DemoSection label="Basic">
        <Card title="Basic card">
          <p className="text-sm text-muted-foreground">Card content area. Place any content here.</p>
        </Card>
      </DemoSection>

      <DemoSection label="Small with extra action">
        <Card title="With extra action" extra={<a href="#" className="text-primary hover:underline text-xs">More</a>} size="small">
          <p className="text-sm text-muted-foreground">Compact card with a header action link.</p>
        </Card>
      </DemoSection>

      <DemoSection label="Meta">
        <Card>
          <Card.Meta
            avatar={<Avatar src="https://i.pravatar.cc/40?img=3" alt="User" />}
            title="Jordan Chen"
            description="Senior engineer · San Francisco"
          />
        </Card>
      </DemoSection>

      <DemoSection label="Loading state">
        <Card title="Loading state" loading />
      </DemoSection>
    </div>
  )
}
