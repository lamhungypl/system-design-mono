"use client"

import { DataTable, useDataTable, type ColumnType } from "~/components/data-table"
import { DemoSection } from "~/components/ui/demo-block"
import { people, type Person } from "~/components/data-table/demos/sample-data"

const columns: ColumnType<Person>[] = [
  { title: "Name", dataIndex: "name" },
  {
    title: "Role",
    dataIndex: "role",
    filters: [
      { text: "Engineer", value: "Engineer" },
      { text: "Designer", value: "Designer" },
      { text: "PM", value: "PM" },
      { text: "Analyst", value: "Analyst" },
    ],
  },
  {
    title: "Status",
    dataIndex: "status",
    filters: [
      { text: "Active", value: "Active" },
      { text: "Invited", value: "Invited" },
      { text: "Paused", value: "Paused" },
    ],
  },
  { title: "City", dataIndex: "city" },
]

export default function FilteringDemo() {
  return (
    <div className="flex flex-col gap-6">
      <DemoSection label="Monolith API">
        <DataTable columns={columns} dataSource={people} pagination={false} />
      </DemoSection>

      <DemoSection label="Composition API">
        <Composed />
      </DemoSection>
    </div>
  )
}

function Composed() {
  const table = useDataTable<Person>({ columns, dataSource: people, pagination: false })
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
