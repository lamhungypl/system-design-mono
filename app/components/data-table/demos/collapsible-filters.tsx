"use client"

import { useMemo, useState } from "react"
import { ChevronRight, SlidersHorizontal } from "lucide-react"
import { DataTable, useDataTable, type ColumnType } from "~/components/data-table"
import { Button } from "~/components/ui/button"
import { Select } from "~/components/ui/select"
import { DemoSection } from "~/components/ui/demo-block"
import { cn } from "~/lib/utils"
import { people, type Person } from "~/components/data-table/demos/sample-data"

const columns: ColumnType<Person>[] = [
  { title: "Name", dataIndex: "name" },
  { title: "Role", dataIndex: "role" },
  { title: "Status", dataIndex: "status" },
  { title: "City", dataIndex: "city" },
]

interface FilterState {
  role: string
  status: string
}
const emptyFilters: FilterState = { role: "", status: "" }

function apply(rows: Person[], f: FilterState) {
  return rows.filter(
    (r) =>
      (!f.role || r.role === f.role) && (!f.status || r.status === f.status),
  )
}

function CollapsibleToolbar({
  open,
  onToggle,
  filters,
  onChange,
  activeCount,
}: {
  open: boolean
  onToggle: () => void
  filters: FilterState
  onChange: (f: FilterState) => void
  activeCount: number
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/20">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted/40"
        aria-expanded={open}
      >
        <ChevronRight
          className="size-4 text-muted-foreground transition-transform"
          style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
        />
        <SlidersHorizontal className="size-4 text-muted-foreground" />
        <span className="font-medium">Filters</span>
        {activeCount > 0 && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
            {activeCount} active
          </span>
        )}
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-wrap items-end gap-3 border-t border-border/60 p-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Role</span>
              <Select
                value={filters.role}
                onChange={(v) => onChange({ ...filters, role: v })}
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
                value={filters.status}
                onChange={(v) => onChange({ ...filters, status: v })}
                options={[
                  { value: "", label: "Any" },
                  { value: "Active", label: "Active" },
                  { value: "Invited", label: "Invited" },
                  { value: "Paused", label: "Paused" },
                ]}
                className="w-40"
              />
            </label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange(emptyFilters)}
              className="ml-auto"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CollapsibleFiltersDemo() {
  return (
    <div className="flex flex-col gap-6">
      <DemoSection label="Monolith API — the toolbar is rendered above the DataTable">
        <MonolithExample />
      </DemoSection>
      <DemoSection label="Composition API — the toolbar is a sibling inside DataTable.Root">
        <CompositionExample />
      </DemoSection>
    </div>
  )
}

function useActiveCount(f: FilterState) {
  return (f.role ? 1 : 0) + (f.status ? 1 : 0)
}

function MonolithExample() {
  const [open, setOpen] = useState(true)
  const [filters, setFilters] = useState<FilterState>(emptyFilters)
  const filtered = useMemo(() => apply(people, filters), [filters])
  const active = useActiveCount(filters)

  return (
    <div className="flex flex-col gap-3">
      <CollapsibleToolbar
        open={open}
        onToggle={() => setOpen((v) => !v)}
        filters={filters}
        onChange={setFilters}
        activeCount={active}
      />
      <DataTable columns={columns} dataSource={filtered} pagination={{ defaultPageSize: 5 }} />
    </div>
  )
}

function CompositionExample() {
  const [open, setOpen] = useState(true)
  const [filters, setFilters] = useState<FilterState>(emptyFilters)
  const filtered = useMemo(() => apply(people, filters), [filters])
  const active = useActiveCount(filters)
  const table = useDataTable<Person>({
    columns,
    dataSource: filtered,
    pagination: { defaultPageSize: 5 },
  })

  return (
    <DataTable.Root table={table}>
      <CollapsibleToolbar
        open={open}
        onToggle={() => setOpen((v) => !v)}
        filters={filters}
        onChange={setFilters}
        activeCount={active}
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
