"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input, Textarea } from "~/components/ui/input"
import { Select } from "~/components/ui/select"
import { RadioGroup } from "~/components/ui/radio"

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-6 py-4 transition-colors hover:bg-muted/30"
      >
        <span className="text-sm font-semibold">{title}</span>
        {open ? (
          <ChevronUp className="size-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="size-4 text-muted-foreground" />
        )}
      </button>
      {open && <div className="space-y-0 border-t px-6 pb-6">{children}</div>}
    </div>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-4 items-start gap-4 pt-4">
      <label className="pt-2 text-right text-sm font-medium text-muted-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      <div className="col-span-3">{children}</div>
    </div>
  )
}

const ownerOptions = [
  { value: "付小小", label: "付小小" },
  { value: "曲丽丽", label: "曲丽丽" },
]

const reviewerOptions = [
  { value: "林东东", label: "林东东" },
  { value: "周星星", label: "周星星" },
]

const typeOptions = [
  { value: "private", label: "Private" },
  { value: "public", label: "Public" },
]

const priorityOptions = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
]

const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
]

export default function FormAdvanced() {
  const [members, setMembers] = useState([{ name: "", role: "" }])

  return (
    <div className="max-w-3xl space-y-4 p-6">
      <div className="mb-2">
        <h1 className="text-xl font-semibold">Advanced Form</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          For complex multi-section data entry with collapsible panels.
        </p>
      </div>

      <Section title="Warehouse Information">
        <Field label="Warehouse Name" required>
          <Input placeholder="Enter warehouse name" />
        </Field>
        <Field label="Warehouse Domain">
          <Input
            addonBefore="https://"
            addonAfter=".antdesign.com"
            placeholder="your-domain"
          />
        </Field>
        <Field label="Owner" required>
          <div className="flex gap-2">
            <Select options={ownerOptions} className="w-36" />
            <Input placeholder="Phone number" className="flex-1" />
          </div>
        </Field>
        <Field label="Reviewer" required>
          <Select options={reviewerOptions} />
        </Field>
        <Field label="Effective Date">
          <div className="flex items-center gap-2">
            <input
              type="date"
              className="h-9 flex-1 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            <span className="text-muted-foreground">–</span>
            <input
              type="date"
              className="h-9 flex-1 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
        </Field>
        <Field label="Type">
          <RadioGroup
            options={typeOptions}
            defaultValue="private"
            direction="horizontal"
          />
        </Field>
      </Section>

      <Section title="Task Management">
        <Field label="Task Name" required>
          <Input placeholder="Enter task name" />
        </Field>
        <Field label="Task Description">
          <Textarea rows={3} placeholder="Enter task description" />
        </Field>
        <Field label="Executor" required>
          <Input placeholder="Search executor" />
        </Field>
        <Field label="Execution Time">
          <input
            type="datetime-local"
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </Field>
        <Field label="Priority">
          <Select
            options={priorityOptions}
            defaultValue="high"
            className="w-40"
          />
        </Field>
      </Section>

      <Section title="Member Management" defaultOpen={false}>
        <div className="space-y-2 pt-4">
          {members.map((m, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                placeholder="Member name"
                value={m.name}
                onChange={(e) => {
                  const next = [...members]
                  next[i].name = e.target.value
                  setMembers(next)
                }}
                className="flex-1"
              />
              <Select
                options={roleOptions}
                value={m.role || undefined}
                onChange={(v) => {
                  const next = [...members]
                  next[i].role = v
                  setMembers(next)
                }}
                placeholder="Role"
                className="w-36"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMembers(members.filter((_, j) => j !== i))}
              >
                <Trash2 className="size-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMembers([...members, { name: "", role: "" }])}
            className="gap-1.5 text-primary"
          >
            <Plus className="size-4" /> Add Member
          </Button>
        </div>
      </Section>

      <div className="flex gap-3 pt-2">
        <Button>Submit</Button>
        <Button variant="outline">Save</Button>
        <Button variant="ghost">Reset</Button>
      </div>
    </div>
  )
}
