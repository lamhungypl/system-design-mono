"use client"

import { useState } from "react"
import { Switch } from "~/components/ui/switch"
import { DemoItem } from "~/components/ui/demo-block"

export default function SwitchBasicDemo() {
  const [on, setOn] = useState(true)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start gap-6">
        <DemoItem label="Default">
          <Switch checked={on} onCheckedChange={setOn} />
        </DemoItem>
        <DemoItem label="Small">
          <Switch size="small" checked={on} onCheckedChange={setOn} />
        </DemoItem>
        <DemoItem label="Disabled">
          <Switch disabled defaultChecked />
        </DemoItem>
        <DemoItem label="Loading">
          <Switch loading checked={on} />
        </DemoItem>
      </div>
      <div className="flex flex-wrap items-start gap-6">
        <DemoItem label="With text labels">
          <Switch checked={on} onCheckedChange={setOn} checkedChildren="On" unCheckedChildren="Off" />
        </DemoItem>
        <DemoItem label="With label">
          <Switch checked={on} onCheckedChange={setOn}>Enable notifications</Switch>
        </DemoItem>
      </div>
    </div>
  )
}
