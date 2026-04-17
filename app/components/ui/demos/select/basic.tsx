"use client"

import { useState } from "react"
import { Select } from "~/components/ui/select"
import type { SelectOption } from "~/components/ui/select"
import { DemoSection } from "~/components/ui/demo-block"

const FRUITS: SelectOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "durian", label: "Durian (disabled)", disabled: true },
  { value: "elderberry", label: "Elderberry" },
]

const GROUPED = [
  { label: "Fruits", options: [{ value: "apple", label: "Apple" }, { value: "mango", label: "Mango" }] },
  { label: "Vegetables", options: [{ value: "carrot", label: "Carrot" }, { value: "spinach", label: "Spinach" }] },
]

export default function SelectBasicDemo() {
  const [value, setValue] = useState<string>("")

  return (
    <div className="flex flex-col gap-5 max-w-xs">
      <DemoSection label="Sizes">
        <div className="flex flex-col gap-2">
          <Select options={FRUITS} size="small" placeholder="Small" />
          <Select options={FRUITS} placeholder="Default" value={value} onChange={setValue} />
          <Select options={FRUITS} size="large" placeholder="Large" />
        </div>
      </DemoSection>
      <DemoSection label="Grouped options">
        <Select options={GROUPED} placeholder="Grouped options" />
      </DemoSection>
      <DemoSection label="States">
        <div className="flex flex-col gap-2">
          <Select options={FRUITS} status="error" placeholder="Error state" />
          <Select options={FRUITS} disabled placeholder="Disabled" />
        </div>
      </DemoSection>
      <p className="text-xs text-muted-foreground">Selected: {value || "—"}</p>
    </div>
  )
}
