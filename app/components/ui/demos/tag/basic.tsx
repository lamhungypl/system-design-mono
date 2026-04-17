import { Tag } from "~/components/ui/tag"
import { DemoSection } from "~/components/ui/demo-block"

export default function TagBasicDemo() {
  return (
    <div className="flex flex-col gap-4">
      <DemoSection label="Colors">
        <div className="flex flex-wrap gap-2">
          <Tag>Default</Tag>
          <Tag color="primary">Primary</Tag>
          <Tag color="success">Success</Tag>
          <Tag color="warning">Warning</Tag>
          <Tag color="error">Error</Tag>
          <Tag color="processing">Processing</Tag>
        </div>
      </DemoSection>
      <DemoSection label="Borderless">
        <div className="flex flex-wrap gap-2">
          <Tag bordered={false}>Default</Tag>
          <Tag bordered={false} color="primary">Primary</Tag>
          <Tag bordered={false} color="success">Success</Tag>
          <Tag bordered={false} color="warning">Warning</Tag>
          <Tag bordered={false} color="error">Error</Tag>
        </div>
      </DemoSection>
    </div>
  )
}
