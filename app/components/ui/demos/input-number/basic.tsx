"use client"

import { InputNumber } from "~/components/ui/input-number"
import { DemoSection } from "~/components/ui/demo-block"

export default function InputNumberBasicDemo() {
  return (
    <div className="flex flex-col gap-5">
      <DemoSection label="Sizes">
        <div className="flex flex-wrap items-center gap-3">
          <InputNumber size="small" defaultValue={5} placeholder="Small" />
          <InputNumber defaultValue={3} min={1} max={10} placeholder="Default" />
          <InputNumber size="large" defaultValue={7} placeholder="Large" />
        </div>
      </DemoSection>
      <DemoSection label="Decorators">
        <div className="flex flex-wrap items-center gap-3">
          <InputNumber prefix="$" defaultValue={100} step={10} precision={2} />
          <InputNumber suffix="%" min={0} max={100} defaultValue={50} />
          <InputNumber controls={false} defaultValue={42} placeholder="No controls" />
        </div>
      </DemoSection>
      <DemoSection label="States">
        <div className="flex flex-wrap items-center gap-3">
          <InputNumber disabled defaultValue={5} />
          <InputNumber status="error" defaultValue={0} min={1} />
        </div>
      </DemoSection>
    </div>
  )
}
