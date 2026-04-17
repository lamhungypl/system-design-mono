"use client"

import { useState } from "react"
import { Steps } from "~/components/ui/steps"
import { Button } from "~/components/ui/button"
import type { StepItem } from "~/components/ui/steps"
import { DemoSection } from "~/components/ui/demo-block"

const STEPS: StepItem[] = [
  { title: "Account", description: "Create your account" },
  { title: "Profile", description: "Set up your profile" },
  { title: "Billing", description: "Add payment method" },
  { title: "Review", description: "Confirm and launch" },
]

export default function StepsBasicDemo() {
  const [current, setCurrent] = useState(1)

  return (
    <div className="flex flex-col gap-8 max-w-lg">
      <DemoSection label="Horizontal">
        <div className="flex flex-col gap-3">
          <Steps current={current} items={STEPS} onChange={setCurrent} />
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}>
              Back
            </Button>
            <Button size="sm" onClick={() => setCurrent((c) => Math.min(STEPS.length - 1, c + 1))} disabled={current === STEPS.length - 1}>
              Next
            </Button>
          </div>
        </div>
      </DemoSection>

      <DemoSection label="Vertical">
        <Steps
          current={1}
          direction="vertical"
          items={[
            { title: "Submitted", description: "2026-04-10 10:00" },
            { title: "In Review", description: "2026-04-11 14:30" },
            { title: "Approved", description: "Waiting" },
          ]}
        />
      </DemoSection>

      <DemoSection label="Small">
        <Steps
          current={2}
          size="small"
          items={[
            { title: "Pending" },
            { title: "Shipped" },
            { title: "Delivered" },
            { title: "Reviewed" },
          ]}
        />
      </DemoSection>
    </div>
  )
}
