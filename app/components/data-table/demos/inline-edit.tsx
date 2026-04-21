"use client"

import { useState } from "react"
import { DataTable, useDataTable, type ColumnType } from "~/components/data-table"
import { Input } from "~/components/ui/input"
import { Select } from "~/components/ui/select"
import { DemoSection } from "~/components/ui/demo-block"
import { cn } from "~/lib/utils"
import { people, type Person } from "~/components/data-table/demos/sample-data"

function EditableText({
  value,
  onSave,
  className,
}: {
  value: string
  onSave: (next: string) => void
  className?: string
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  if (editing) {
    return (
      <Input
        autoFocus
        value={draft}
        size="small"
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          if (draft !== value) onSave(draft)
          setEditing(false)
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (draft !== value) onSave(draft)
            setEditing(false)
          }
          if (e.key === "Escape") {
            setDraft(value)
            setEditing(false)
          }
        }}
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => {
        setDraft(value)
        setEditing(true)
      }}
      className={cn(
        "w-full text-left rounded-sm px-1 -mx-1 -my-0.5 py-0.5 cursor-text hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {value}
    </button>
  )
}

function EditableRole({ value, onSave }: { value: Person["role"]; onSave: (next: Person["role"]) => void }) {
  return (
    <Select
      size="small"
      value={value}
      onChange={(v) => onSave(v as Person["role"])}
      options={[
        { value: "Engineer", label: "Engineer" },
        { value: "Designer", label: "Designer" },
        { value: "PM", label: "PM" },
        { value: "Analyst", label: "Analyst" },
      ]}
    />
  )
}

function makeColumns(onEdit: (key: string, patch: Partial<Person>) => void): ColumnType<Person>[] {
  return [
    {
      title: "Name",
      dataIndex: "name",
      render: (_v, r) => (
        <EditableText value={r.name} onSave={(next) => onEdit(r.key, { name: next })} />
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (_v, r) => (
        <EditableRole value={r.role} onSave={(next) => onEdit(r.key, { role: next })} />
      ),
    },
    {
      title: "City",
      dataIndex: "city",
      render: (_v, r) => (
        <EditableText value={r.city} onSave={(next) => onEdit(r.key, { city: next })} />
      ),
    },
    { title: "Status", dataIndex: "status" },
  ]
}

function useEditableRows(initial: Person[]) {
  const [rows, setRows] = useState<Person[]>(initial)
  const onEdit = (key: string, patch: Partial<Person>) => {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)))
  }
  return { rows, onEdit }
}

export default function InlineEditDemo() {
  return (
    <div className="flex flex-col gap-6">
      <DemoSection label="Monolith API — click a Name or City cell to edit; Role is a dropdown">
        <MonolithExample />
      </DemoSection>
      <DemoSection label="Composition API">
        <CompositionExample />
      </DemoSection>
    </div>
  )
}

function MonolithExample() {
  const { rows, onEdit } = useEditableRows(people.slice(0, 5))
  const columns = makeColumns(onEdit)
  return <DataTable columns={columns} dataSource={rows} pagination={false} />
}

function CompositionExample() {
  const { rows, onEdit } = useEditableRows(people.slice(0, 5))
  const columns = makeColumns(onEdit)
  const table = useDataTable<Person>({ columns, dataSource: rows, pagination: false })
  return (
    <DataTable.Root table={table}>
      <DataTable.Container>
        <DataTable.Table>
          <DataTable.Header />
          <DataTable.Body />
        </DataTable.Table>
      </DataTable.Container>
    </DataTable.Root>
  )
}
