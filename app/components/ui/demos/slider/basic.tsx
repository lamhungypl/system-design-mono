"use client"

import { useState } from "react"
import { Slider } from "~/components/ui/slider"
import { DemoSection } from "~/components/ui/demo-block"

export default function SliderBasicDemo() {
  const [value, setValue] = useState(30)
  const [range, setRange] = useState<number[]>([20, 70])

  return (
    <div className="flex flex-col gap-8 max-w-sm">
      <DemoSection label={`Basic — ${value}%`}>
        <Slider value={value} onChange={(v) => setValue(v as number)} />
      </DemoSection>

      <DemoSection label={`Range — ${range[0]}% – ${range[1]}%`}>
        <Slider range value={range} onChange={(v) => setRange(v as number[])} />
      </DemoSection>

      <DemoSection label="With marks">
        <Slider
          marks={[{ value: 0, label: "0°C" }, { value: 37, label: "37°C" }, { value: 100, label: "100°C" }]}
          defaultValue={37}
        />
      </DemoSection>

      <DemoSection label="Disabled">
        <Slider disabled defaultValue={50} />
      </DemoSection>
    </div>
  )
}
