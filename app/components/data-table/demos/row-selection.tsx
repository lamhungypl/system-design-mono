"use client"

import { useState } from "react"
import type { Key } from "react"
import { DataTable, useDataTable, type ColumnType } from "~/components/data-table"
import { DemoSection } from "~/components/ui/demo-block"
import { people, type Person } from "~/components/data-table/demos/sample-data"

const columns: ColumnType<Person>[] = [
  { title: "Name", dataIndex: "name" },
  { title: "Role", dataIndex: "role" },
  { title: "Status", dataIndex: "status" },
  { title: "City", dataIndex: "city" },
]

const data = people.slice(0, 6)

export default function RowSelectionDemo() {
  return (
    <div className="flex flex-col gap-6">
      <DemoSection label="Monolith API">
        <MonolithExample />
      </DemoSection>
      <DemoSection label="Composition API">
        <CompositionExample />
      </DemoSection>
    </div>
  )
}

function MonolithExample() {
  const [selected, setSelected] = useState<Key[]>([])
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-muted-foreground">Selected: {selected.length}</p>
      <DataTable
        columns={columns}
        dataSource={data}
        pagination={false}
        rowSelection={{
          type: "checkbox",
          selectedRowKeys: selected,
          onChange: (keys) => setSelected(keys),
        }}
      />
    </div>
  )
}

function CompositionExample() {
  const [selected, setSelected] = useState<Key[]>([])
  const table = useDataTable<Person>({
    columns,
    dataSource: data,
    pagination: false,
    rowSelection: {
      type: "checkbox",
      selectedRowKeys: selected,
      onChange: (keys) => setSelected(keys),
    },
  })
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-muted-foreground">Selected: {selected.length}</p>
      <DataTable.Root table={table}>
        <DataTable.Container>
          <DataTable.Table>
            <DataTable.Header />
            <DataTable.Body />
          </DataTable.Table>
        </DataTable.Container>
      </DataTable.Root>
    </div>
  )
}
