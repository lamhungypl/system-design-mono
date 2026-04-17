import { Skeleton } from "~/components/ui/skeleton"
import { DemoSection } from "~/components/ui/demo-block"

export default function SkeletonBasicDemo() {
  return (
    <div className="flex flex-col gap-6 max-w-sm">
      <DemoSection label="Default">
        <Skeleton />
      </DemoSection>
      <DemoSection label="With avatar and paragraph">
        <Skeleton avatar paragraph={{ rows: 4 }} />
      </DemoSection>
      <DemoSection label="Inline elements">
        <div className="flex gap-3">
          <Skeleton.Button />
          <Skeleton.Button size="small" />
          <Skeleton.Input />
        </div>
      </DemoSection>
    </div>
  )
}
