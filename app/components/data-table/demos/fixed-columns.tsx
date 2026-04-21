"use client"

import { DataTable, useDataTable, type ColumnType } from "~/components/data-table"
import { Button } from "~/components/ui/button"
import { DemoSection } from "~/components/ui/demo-block"
import { people, type Person } from "~/components/data-table/demos/sample-data"

const columns: ColumnType<Person>[] = [
  { title: "Name", dataIndex: "name", fixed: "left", width: 160 },
  { title: "Role", dataIndex: "role", width: 140 },
  { title: "Status", dataIndex: "status", width: 140 },
  { title: "City", dataIndex: "city", width: 180 },
  { title: "Joined", dataIndex: "joined", width: 160 },
  { title: "Age", dataIndex: "age", width: 100, align: "right" },
  { title: "Notes", width: 260, render: () => "Lorem ipsum dolor sit amet, consectetur adipiscing." },
  { title: "Email", width: 240, render: (_v, r) => `${r.name.toLowerCase().replace(" ", ".")}@example.com` },
  {
    title: "Actions",
    fixed: "right",
    width: 120,
    align: "right",
    render: () => (
      <Button size="xs" variant="outline">
        Edit
      </Button>
    ),
  },
]

export default function FixedColumnsDemo() {
  return (
    <div className="flex flex-col gap-6">
      <DemoSection label="Monolith API — scroll horizontally to see the left/right columns stay pinned">
        <DataTable
          columns={columns}
          dataSource={people.slice(0, 6)}
          pagination={false}
          scroll={{ x: 1400 }}
        />
      </DemoSection>
      <DemoSection label="Composition API">
        <Composed />
      </DemoSection>
    </div>
  )
}

function Composed() {
  const table = useDataTable<Person>({ columns, dataSource: people.slice(0, 6), pagination: false })
  return (
    <DataTable.Root table={table}>
      <DataTable.Container>
        <div style={{ minWidth: 1400 }}>
          <DataTable.Table>
            <DataTable.Header />
            <DataTable.Body />
          </DataTable.Table>
        </div>
      </DataTable.Container>
    </DataTable.Root>
  )
}
