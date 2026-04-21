"use client"

import { DataTable, useDataTable, type ColumnType } from "~/components/data-table"
import { DemoSection } from "~/components/ui/demo-block"
import { people, type Person } from "~/components/data-table/demos/sample-data"

const columns: ColumnType<Person>[] = [
  { title: "Name", dataIndex: "name" },
  { title: "Role", dataIndex: "role" },
  { title: "City", dataIndex: "city" },
  { title: "Joined", dataIndex: "joined" },
]

const data = people.slice(0, 5)

export default function BorderedDemo() {
  return (
    <div className="flex flex-col gap-6">
      <DemoSection label="Monolith API">
        <DataTable columns={columns} dataSource={data} pagination={false} bordered />
      </DemoSection>

      <DemoSection label="Composition API">
        <Composed />
      </DemoSection>
    </div>
  )
}

function Composed() {
  const table = useDataTable<Person>({ columns, dataSource: data, pagination: false })
  return (
    <DataTable.Root table={table} bordered>
      <DataTable.Container>
        <DataTable.Table>
          <DataTable.Header />
          <DataTable.Body />
        </DataTable.Table>
      </DataTable.Container>
    </DataTable.Root>
  )
}
