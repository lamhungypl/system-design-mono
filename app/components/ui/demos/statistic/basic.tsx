import { Statistic } from "~/components/ui/statistic"
import { Separator } from "~/components/ui/separator"
import { DemoSection } from "~/components/ui/demo-block"

export default function StatisticBasicDemo() {
  return (
    <div className="flex flex-col gap-6">
      <DemoSection label="Basic">
        <div className="flex flex-wrap gap-10">
          <Statistic title="Active Users" value={11238} />
          <Separator orientation="vertical" className="h-16" />
          <Statistic title="Monthly Growth" value={12.5} suffix="%" valueStyle={{ color: "#22c55e" }} />
          <Separator orientation="vertical" className="h-16" />
          <Statistic title="Revenue" prefix="$" value={93850.5} precision={2} />
          <Separator orientation="vertical" className="h-16" />
          <Statistic title="Pending Orders" value={42} loading={false} />
        </div>
      </DemoSection>
    </div>
  )
}
