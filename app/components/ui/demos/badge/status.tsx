import { Badge } from "~/components/ui/badge"
import { DemoItem } from "~/components/ui/demo-block"

export default function BadgeStatusDemo() {
  return (
    <div className="flex flex-wrap gap-6">
      <DemoItem label="Default">
        <Badge status="default" text="Default" />
      </DemoItem>
      <DemoItem label="Processing">
        <Badge status="processing" text="Processing" />
      </DemoItem>
      <DemoItem label="Success">
        <Badge status="success" text="Success" />
      </DemoItem>
      <DemoItem label="Warning">
        <Badge status="warning" text="Warning" />
      </DemoItem>
      <DemoItem label="Error">
        <Badge status="error" text="Error" />
      </DemoItem>
    </div>
  )
}
