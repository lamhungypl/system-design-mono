"use client"

import { useState } from "react"
import { Checkbox, CheckboxGroup } from "~/components/ui/checkbox"
import type { CheckboxOption } from "~/components/ui/checkbox"
import { DemoSection } from "~/components/ui/demo-block"

const OPTIONS: CheckboxOption[] = [
  { label: "Apple", value: "apple" },
  { label: "Pear", value: "pear" },
  { label: "Orange", value: "orange" },
  { label: "Grape (disabled)", value: "grape", disabled: true },
]

export default function CheckboxBasicDemo() {
  const [checked, setChecked] = useState(false)
  const [selected, setSelected] = useState<string[]>(["apple"])

  return (
    <div className="flex flex-col gap-5">
      <DemoSection label="Standalone">
        <div className="flex items-center gap-4">
          <Checkbox checked={checked} onCheckedChange={(v) => setChecked(!!v)}>
            Controlled
          </Checkbox>
          <Checkbox indeterminate>Indeterminate</Checkbox>
          <Checkbox disabled>Disabled</Checkbox>
          <Checkbox disabled defaultChecked>Disabled checked</Checkbox>
        </div>
      </DemoSection>

      <DemoSection label="Group — vertical">
        <CheckboxGroup options={OPTIONS} value={selected} onChange={setSelected} />
        <p className="text-xs text-muted-foreground">Selected: {selected.join(", ") || "none"}</p>
      </DemoSection>

      <DemoSection label="Group — horizontal">
        <CheckboxGroup options={OPTIONS} value={selected} onChange={setSelected} direction="horizontal" />
      </DemoSection>
    </div>
  )
}
