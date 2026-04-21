"use client"

import { useMemo, useState } from "react"
import { DataTable, useDataTable, type ColumnType } from "~/components/data-table"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Select } from "~/components/ui/select"
import { DemoSection } from "~/components/ui/demo-block"
import { people, type Person } from "~/components/data-table/demos/sample-data"

const columns: ColumnType<Person>[] = [
  { title: "Name", dataIndex: "name" },
  { title: "Role", dataIndex: "role" },
  { title: "Status", dataIndex: "status" },
  { title: "City", dataIndex: "city" },
]

interface FilterForm {
  name: string
  role: string
  status: string
}

const emptyForm: FilterForm = { name: "", role: "", status: "" }

function applyFilters(rows: Person[], applied: FilterForm) {
  return rows.filter((r) => {
    if (applied.name && !r.name.toLowerCase().includes(applied.name.toLowerCase())) return false
    if (applied.role && r.role !== applied.role) return false
    if (applied.status && r.status !== applied.status) return false
    return true
  })
}

function FilterForm({
  draft,
  onChange,
  onSubmit,
  onReset,
}: {
  draft: FilterForm
  onChange: (next: FilterForm) => void
  onSubmit: () => void
  onReset: () => void
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
      className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-muted/30 p-3"
    >
      <label className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">Name contains</span>
        <Input
          value={draft.name}
          onChange={(e) => onChange({ ...draft, name: e.target.value })}
          placeholder="Search name…"
          className="w-48"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">Role</span>
        <Select
          value={draft.role}
          onChange={(v) => onChange({ ...draft, role: v })}
          options={[
            { value: "", label: "Any" },
            { value: "Engineer", label: "Engineer" },
            { value: "Designer", label: "Designer" },
            { value: "PM", label: "PM" },
            { value: "Analyst", label: "Analyst" },
          ]}
          className="w-40"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">Status</span>
        <Select
          value={draft.status}
          onChange={(v) => onChange({ ...draft, status: v })}
          options={[
            { value: "", label: "Any" },
            { value: "Active", label: "Active" },
            { value: "Invited", label: "Invited" },
            { value: "Paused", label: "Paused" },
          ]}
          className="w-40"
        />
      </label>
      <div className="flex items-center gap-2 ml-auto">
        <Button type="button" variant="ghost" size="sm" onClick={onReset}>
          Reset
        </Button>
        <Button type="submit" size="sm">
          Apply
        </Button>
      </div>
    </form>
  )
}

export default function FilterFormDemo() {
  return (
    <div className="flex flex-col gap-6">
      <DemoSection label="Monolith API — form state is local to the demo, applied only on Submit">
        <MonolithExample />
      </DemoSection>
      <DemoSection label="Composition API — the form sits above DataTable.Container as a peer">
        <CompositionExample />
      </DemoSection>
    </div>
  )
}

function MonolithExample() {
  const [draft, setDraft] = useState<FilterForm>(emptyForm)
  const [applied, setApplied] = useState<FilterForm>(emptyForm)
  const filtered = useMemo(() => applyFilters(people, applied), [applied])

  return (
    <div className="flex flex-col gap-3">
      <FilterForm
        draft={draft}
        onChange={setDraft}
        onSubmit={() => setApplied(draft)}
        onReset={() => {
          setDraft(emptyForm)
          setApplied(emptyForm)
        }}
      />
      <DataTable columns={columns} dataSource={filtered} pagination={{ defaultPageSize: 5 }} />
    </div>
  )
}

function CompositionExample() {
  const [draft, setDraft] = useState<FilterForm>(emptyForm)
  const [applied, setApplied] = useState<FilterForm>(emptyForm)
  const filtered = useMemo(() => applyFilters(people, applied), [applied])
  const table = useDataTable<Person>({
    columns,
    dataSource: filtered,
    pagination: { defaultPageSize: 5 },
  })

  return (
    <DataTable.Root table={table}>
      <FilterForm
        draft={draft}
        onChange={setDraft}
        onSubmit={() => setApplied(draft)}
        onReset={() => {
          setDraft(emptyForm)
          setApplied(emptyForm)
        }}
      />
      <DataTable.Container>
        <DataTable.Table>
          <DataTable.Header />
          <DataTable.Body />
        </DataTable.Table>
      </DataTable.Container>
      <DataTable.Pagination />
    </DataTable.Root>
  )
}
