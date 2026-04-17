import { Badge } from "~/components/ui/badge"
import { Avatar } from "~/components/ui/avatar"
import { DemoItem } from "~/components/ui/demo-block"

export default function BadgeBasicDemo() {
  return (
    <div className="flex items-start gap-6">
      <DemoItem label="Count">
        <Badge count={5}>
          <Avatar>AB</Avatar>
        </Badge>
      </DemoItem>
      <DemoItem label="Show zero">
        <Badge count={0} showZero>
          <Avatar>CD</Avatar>
        </Badge>
      </DemoItem>
      <DemoItem label="Large count">
        <Badge count={99}>
          <Avatar>EF</Avatar>
        </Badge>
      </DemoItem>
      <DemoItem label="Overflow">
        <Badge count={100} overflowCount={99}>
          <Avatar>GH</Avatar>
        </Badge>
      </DemoItem>
      <DemoItem label="Dot">
        <Badge dot>
          <Avatar>IJ</Avatar>
        </Badge>
      </DemoItem>
    </div>
  )
}
