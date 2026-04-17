"use client"

import { useState } from "react"
import { Progress } from "~/components/ui/progress"
import { Button } from "~/components/ui/button"
import { DemoSection } from "~/components/ui/demo-block"

export default function ProgressBasicDemo() {
  const [percent, setPercent] = useState(30)

  return (
    <div className="flex flex-col gap-6 max-w-sm">
      <DemoSection label={`Line — ${percent}%`}>
        <div className="flex flex-col gap-3">
          <Progress percent={percent} />
          <Progress percent={percent} status="active" />
          <Progress percent={100} status="success" />
          <Progress percent={70} status="exception" />
          <Progress percent={percent} size="large" />
          <Progress percent={percent} showInfo={false} />
        </div>
      </DemoSection>

      <DemoSection label="Circle">
        <div className="flex gap-3 flex-wrap">
          <Progress type="circle" percent={percent} />
          <Progress type="circle" percent={100} status="success" />
          <Progress type="circle" percent={70} status="exception" width={60} />
        </div>
      </DemoSection>

      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setPercent((p) => Math.max(0, p - 10))}>−10%</Button>
        <Button size="sm" variant="outline" onClick={() => setPercent((p) => Math.min(100, p + 10))}>+10%</Button>
      </div>
    </div>
  )
}
