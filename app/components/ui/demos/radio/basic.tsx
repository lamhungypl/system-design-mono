"use client"

import { useState } from "react"
import { Radio, RadioGroup } from "~/components/ui/radio"
import type { RadioOption } from "~/components/ui/radio"
import { DemoSection } from "~/components/ui/demo-block"

const OPTIONS: RadioOption[] = [
  { label: "Option A", value: "a" },
  { label: "Option B", value: "b" },
  { label: "Option C", value: "c" },
  { label: "Disabled", value: "d", disabled: true },
]

export default function RadioBasicDemo() {
  const [value, setValue] = useState("a")

  return (
    <div className="flex flex-col gap-5">
      <DemoSection label="Standalone">
        <div className="flex items-center gap-4">
          <Radio value="x">Standalone radio</Radio>
          <Radio value="y" disabled>Disabled</Radio>
        </div>
      </DemoSection>

      <DemoSection label="Group">
        <RadioGroup options={OPTIONS} value={value} onChange={setValue} />
        <p className="text-xs text-muted-foreground">Selected: {value}</p>
      </DemoSection>

      <DemoSection label="Button style — outline">
        <RadioGroup options={OPTIONS.slice(0, 3)} optionType="button" value={value} onChange={setValue} />
      </DemoSection>

      <DemoSection label="Button style — solid">
        <RadioGroup options={OPTIONS.slice(0, 3)} optionType="button" buttonStyle="solid" value={value} onChange={setValue} />
      </DemoSection>
    </div>
  )
}
