import { Tabs } from "~/components/ui/tabs"
import type { TabItem } from "~/components/ui/tabs"
import { DemoSection } from "~/components/ui/demo-block"

const ITEMS: TabItem[] = [
  { key: "overview", label: "Overview", children: <p className="text-sm text-muted-foreground">Overview content — key metrics and summary information for the selected period.</p> },
  { key: "analytics", label: "Analytics", children: <p className="text-sm text-muted-foreground">Analytics content — detailed breakdowns and trend data.</p> },
  { key: "reports", label: "Reports", children: <p className="text-sm text-muted-foreground">Reports content — export and schedule automated reports.</p> },
  { key: "disabled", label: "Disabled", disabled: true, children: null },
]

export default function TabsBasicDemo() {
  return (
    <div className="flex flex-col gap-8 max-w-lg">
      <DemoSection label="Line (default)">
        <Tabs items={ITEMS} defaultActiveKey="overview" />
      </DemoSection>
      <DemoSection label="Card">
        <Tabs items={ITEMS} defaultActiveKey="analytics" type="card" />
      </DemoSection>
      <DemoSection label="Small">
        <Tabs items={ITEMS.slice(0, 3)} defaultActiveKey="overview" size="small" />
      </DemoSection>
    </div>
  )
}
