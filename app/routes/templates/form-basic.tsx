"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input, Textarea } from "~/components/ui/input"
import { InputNumber } from "~/components/ui/input-number"
import { Select } from "~/components/ui/select"
import { RadioGroup } from "~/components/ui/radio"
import { DateRangePicker } from "~/components/ui/date-range-picker"

const clientOptions = [
  { value: "alipay", label: "Alipay" },
  { value: "taobao", label: "Taobao" },
  { value: "tmall", label: "Tmall" },
  { value: "antdesign", label: "Ant Design" },
]

const visibilityOptions = [
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
  { value: "custom", label: "Custom" },
]

const visibilityHints: Record<string, string> = {
  public: "All team members in the same organization can see the project.",
  private: "Only you can see this project.",
  custom: "Select specific people who can view this project.",
}

export default function FormBasic() {
  const [visibility, setVisibility] = useState("public")

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Basic Form</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Submit your work or task information for review.</p>
      </div>

      <div className="rounded-xl border bg-card p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Title <span className="text-destructive">*</span>
          </label>
          <Input placeholder="Give the target a name" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Start – End Date <span className="text-destructive">*</span>
          </label>
          <DateRangePicker placeholder="Select date range" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Goal Description</label>
          <Textarea rows={4} placeholder="Please enter the goal description" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Measurement Standard</label>
          <Textarea rows={3} placeholder="Please enter the measurement standard" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Client <span className="text-destructive">*</span>
          </label>
          <Select placeholder="Select client" options={clientOptions} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Reviewer <span className="text-destructive">*</span>
          </label>
          <Input placeholder="Search reviewer" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Weight (1–10)</label>
          <InputNumber min={1} max={10} defaultValue={3} controls className="w-32" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Visibility</label>
          <RadioGroup
            options={visibilityOptions}
            value={visibility}
            onChange={setVisibility}
            direction="horizontal"
          />
          <p className="text-xs text-muted-foreground mt-1.5">{visibilityHints[visibility]}</p>
        </div>

        <div className="flex gap-3 pt-2 border-t">
          <Button>Submit</Button>
          <Button variant="outline">Save Draft</Button>
          <Button variant="ghost">Reset</Button>
        </div>
      </div>
    </div>
  )
}
